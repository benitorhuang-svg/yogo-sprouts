import { useState } from 'react';
import { Product, INITIAL_COUPONS } from '@yogo/shared';
import { auth } from '../firebaseClient';
import { audioManager } from '@/audioManager';

/**
 * 🛒 useCart Hook
 * 專職管理購物車邏輯、金額計算與結帳 API 呼叫
 */
export const useCart = (
  products: Product[],
  user: any,
  showToast: (msg: string) => void,
  API_BASE: string
) => {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const getTotal = () => products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const total = getTotal();
    const coupon = INITIAL_COUPONS.find((c) => c.code === appliedCoupon);
    if (!coupon || !coupon.active || total < coupon.minOrderAmount) return 0;
    return coupon.type === 'fixed' ? coupon.value : Math.floor(total * (coupon.value / 100));
  };

  const addToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const targetQty = (cart[productId] || 0) + 1;

    // 簡單檢查 (詳細檢查可留待結帳)
    if (targetQty > product.stock) {
      alert(`很抱歉，「${product.name}」庫存不足`);
      return;
    }

    audioManager.playCartAdd();
    setCart((prev) => ({ ...prev, [productId]: targetQty }));
    showToast(`✅ 已將「${product.name}」加入購物籃`);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleCoupon = (code: string) => {
    const coupon = INITIAL_COUPONS.find((c) => c.code === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon.code);
      showToast('🎫 優惠碼已套用！');
    } else {
      showToast('❌ 無效的優惠碼');
    }
  };

  const clearCart = async (orderData?: any) => {
    showToast('🔄 訂單處理中...');
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer: {
            name: orderData?.name || user?.name || '訪客',
            phone: orderData?.phone || '',
            contact: orderData?.email || user?.email || '',
            address: orderData?.address || '',
          },
          cart,
          couponCode: appliedCoupon || undefined,
          preferred_delivery_date: orderData?.deliveryDate || undefined,
          user_uid: auth.currentUser?.uid || undefined,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || '結帳失敗');

      setCart({});
      setAppliedCoupon(null);
      showToast('✅ 結帳成功！訂單已送出。');
    } catch (err: any) {
      console.error('Checkout Error:', err);
      alert(`【結帳失敗】${err.message}`);
      throw err;
    }
  };

  return {
    cart,
    setCart,
    appliedCoupon,
    setAppliedCoupon: handleCoupon,
    getTotal,
    getDiscount,
    addToCart,
    removeFromCart,
    clearCart,
  };
};
