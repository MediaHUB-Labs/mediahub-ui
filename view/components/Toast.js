/**
 * Toast notification system.
 * Usage: import { showToast } from './Toast.js'; showToast('Success!', 'success');
 */

/** Show a toast notification */
export const showToast = (message, type = 'info', duration = 3500) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const colors = {
        success: 'bg-emerald-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-amber-600',
    };

    const icons = {
        success: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />`,
        error: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`,
        info: `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
        warning: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />`,
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-medium ${colors[type] || colors.info} 
        transform translate-x-full opacity-0 transition-all duration-300 ease-out max-w-sm backdrop-blur-xl border border-white/10`;

    toast.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            ${icons[type] || icons.info}
        </svg>
        <span class="flex-1 leading-snug">${message}</span>
        <button class="toast-close ml-2 p-0.5 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Close handler
    const close = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
};
