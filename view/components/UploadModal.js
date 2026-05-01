import { upload } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { openModal, closeModal } from './Modal.js';
import { showToast } from './Toast.js';
import { ICONS } from '../../src/utils/icons.js';

/**
 * Enhanced Upload Modal — Guided, type-specific upload workflow.
 */
export const showUploadModal = (onSuccess) => {
    const MEDIA_TYPES = {
        VIDEO: { id: 'video', label: 'Video', icon: ICONS.video, color: 'bg-rose-600', accept: '.mp4,.mov,.webm,.mkv,.avi,.wmv', categories: ['Video', 'Movie'] },
        AUDIO: { id: 'audio', label: 'Music', icon: ICONS.music, color: 'bg-purple-600', accept: '.mp3,.flac,.wav,.m4a', categories: ['Song'] },
        IMAGE: { id: 'image', label: 'Photo', icon: ICONS.photo, color: 'bg-emerald-600', accept: 'image/*', categories: ['Photo'] },
        DOCUMENT: { id: 'document', label: 'Document', icon: ICONS.doc, color: 'bg-amber-600', accept: '.pdf,.doc,.docx,.txt,.zip', categories: ['Document'] }
    };

    let selectedTypeKey = null;
    let selectedFile = null;

    const renderSelection = () => `
        <div class="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="text-center mb-8">
                <h2 class="text-2xl font-black text-gray-900 dark:text-white mt-2">What are you importing?</h2>
            </div>
            
            <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                ${Object.entries(MEDIA_TYPES).map(([key, t]) => `
                    <button type="button" class="type-select-btn group relative flex flex-col items-center p-8 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-[2.5rem] hover:bg-white dark:hover:bg-white/10 hover:border-orange-500/50 dark:hover:border-yellow-500/50 transition-all active:scale-95 shadow-sm" data-type="${key}">
                        <div class="w-20 h-20 ${t.color} rounded-3xl flex items-center justify-center shadow-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${t.icon}</svg>
                        </div>
                        <span class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">${t.label}</span>
                        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="w-2 h-2 rounded-full bg-orange-500 dark:bg-yellow-500 animate-pulse"></div>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    const renderUploadForm = (typeKey) => {
        const t = MEDIA_TYPES[typeKey];
        return `
            <form id="upload-form" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div class="flex items-center justify-between mb-4">
                    <button type="button" id="back-to-types" class="flex items-center gap-2 group text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <div class="p-2 group-hover:bg-gray-100 dark:group-hover:bg-white/10 rounded-xl transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.back}</svg>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.3em]">Change Type</span>
                    </button>
                    
                    <div class="flex items-center gap-3 bg-gray-50/50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner">
                        <div class="w-6 h-6 ${t.color} rounded-lg flex items-center justify-center">
                             <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${t.icon}</svg>
                        </div>
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300">Target: ${t.label}</h3>
                    </div>
                </div>

                <!-- Drop Zone / File Selection -->
                <div id="drop-zone" class="relative group border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center bg-gray-50/50 dark:bg-white/[0.02] hover:border-orange-500/50 dark:hover:border-yellow-500/50 hover:bg-white dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm overflow-hidden min-h-[160px] flex flex-col items-center justify-center">
                    <input type="file" id="upload-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[10]" accept="${t.accept}">
                    
                    <div id="drop-zone-content" class="${selectedFile ? 'hidden' : 'space-y-4'}">
                        <div class="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:bg-orange-500 dark:group-hover:bg-yellow-500 transition-all duration-300">
                            <svg class="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ICONS.upload}</svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight">Select ${t.label} Asset</h3>
                            <p class="text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-widest font-black mt-1">Extensions: ${t.accept.replace(/\./g, ' ').toUpperCase()}</p>
                        </div>
                    </div>

                    <div id="file-preview" class="${selectedFile ? 'w-full' : 'hidden'} text-left">
                        <div class="flex items-center gap-4 relative z-10 p-2">
                            <div class="w-16 h-16 ${t.color} rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${t.icon}</svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p id="file-name-preview" class="text-lg font-black text-gray-900 dark:text-white truncate mb-1">${selectedFile ? selectedFile.name : ''}</p>
                                <div class="flex items-center gap-3">
                                    <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">${selectedFile ? formatBytes(selectedFile.size) : ''}</span>
                                    <span class="w-1 h-1 bg-gray-300 dark:bg-white/20 rounded-full"></span>
                                    <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-gray-200/50 dark:bg-white/5 px-2 py-0.5 rounded-md">${selectedFile ? selectedFile.name.split('.').pop().toUpperCase() : ''}</span>
                                </div>
                            </div>
                            <button type="button" id="clear-file-btn" class="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all border border-gray-200 dark:border-white/10 shadow-sm flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <!-- Title Field -->
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1 tracking-[0.2em]">Asset Title</label>
                            <input type="text" name="title" id="upload-title" required
                                class="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition-all shadow-sm"
                                placeholder="Enter title..."
                                value="${selectedFile ? selectedFile.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') : ''}">
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <!-- Category Selection (Sub-type) -->
                            <div>
                                <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1 tracking-[0.2em]">Category</label>
                                <div class="relative">
                                    <select id="upload-category" class="w-full appearance-none bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition-all cursor-pointer shadow-sm">
                                        ${t.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                                    </select>
                                    <svg class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1 tracking-[0.2em]">Genres / Tags</label>
                                <input type="text" name="genres" id="upload-genres"
                                    class="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition-all shadow-sm"
                                    placeholder="e.g. Travel, Family">
                            </div>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1 tracking-[0.2em]">Narrative / Description</label>
                            <textarea name="description" id="upload-desc" rows="5"
                                class="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl px-5 py-4 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition-all resize-none shadow-sm"
                                placeholder="Tell the story of this media..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Progress State -->
                <div id="upload-progress" class="hidden animate-in fade-in duration-300">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Transmitting to Vault...</span>
                        <span id="upload-percent" class="text-xs text-orange-600 dark:text-yellow-500 font-black">0%</span>
                    </div>
                    <div class="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div id="upload-bar" class="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300 shadow-lg" style="width: 0%"></div>
                    </div>
                </div>

                <div class="pt-2">
                    <button type="submit" id="upload-submit-btn"
                        class="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-[2.5rem] hover:bg-orange-600 dark:hover:bg-yellow-500 hover:text-white dark:hover:text-black hover:scale-[1.01] active:scale-[0.99] transition-all text-sm tracking-[0.2em] uppercase shadow-2xl group flex items-center justify-center gap-3">
                        Launch Import
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </form>
        `;
    };

    const attachFormListeners = (typeKey) => {
        const fileInput = document.getElementById('upload-file-input');
        const dropZone = document.getElementById('drop-zone');
        const clearBtn = document.getElementById('clear-file-btn');
        const form = document.getElementById('upload-form');
        const backBtn = document.getElementById('back-to-types');

        backBtn?.addEventListener('click', () => {
            selectedFile = null;
            const container = document.getElementById('upload-modal-container');
            container.innerHTML = renderSelection();
            attachSelectionListeners();
        });

        const showFilePreview = (file) => {
            selectedFile = file;
            const container = document.getElementById('upload-modal-container');
            container.innerHTML = renderUploadForm(typeKey);
            attachFormListeners(typeKey);
        };

        fileInput?.addEventListener('change', (e) => {
            if (e.target.files[0]) showFilePreview(e.target.files[0]);
        });

        ['dragenter', 'dragover'].forEach(evt => {
            dropZone?.addEventListener(evt, (e) => {
                e.preventDefault();
                dropZone.classList.add('border-orange-500', 'bg-orange-500/5', 'scale-[0.99]');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropZone?.addEventListener(evt, (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-orange-500', 'bg-orange-500/5', 'scale-[0.99]');
            });
        });
        dropZone?.addEventListener('drop', (e) => {
            if (e.dataTransfer.files[0]) showFilePreview(e.dataTransfer.files[0]);
        });

        clearBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedFile = null;
            const container = document.getElementById('upload-modal-container');
            container.innerHTML = renderUploadForm(typeKey);
            attachFormListeners(typeKey);
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!selectedFile) {
                showToast('Please select a file to continue', 'warning');
                return;
            }

            const t = MEDIA_TYPES[typeKey];
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', document.getElementById('upload-title').value);
            formData.append('category', document.getElementById('upload-category').value);
            formData.append('type', t.id); // Broad type: video, audio, image, document
            formData.append('genres', document.getElementById('upload-genres').value);
            formData.append('description', document.getElementById('upload-desc').value);

            const progressDiv = document.getElementById('upload-progress');
            const bar = document.getElementById('upload-bar');
            const percentLabel = document.getElementById('upload-percent');
            const submitBtn = document.getElementById('upload-submit-btn');

            progressDiv.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.querySelector('#btn-text')?.classList.add('hidden');
            submitBtn.innerHTML = `
                <span class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    TRANSMITTING...
                </span>
            `;

            try {
                const result = await upload(CONFIG.ENDPOINTS.MEDIA_ADD, formData, (percent) => {
                    bar.style.width = `${percent}%`;
                    percentLabel.textContent = `${percent}%`;
                });

                if (result?.success) {
                    showToast('Media imported successfully!', 'success');
                    closeModal();
                    if (onSuccess) onSuccess(result.data);
                } else {
                    throw new Error(result?.error || 'Upload failed');
                }
            } catch (err) {
                showToast(err.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Launch Import';
                progressDiv.classList.add('hidden');
            }
        });
    };

    const attachSelectionListeners = () => {
        document.querySelectorAll('.type-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedTypeKey = btn.dataset.type;
                const container = document.getElementById('upload-modal-container');
                container.innerHTML = renderUploadForm(selectedTypeKey);
                attachFormListeners(selectedTypeKey);
            });
        });
    };


    const mainHtml = `<div id="upload-modal-container" class="px-1">${renderSelection()}</div>`;
    openModal('Import Content', mainHtml, null, 'max-w-4xl');

    setTimeout(() => {
        attachSelectionListeners();
    }, 100);
};

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
}

