import { showToast } from "./toast.js";
export function setupAdminSecretEntrance() {
    const logoTrigger = document.querySelector('.site-header .logo');
    if (!logoTrigger)
        return;
    let clickCount = 0;
    let lastClickTime = 0;
    logoTrigger.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastClickTime > 2000) {
            clickCount = 0;
        }
        clickCount++;
        lastClickTime = now;
        if (clickCount >= 5) {
            e.preventDefault();
            clickCount = 0; // reset
            triggerAdminUnlock();
        }
    });
}
function triggerAdminUnlock() {
    const code = prompt('🔓 [YoGo 安全提示]\n請輸入管理員解鎖密碼：\n(提示：測試解鎖密碼為 1234)');
    if (code === null)
        return; // cancelled
    if (code === '1234') {
        const adminUrl = 'https://script.google.com/macros/s/AKfycbwvUnnkMdmYclX9Hv4P80Hfh_J4joewGPLK4PBX8XKw4-71Giro-O_4MtXlnrui8UpKMQ/exec';
        showToast('🔓 密碼正確！正在進入後台管理頁面...', 2000);
        setTimeout(() => {
            window.open(adminUrl, '_blank');
        }, 1500);
    }
    else {
        alert('❌ 密碼錯誤，拒絕存取。');
    }
}
