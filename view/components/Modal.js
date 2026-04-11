/**
 * Reusable Modal component.
 * Usage: openModal('Title', '<p>Content</p>', () => { ... onClose ... });
 */

/** Open a modal with given title and HTML content */
export const openModal = (title, contentHtml, onClose) => {
    // Remove any existing modal
    closeModal();

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200';
    overlay.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div>
        <div class="relative bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden transform scale-95 opacity-0 transition-all duration-300" id="modal-content">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">${title}</h3>
                <button id="modal-close-btn" class="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-6 overflow-y-auto max-h-[calc(85vh-4rem)]" id="modal-body">
                ${contentHtml}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        const content = document.getElementById('modal-content');
        if (content) {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }
    });

    // Close handlers
    const handleClose = () => {
        closeModal();
        if (onClose) onClose();
    };

    document.getElementById('modal-close-btn')?.addEventListener('click', handleClose);
    document.getElementById('modal-backdrop')?.addEventListener('click', handleClose);
    
    // Escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') { handleClose(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
};

/** Close the currently open modal */
export const closeModal = () => {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        const content = document.getElementById('modal-content');
        if (content) {
            content.classList.add('scale-95', 'opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
        }
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 200);
    }
};
