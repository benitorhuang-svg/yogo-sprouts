export function showToast(message, duration = 3000) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    // Trigger animations
    setTimeout(() => toast.classList.add('visible'), 50);
    // Remove toast
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, duration);
}
