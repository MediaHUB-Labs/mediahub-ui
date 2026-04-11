import { upload } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { openModal, closeModal } from './Modal.js';
import { showToast } from './Toast.js';

/**
 * Upload Modal — drag-and-drop file upload with metadata fields.
 */
export const showUploadModal = (onSuccess) => {
    const contentHtml = `
        <form id="upload-form" class="space-y-5">
            <!-- Drop Zone -->
            <div id="drop-zone" class="relative border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-orange-500 dark:hover:border-yellow-500 transition-colors group">
                <input type="file" id="upload-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.mkv">
                <div id="drop-zone-content">
                    <svg class="w-12 h-12 mx-auto text-gray-300 dark:text-white/20 group-hover:text-orange-500 dark:group-hover:text-yellow-500 transition-colors mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Drop your file here or <span class="text-orange-600 dark:text-yellow-500 font-bold">browse</span></p>
                    <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Video, Audio, Images, Documents (max 512MB)</p>
                </div>
                <div id="file-preview" class="hidden">
                    <div class="flex items-center gap-3 text-left">
                        <div id="file-icon-preview" class="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0"></div>
                        <div class="min-w-0 flex-1">
                            <p id="file-name-preview" class="text-sm font-medium text-gray-900 dark:text-white truncate"></p>
                            <p id="file-size-preview" class="text-xs text-gray-500"></p>
                        </div>
                        <button type="button" id="clear-file-btn" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Title</label>
                <input type="text" name="title" id="upload-title" required
                    class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter title">
            </div>

            <!-- Category & Genres Row -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Category</label>
                    <input type="text" name="category" id="upload-category"
                        class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="e.g. Movie, Song">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Genres</label>
                    <input type="text" name="genres" id="upload-genres"
                        class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Action, Drama">
                </div>
            </div>

            <!-- Description -->
            <div>
                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Description</label>
                <textarea name="description" id="upload-desc" rows="2"
                    class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition resize-none placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Optional description..."></textarea>
            </div>

            <!-- Progress Bar (hidden initially) -->
            <div id="upload-progress" class="hidden">
                <div class="flex justify-between items-center mb-1.5">
                    <span class="text-xs text-gray-500 font-medium">Uploading...</span>
                    <span id="upload-percent" class="text-xs text-orange-600 dark:text-yellow-500 font-bold">0%</span>
                </div>
                <div class="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div id="upload-bar" class="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            </div>

            <!-- Submit -->
            <button type="submit" id="upload-submit-btn"
                class="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:bg-orange-600 dark:hover:bg-yellow-500 transition-all text-sm">
                Upload File
            </button>
        </form>
    `;

    openModal('Upload Media', contentHtml);

    // After DOM is ready, bind events
    setTimeout(() => {
        const fileInput = document.getElementById('upload-file-input');
        const dropZone = document.getElementById('drop-zone');
        const dropContent = document.getElementById('drop-zone-content');
        const filePreview = document.getElementById('file-preview');
        const clearBtn = document.getElementById('clear-file-btn');
        const form = document.getElementById('upload-form');

        let selectedFile = null;

        const showFilePreview = (file) => {
            selectedFile = file;
            document.getElementById('file-name-preview').textContent = file.name;
            document.getElementById('file-size-preview').textContent = formatBytes(file.size);
            
            const iconDiv = document.getElementById('file-icon-preview');
            let iconColor = 'text-gray-400';
            if (file.type.startsWith('video/') || file.name.endsWith('.mkv')) iconColor = 'text-blue-500';
            else if (file.type.startsWith('audio/')) iconColor = 'text-purple-500';
            else if (file.type.startsWith('image/')) iconColor = 'text-emerald-500';
            else iconColor = 'text-amber-500';
            
            iconDiv.innerHTML = `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`;

            dropContent.classList.add('hidden');
            filePreview.classList.remove('hidden');

            // Auto-fill title from filename
            const titleInput = document.getElementById('upload-title');
            if (!titleInput.value) {
                titleInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
            }
        };

        fileInput?.addEventListener('change', (e) => {
            if (e.target.files[0]) showFilePreview(e.target.files[0]);
        });

        clearBtn?.addEventListener('click', () => {
            selectedFile = null;
            fileInput.value = '';
            dropContent.classList.remove('hidden');
            filePreview.classList.add('hidden');
        });

        // Drag and drop
        ['dragenter', 'dragover'].forEach(evt => {
            dropZone?.addEventListener(evt, (e) => {
                e.preventDefault();
                dropZone.classList.add('border-orange-500', 'dark:border-yellow-500');
            });
        });
        ['dragleave', 'drop'].forEach(evt => {
            dropZone?.addEventListener(evt, (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-orange-500', 'dark:border-yellow-500');
            });
        });
        dropZone?.addEventListener('drop', (e) => {
            if (e.dataTransfer.files[0]) showFilePreview(e.dataTransfer.files[0]);
        });

        // Form submit
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!selectedFile) {
                showToast('Please select a file', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', document.getElementById('upload-title').value);
            formData.append('category', document.getElementById('upload-category').value);
            formData.append('genres', document.getElementById('upload-genres').value);
            formData.append('description', document.getElementById('upload-desc').value);

            const progressDiv = document.getElementById('upload-progress');
            const bar = document.getElementById('upload-bar');
            const percentLabel = document.getElementById('upload-percent');
            const submitBtn = document.getElementById('upload-submit-btn');

            progressDiv.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            submitBtn.classList.add('opacity-60', 'cursor-not-allowed');

            try {
                const result = await upload(CONFIG.ENDPOINTS.MEDIA_ADD, formData, (percent) => {
                    bar.style.width = `${percent}%`;
                    percentLabel.textContent = `${percent}%`;
                });

                if (result?.success) {
                    showToast('Media uploaded successfully!', 'success');
                    closeModal();
                    if (onSuccess) onSuccess(result.data);
                } else {
                    showToast(result?.error || 'Upload failed', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Upload File';
                    submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
                    progressDiv.classList.add('hidden');
                }
            } catch (err) {
                showToast('Upload failed: ' + err.message, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload File';
                submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
                progressDiv.classList.add('hidden');
            }
        });
    }, 100);
};

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
}
