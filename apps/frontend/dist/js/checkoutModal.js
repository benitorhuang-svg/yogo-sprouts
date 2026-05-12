import { PRODUCTS } from "./data.js";
import { cart, getTotal, updateCartDisplay, syncProductCardQty } from "./cart.js";
import { showToast } from "./toast.js";
import { renderShop } from "./shop.js";
import { logAnalyticsEvent } from "./analytics.js";
let checkoutStep = 1;
let appliedCoupon = null;
let preferredDeliveryDate = '';
let generatedOrderId = '';
// Helper to get cart items for analytics
function getCartItemsDetails() {
    return PRODUCTS.filter(p => cart[p.id] > 0).map(p => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        quantity: cart[p.id]
    }));
}
// Helper to calculate coupon discount
function calculateDiscount(total, coupon) {
    if (total < coupon.minOrderAmount)
        return 0;
    if (coupon.type === 'fixed') {
        return coupon.value;
    }
    else if (coupon.type === 'percent') {
        return Math.round(total * (coupon.value / 100));
    }
    return 0;
}
export function openCheckoutModal() {
    const total = getTotal();
    if (total === 0) {
        showToast('⚠️ 請先選擇商品再進行結帳！');
        return;
    }
    // Precheck stocks
    for (const pidStr in cart) {
        const pid = Number(pidStr);
        const qty = cart[pid];
        if (qty > 0) {
            const p = PRODUCTS.find(prod => prod.id === pid);
            if (p) {
                if (p.stock === 0) {
                    showToast(`⚠️ [${p.name}] 已售完，已自購物籃移除。`);
                    cart[pid] = 0;
                    syncProductCardQty(pid);
                }
                else if (qty > p.stock) {
                    showToast(`⚠️ [${p.name}] 庫存不足，數量已自動調降至 ${p.stock} 件。`);
                    cart[pid] = p.stock;
                    syncProductCardQty(pid);
                }
            }
        }
    }
    updateCartDisplay();
    if (getTotal() === 0)
        return;
    // Log begin_checkout event (C1. Firebase Analytics)
    logAnalyticsEvent('begin_checkout', {
        value: total,
        currency: 'TWD',
        items: getCartItemsDetails()
    });
    const modal = document.getElementById('checkout-modal');
    if (!modal)
        return;
    checkoutStep = 1;
    appliedCoupon = null; // Reset coupon on open
    preferredDeliveryDate = ''; // Reset delivery date on open
    generatedOrderId = '';
    renderCheckoutStep();
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}
export function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.innerHTML = '';
    }
    document.body.classList.remove('modal-open');
}
function renderCheckoutStep() {
    const modal = document.getElementById('checkout-modal');
    if (!modal)
        return;
    let stepHtml = '';
    // Header/Step Indicator
    const stepsHeader = `
    <div class="checkout-steps-bar">
      <div class="step-indicator ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}">
        <span class="step-num">1</span>
        <span class="step-text">訂單明細</span>
      </div>
      <div class="step-line ${checkoutStep > 1 ? 'completed' : ''}"></div>
      <div class="step-indicator ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'completed' : ''}">
        <span class="step-num">2</span>
        <span class="step-text">填寫資訊</span>
      </div>
      <div class="step-line ${checkoutStep > 2 ? 'completed' : ''}"></div>
      <div class="step-indicator ${checkoutStep >= 3 ? 'active' : ''} ${checkoutStep > 3 ? 'completed' : ''}">
        <span class="step-num">3</span>
        <span class="step-text">送出確認</span>
      </div>
      <div class="step-line ${checkoutStep > 3 ? 'completed' : ''}"></div>
      <div class="step-indicator ${checkoutStep >= 4 ? 'active' : ''}">
        <span class="step-num">4</span>
        <span class="step-text">預購成功</span>
      </div>
    </div>
  `;
    if (checkoutStep === 1) {
        // Step 1: Order details split by cold / dry temperature
        const coldItems = PRODUCTS.filter(p => cart[p.id] > 0 && p.cold);
        const dryItems = PRODUCTS.filter(p => cart[p.id] > 0 && !p.cold);
        const coldSubtotal = coldItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);
        const drySubtotal = dryItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);
        const coldShippingNotice = coldSubtotal >= 2000
            ? `<span class="shipping-tag free">❄️ 冷藏已達 $2,000 免運門檻！</span>`
            : `<span class="shipping-tag alert">❄️ 冷藏未滿 $2,000 (小計 $${coldSubtotal})，運費另計。</span>`;
        const dryShippingNotice = drySubtotal >= 800
            ? `<span class="shipping-tag free">📦 常溫已達 $800 免運門檻！</span>`
            : `<span class="shipping-tag alert">📦 常溫未滿 $800 (小計 $${drySubtotal})，運費另計。</span>`;
        let coldListHtml = '';
        if (coldItems.length > 0) {
            coldListHtml = `
        <div class="checkout-subgroup">
          <h4>❄️ 低溫冷藏配送商品</h4>
          <div class="checkout-items-list">
            ${coldItems.map(p => renderCheckoutItemRow(p)).join('')}
          </div>
          <div class="checkout-subtotal-row">
            ${coldShippingNotice}
            <span class="sub-price">冷藏小計: <strong>$${coldSubtotal}</strong></span>
          </div>
        </div>
      `;
        }
        let dryListHtml = '';
        if (dryItems.length > 0) {
            dryListHtml = `
        <div class="checkout-subgroup">
          <h4>📦 常溫一般配送商品</h4>
          <div class="checkout-items-list">
            ${dryItems.map(p => renderCheckoutItemRow(p)).join('')}
          </div>
          <div class="checkout-subtotal-row">
            ${dryShippingNotice}
            <span class="sub-price">常溫小計: <strong>$${drySubtotal}</strong></span>
          </div>
        </div>
      `;
        }
        const itemTotal = getTotal();
        const discount = appliedCoupon ? calculateDiscount(itemTotal, appliedCoupon) : 0;
        const finalPrice = Math.max(0, itemTotal - discount);
        stepHtml = `
      <div class="checkout-content-container">
        <h3>🛒 確認預購清單</h3>
        <p class="checkout-intro">請核對您所選購的商品數量，您可以在此微調：</p>
        
        <div class="checkout-groups-wrapper">
          ${coldListHtml}
          ${dryListHtml}
        </div>

        <!-- B2: Coupon Input Box -->
        <div class="coupon-box" style="margin: 20px 0; padding: 16px; background: var(--bg-main); border-radius: 8px; border: 1px dashed var(--border-color); display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 500; font-size: 0.95rem; color: var(--text-dark); display: flex; align-items: center; gap: 6px;">
            <span>🎫</span> <span>優惠折扣碼</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="coupon-code-input" placeholder="請輸入優惠折扣碼 (例如: YOGO2026)" value="${appliedCoupon ? appliedCoupon.code : ''}" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; outline: none; font-size: 0.9rem; flex-grow: 1; text-transform: uppercase;">
            <button id="apply-coupon-btn" class="btn-checkout-secondary" style="padding: 8px 16px; font-size: 0.9rem; margin-top: 0; background: var(--primary-color); color: #fff; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s;">套用</button>
          </div>
          ${appliedCoupon ? `
            <div style="color: var(--primary-color); font-size: 0.85rem; display: flex; align-items: center; gap: 4px;">
              <span>✅ 已套用優惠碼: <strong>${appliedCoupon.code}</strong> (${appliedCoupon.type === 'fixed' ? `$${appliedCoupon.value} 折抵` : `${appliedCoupon.value}% 折扣`})</span>
              <button id="remove-coupon-btn" style="background: none; border: none; color: #e74c3c; cursor: pointer; text-decoration: underline; font-size: 0.85rem; padding: 0 4px;">移除</button>
            </div>
          ` : ''}
        </div>

        <div class="checkout-grand-total-box" style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; background: var(--bg-main); padding: 16px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; width: 100%; max-width: 250px;">
            <span class="grand-label" style="color: var(--text-sub);">商品總計：</span>
            <span style="font-weight: 500;">$${itemTotal}</span>
          </div>
          ${appliedCoupon && discount > 0 ? `
            <div style="display: flex; justify-content: space-between; width: 100%; max-width: 250px; color: #e74c3c;">
              <span class="grand-label">優惠折抵：</span>
              <span style="font-weight: 500;">-$${discount}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; width: 100%; max-width: 250px; border-top: 1px solid var(--border-color); padding-top: 6px; margin-top: 4px;">
            <span class="grand-label" style="font-weight: 600; font-size: 1.15rem; color: var(--text-dark);">應付金額：</span>
            <span class="grand-value" style="font-size: 1.3rem; color: var(--primary-color); font-weight: bold;">$${finalPrice}</span>
          </div>
        </div>

        <div class="checkout-action-row">
          <button class="btn-checkout-secondary" id="close-checkout-btn">返回賣場</button>
          <button class="btn-checkout-primary" id="checkout-to-step2">下一步：填寫資訊</button>
        </div>
      </div>
    `;
    }
    else if (checkoutStep === 2) {
        // Step 2: Recipient Details Form
        const savedName = localStorage.getItem('yogo_customer_name') || '';
        const savedPhone = localStorage.getItem('yogo_customer_phone') || '';
        const savedContact = localStorage.getItem('yogo_customer_contact') || '';
        const savedAddress = localStorage.getItem('yogo_customer_address') || '';
        // Calculate delivery date boundaries (下單後 2~14 天)
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 2);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 14);
        const minDateStr = minDate.toISOString().slice(0, 10);
        const maxDateStr = maxDate.toISOString().slice(0, 10);
        // If preferredDeliveryDate is empty or outside bounds, set to minDate
        if (!preferredDeliveryDate) {
            preferredDeliveryDate = minDateStr;
        }
        stepHtml = `
      <div class="checkout-content-container">
        <h3>🤲 填寫收件資訊</h3>
        <p class="checkout-intro">請填寫真實收件資料，以便我們安排採收與聯絡發貨：</p>
        
        <form class="checkout-form" id="checkout-form-element" onsubmit="event.preventDefault();">
          <div class="form-group">
            <label for="cust-name">收件人姓名 <span class="required">*</span></label>
            <input type="text" id="cust-name" required placeholder="請輸入收件人姓名" value="${savedName}" aria-required="true">
          </div>
          <div class="form-group">
            <label for="cust-phone">聯絡電話 <span class="required">*</span></label>
            <input type="tel" id="cust-phone" required pattern="^09\\d{8}$" placeholder="請輸入手機號碼 (例: 0912345678)" value="${savedPhone}" aria-required="true">
          </div>
          <div class="form-group">
            <label for="cust-contact">LINE ID / 電子信箱 <span class="required">*</span></label>
            <input type="text" id="cust-contact" required placeholder="提供 LINE ID 加速出貨溝通" value="${savedContact}" aria-required="true">
          </div>
          <div class="form-group">
            <label for="cust-address">完整收件地址 <span class="required">*</span></label>
            <textarea id="cust-address" required rows="3" placeholder="請輸入完整配送地址" aria-required="true">${savedAddress}</textarea>
          </div>

          <!-- B3: Delivery Date Picker -->
          <div class="form-group">
            <label for="delivery-date">希望配送日期 <span class="required">*</span></label>
            <input type="date" id="delivery-date" required min="${minDateStr}" max="${maxDateStr}" value="${preferredDeliveryDate}" aria-required="true" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-main); color: var(--text-dark); font-family: inherit;">
            <small style="color: var(--text-sub); display: block; margin-top: 4px;">🌱 溫馨提醒：僅限自今日起 2 天後至 14 天內（芽菜皆為接單後現採包裝）。</small>
          </div>
        </form>

        <div class="checkout-action-row">
          <button class="btn-checkout-secondary" id="checkout-to-step1">回上一步</button>
          <button class="btn-checkout-primary" id="checkout-to-step3">下一步：送出確認</button>
        </div>
      </div>
    `;
    }
    else if (checkoutStep === 3) {
        // Step 3: Delivery Details Preview & Confirmation
        const name = document.getElementById('cust-name')?.value || '';
        const phone = document.getElementById('cust-phone')?.value || '';
        const contact = document.getElementById('cust-contact')?.value || '';
        const address = document.getElementById('cust-address')?.value || '';
        const dDate = document.getElementById('delivery-date')?.value || '';
        // Save values for persistence
        localStorage.setItem('yogo_customer_name', name);
        localStorage.setItem('yogo_customer_phone', phone);
        localStorage.setItem('yogo_customer_contact', contact);
        localStorage.setItem('yogo_customer_address', address);
        preferredDeliveryDate = dDate;
        const itemTotal = getTotal();
        const discount = appliedCoupon ? calculateDiscount(itemTotal, appliedCoupon) : 0;
        const finalPrice = Math.max(0, itemTotal - discount);
        stepHtml = `
      <div class="checkout-content-container">
        <h3>🔍 最終確認預購資訊</h3>
        <p class="checkout-intro">請核對以下資訊，若無誤請點擊送出訂單：</p>
        
        <div class="confirmation-review-box">
          <div class="review-section">
            <h4>📦 收件與配送資料</h4>
            <p><strong>收件人：</strong> ${name}</p>
            <p><strong>聯絡電話：</strong> ${phone}</p>
            <p><strong>LINE / Email：</strong> ${contact}</p>
            <p><strong>配送地址：</strong> ${address}</p>
            <p><strong>希望配送日：</strong> <span style="color: var(--primary-color); font-weight: 600;">${preferredDeliveryDate}</span></p>
          </div>
          
          <div class="review-section">
            <h4>💰 金額總結</h4>
            <p><strong>商品小計：</strong> $${itemTotal} 元</p>
            ${appliedCoupon && discount > 0 ? `<p style="color: #e74c3c;"><strong>🎫 優惠折扣 (${appliedCoupon.code})：</strong> -$${discount} 元</p>` : ''}
            <p style="border-top: 1px solid var(--border-color); padding-top: 6px; margin-top: 4px;">
              <strong>應付總額：</strong> <strong style="color: var(--primary-color); font-size: 1.25rem;">$${finalPrice} 元</strong>
            </p>
            <p style="color: var(--text-sub); font-size: 0.85rem; margin-top: 8px; line-height: 1.4;">* 實際冷藏/常溫運費與配送排程，將在接單後由專人與您聯繫進行最終報價。</p>
          </div>
        </div>

        <div class="checkout-action-row">
          <button class="btn-checkout-secondary" id="checkout-back-to-form">修改資訊</button>
          <button class="btn-checkout-primary" id="submit-order-final">確定，送出訂單！</button>
        </div>
      </div>
    `;
    }
    else if (checkoutStep === 4) {
        // Step 4: Success Screen
        stepHtml = `
      <div class="checkout-content-container success-container">
        <div class="success-checkmark-wrapper">
          <div class="success-checkmark">✅</div>
        </div>
        <h3>🎉 預購訂單已成功送出！</h3>
        
        <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin: 16px 0; text-align: center;">
          <span style="color: var(--text-sub); font-size: 0.9rem; display: block; margin-bottom: 2px;">您的預購單編號</span>
          <strong id="order-id-display" style="font-size: 1.25rem; color: var(--primary-color); letter-spacing: 0.5px;">${generatedOrderId}</strong>
        </div>

        <p class="success-desc">
          非常感謝您的訂購！我們已為您預留產能與新鮮商品，<br>
          <strong>芽菜工作坊專人將會於 24 小時內與您取得聯繫</strong>，<br>
          確認最終運費報價與安排採收、寄送事宜。
        </p>
        
        <div class="success-tips-box">
          <p>💡 <strong>溫馨提示：</strong></p>
          <p>• 白玉花生芽等新鮮芽菜為接單後現採，以確保極致鮮度。</p>
          <p>• 請留意您所填寫的電話與 LINE ID，專人聯繫前請勿漏接未知來電。</p>
        </div>

        <div class="checkout-action-row single-action">
          <button class="btn-checkout-primary finish-checkout-btn" id="finish-checkout-btn">完成，返回賣場</button>
        </div>
      </div>
    `;
    }
    // C3. ARIA: role="dialog", aria-modal="true" on checkout modal
    modal.innerHTML = `
    <div class="modal-backdrop" id="checkout-modal-backdrop"></div>
    <div class="modal-card checkout-modal-card" role="dialog" aria-modal="true" aria-label="芽菜工坊預購結帳表單">
      <button class="modal-close-btn" id="close-checkout-modal-top" aria-label="關閉結帳彈窗">&times;</button>
      ${stepsHeader}
      ${stepHtml}
    </div>
  `;
    // Dynamic Step transitions listeners
    if (checkoutStep === 1) {
        document.getElementById('close-checkout-btn')?.addEventListener('click', closeCheckoutModal);
        document.getElementById('checkout-to-step2')?.addEventListener('click', () => {
            checkoutStep = 2;
            renderCheckoutStep();
        });
        // B2: Coupon buttons listeners
        document.getElementById('apply-coupon-btn')?.addEventListener('click', async () => {
            const input = document.getElementById('coupon-code-input');
            if (!input)
                return;
            const code = input.value.trim().toUpperCase();
            if (!code) {
                showToast('⚠️ 請輸入優惠碼！');
                return;
            }
            try {
                const res = await fetch(`/api/coupon?code=${encodeURIComponent(code)}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    const coupon = data.coupon;
                    if (getTotal() < coupon.minOrderAmount) {
                        showToast(`⚠️ 此優惠碼消費需滿 $${coupon.minOrderAmount} 才能套用！(目前金額 $${getTotal()})`);
                        return;
                    }
                    appliedCoupon = coupon;
                    showToast(`🎉 優惠碼 [${coupon.code}] 套用成功！`);
                    renderCheckoutStep();
                }
                else {
                    showToast(`⚠️ 優惠碼無效: ${data.error || '未知錯誤'}`);
                }
            }
            catch (err) {
                console.error('Error validating coupon:', err);
                showToast('⚠️ 連線伺服器驗證優惠碼失敗。');
            }
        });
        document.getElementById('remove-coupon-btn')?.addEventListener('click', () => {
            appliedCoupon = null;
            showToast('已移除優惠折扣。');
            renderCheckoutStep();
        });
        modal.querySelectorAll('.checkout-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const action = e.currentTarget.classList.contains('plus') ? 'plus' : 'minus';
                const p = PRODUCTS.find(item => item.id === id);
                if (!p)
                    return;
                if (action === 'plus') {
                    if (cart[id] < p.stock) {
                        cart[id]++;
                    }
                    else {
                        showToast('已達該品項庫存上限！');
                    }
                }
                else {
                    cart[id] = Math.max(0, cart[id] - 1);
                }
                // Sync main page display
                syncProductCardQty(id);
                updateCartDisplay();
                // Re-render checkout page to update figures
                if (getTotal() === 0) {
                    closeCheckoutModal();
                }
                else {
                    renderCheckoutStep();
                }
            });
        });
    }
    else if (checkoutStep === 2) {
        document.getElementById('checkout-to-step1')?.addEventListener('click', () => {
            checkoutStep = 1;
            renderCheckoutStep();
        });
        document.getElementById('checkout-to-step3')?.addEventListener('click', () => {
            const form = document.getElementById('checkout-form-element');
            if (form && form.reportValidity()) {
                checkoutStep = 3;
                renderCheckoutStep();
            }
        });
    }
    else if (checkoutStep === 3) {
        document.getElementById('checkout-back-to-form')?.addEventListener('click', () => {
            checkoutStep = 2;
            renderCheckoutStep();
        });
        document.getElementById('submit-order-final')?.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            btn.disabled = true;
            btn.textContent = '提交預購單中...';
            const name = localStorage.getItem('yogo_customer_name') || '';
            const phone = localStorage.getItem('yogo_customer_phone') || '';
            const contact = localStorage.getItem('yogo_customer_contact') || '';
            const address = localStorage.getItem('yogo_customer_address') || '';
            const body = {
                customer: { name, phone, contact, address },
                cart: cart,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                preferred_delivery_date: preferredDeliveryDate
            };
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    generatedOrderId = data.orderId || '#ORD-UNKNOWN';
                    const discount = appliedCoupon ? calculateDiscount(getTotal(), appliedCoupon) : 0;
                    const finalPrice = Math.max(0, getTotal() - discount);
                    // Log purchase event (C1. Firebase Analytics)
                    logAnalyticsEvent('purchase', {
                        transaction_id: generatedOrderId,
                        value: finalPrice,
                        currency: 'TWD',
                        coupon: appliedCoupon ? appliedCoupon.code : null,
                        items: getCartItemsDetails()
                    });
                    // Call Cloud Functions /api/payment/create and redirect to simulated gateway
                    let payUrl = `payment.html?orderId=${encodeURIComponent(generatedOrderId)}&amount=${finalPrice}`;
                    try {
                        const payRes = await fetch('/api/payment/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: generatedOrderId, amount: finalPrice })
                        });
                        const payData = await payRes.json();
                        if (payRes.ok && payData.success && payData.paymentUrl) {
                            console.log('🏦 Created Third-party Payment Gateway URL:', payData.paymentUrl);
                        }
                    }
                    catch (err) {
                        console.error('Failed to contact backend payment api, using default fallback simulator.', err);
                    }
                    // Open local simulated gateway in a new tab
                    window.open(payUrl, '_blank');
                    // Reload products in the background to sync fresh database stocks
                    try {
                        const prodRes = await fetch('/api/products');
                        if (prodRes.ok) {
                            const freshProducts = await prodRes.json();
                            PRODUCTS.length = 0;
                            PRODUCTS.push(...freshProducts);
                        }
                    }
                    catch (err) {
                        console.error('Failed to sync updated stocks from database.', err);
                    }
                    checkoutStep = 4;
                    renderCheckoutStep();
                }
                else {
                    showToast(`⚠️ 提交失敗: ${data.error || '庫存不足或伺服器異常'}`);
                    btn.disabled = false;
                    btn.textContent = '確定，送出訂單！';
                }
            }
            catch (err) {
                console.error('Network checkout error:', err);
                showToast('⚠️ 無法連線至結帳伺服器，請檢查您的網路。');
                btn.disabled = false;
                btn.textContent = '確定，送出訂單！';
            }
        });
    }
    else if (checkoutStep === 4) {
        document.getElementById('finish-checkout-btn')?.addEventListener('click', () => {
            // Clear cart
            for (const pidStr in cart) {
                cart[Number(pidStr)] = 0;
                syncProductCardQty(Number(pidStr));
            }
            updateCartDisplay();
            closeCheckoutModal();
            // Re-render shop to show updated stocks (and potential sold out buttons)
            renderShop();
            // Scroll smoothly to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // Common close triggers
    document.getElementById('close-checkout-modal-top')?.addEventListener('click', closeCheckoutModal);
    document.getElementById('checkout-modal-backdrop')?.addEventListener('click', closeCheckoutModal);
}
function renderCheckoutItemRow(p) {
    const qty = cart[p.id];
    const maxReached = qty >= p.stock;
    return `
    <div class="checkout-item-row">
      <div class="row-info">
        <span class="row-emoji" aria-hidden="true">${p.emoji}</span>
        <div class="row-desc">
          <span class="row-name">${p.name}</span>
          <span class="row-spec">${p.spec}</span>
        </div>
      </div>
      <div class="row-pricing-control">
        <span class="row-price">$${p.price}</span>
        <div class="qty-control text-qty-control">
          <button class="checkout-qty-btn minus" data-id="${p.id}" aria-label="減少數量">−</button>
          <span class="qty-display active" aria-live="polite">${qty}</span>
          <button class="checkout-qty-btn plus" data-id="${p.id}" aria-label="增加數量" ${maxReached ? 'disabled' : ''}>+</button>
        </div>
        <span class="row-subtotal">$${p.price * qty}</span>
      </div>
    </div>
  `;
}
