import { post, put, del } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth } from '../../src/utils/auth.js';
import { formatDuration, formatFileSize, formatDate } from '../../src/utils/format.js';
import { showToast } from '../components/Toast.js';
import { openModal, closeModal } from '../components/Modal.js';
import { ICONS } from '../../src/utils/icons.js';

/**
 * Edit Media Page — form to update metadata and delete media.
 */
export const EditMedia = (mediaId) => {
    requireAuth();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
            <!-- Header with Back Button -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div class="flex items-center gap-4">
                    <button onclick="window.history.back()" class="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-yellow-500 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:scale-105 active:scale-95 group">
                        <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.back}</svg>
                    </button>
                    <div>
                        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Edit Media</h1>
                        <p id="edit-subtitle" class="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage metadata and settings</p>
                    </div>
                </div>
            </div>

            <div id="edit-content" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Skeleton Loading -->
                <div class="lg:col-span-2 space-y-6 animate-pulse">
                    <div class="h-12 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                    <div class="h-32 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="h-12 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                        <div class="h-12 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                    </div>
                </div>
                <div class="space-y-6 animate-pulse">
                    <div class="aspect-[2/2] bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
                    <div class="h-24 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                </div>
            </div>
        </div>
    `;

    const init = async () => {
        const container = document.getElementById('edit-content');

        // Load media details
        const res = await post(CONFIG.ENDPOINTS.MEDIA_DETAILS, { id: parseInt(mediaId) });
        if (!res?.success) {
            container.innerHTML = `<p class="text-red-500 p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/20">Failed to load media details: ${res?.error || 'Unknown error'}</p>`;
            return;
        }

        const media = res.data;
        const isVideo = media.mime_type?.startsWith('video/');
        const isAudio = media.mime_type?.startsWith('audio/');
        const isImage = media.mime_type?.startsWith('image/');
        const isDoc = media.mime_type?.includes('pdf') || media.mime_type?.includes('document');

        const iconType = isVideo ? 'movie' : isAudio ? 'music' : isImage ? 'photo' : 'doc';
        const iconBgColors = { movie: 'bg-blue-600', music: 'bg-purple-600', photo: 'bg-emerald-600', doc: 'bg-amber-600' };

        // Update header subtitle
        const subtitle = document.getElementById('edit-subtitle');
        if (subtitle) subtitle.innerText = `Settings for "${media.title || 'Untitled item'}"`;

        container.innerHTML = `
            <!-- Edit Form -->
            <div class="lg:col-span-2 space-y-8">
                <div class="bg-white dark:bg-white/5 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <form id="edit-form" class="space-y-6">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input type="text" name="title" value="${media.title || ''}" required
                                class="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition shadow-sm">
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea name="description" rows="4"
                                class="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition resize-none shadow-sm">${media.description || ''}</textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <input type="text" name="category" id="category-input" value="${media.category || ''}" placeholder="e.g. Movie, Music Video"
                                    class="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition shadow-sm">
                                <div class="flex gap-2 mt-3">
                                    ${isVideo ? `
                                        <button type="button" class="category-preset px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all" data-value="Movie">Movie</button>
                                        <button type="button" class="category-preset px-3 py-1.5 bg-rose-600/10 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-600/20 hover:bg-rose-600 hover:text-white transition-all" data-value="Video">Personal Video</button>
                                    ` : ''}
                                    ${isAudio ? `
                                        <button type="button" class="category-preset px-3 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-600/20 hover:bg-purple-600 hover:text-white transition-all" data-value="Song">Music</button>
                                    ` : ''}
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Genres</label>
                                <input type="text" name="genres" value="${media.genres || ''}" placeholder="e.g. Action, Drama"
                                    class="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition shadow-sm">
                            </div>
                        </div>

                        <div class="pt-4 flex items-center gap-4">
                            <button type="submit" id="save-btn" class="flex-1 bg-orange-600 dark:bg-yellow-500 text-white dark:text-black font-bold py-3.5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-600/20 dark:shadow-yellow-500/20">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Danger Zone -->
                <div class="bg-red-50 dark:bg-red-900/5 p-6 md:p-8 rounded-3xl border border-red-100 dark:border-red-900/20">
                    <h3 class="text-red-700 dark:text-red-400 font-bold mb-2">Danger Zone</h3>
                    <p class="text-red-600/70 dark:text-red-400/50 text-sm mb-6">Once you delete this media, it cannot be undone. All associated progress and data will be permanently removed.</p>
                    <button id="delete-btn" class="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete Permanently
                    </button>
                </div>
            </div>

            <!-- Side Info -->
            <div class="space-y-6">
                <div class="${iconBgColors[iconType]} rounded-3xl overflow-hidden shadow-2xl aspect-[2/2] relative flex items-center justify-center p-8 group">
                    <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            ${ICONS[iconType]}
                        </svg>
                    </div>
                    <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
                        <span class="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest leading-none">
                            ${iconType}
                        </span>
                    </div>
                </div>

                <div class="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <h4 class="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Technical Details
                    </h4>
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">MIME Type</span>
                            <span class="text-gray-900 dark:text-gray-300 font-mono">${media.mime_type}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Duration</span>
                            <span class="text-gray-900 dark:text-gray-300">${formatDuration(media.duration_sec)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Resolution</span>
                            <span class="text-gray-900 dark:text-gray-300">${media.resolution || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">File Size</span>
                            <span class="text-gray-900 dark:text-gray-300">${formatFileSize(media.file_size_kb)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-500">Uploaded</span>
                            <span class="text-gray-900 dark:text-gray-300">${formatDate(media.created_at)}</span>
                        </div>
                    </div>
                </div>
                
                ${isVideo && !media.is_transcoded ? `
                <div class="relative bg-violet-50 dark:bg-violet-900/5 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/20 shadow-sm mt-6 overflow-hidden">
                    <h4 class="text-violet-900 dark:text-violet-400 font-bold mb-2">Transcoding</h4>
                    <p class="text-violet-600/70 dark:text-violet-400/50 text-xs mb-4">Optimize this video for web streaming via HLS.</p>
                    
                    <div id="transcode-badge-${mediaId}" class="mb-4 transcode-badge-container opacity-0 pointer-events-none transition-all duration-500" data-media-id="${mediaId}">
                        <div class="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-black text-[10px] uppercase tracking-widest">
                            <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Converting: <span class="progress-percent">0%</span>
                        </div>
                    </div>

                    <button id="transcode-btn" data-media-id="${mediaId}" class="w-full bg-violet-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 relative z-10">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                        Convert to HLS
                    </button>

                    <!-- Bottom Progress Line (Premium) -->
                    <div class="transcode-status-container absolute bottom-0 left-0 right-0 h-1 bg-violet-200 dark:bg-violet-900/40 opacity-0 pointer-events-none transition-all duration-700 z-0 rounded-b-3xl" data-media-id="${mediaId}">
                        <div class="progress-bar h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 transition-all duration-500 relative overflow-hidden" style="width: 0%">
                             <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style="background-size: 200% 100%"></div>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${isImage ? `
                <div class="bg-emerald-50 dark:bg-emerald-900/5 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 shadow-sm mt-6">
                    <h4 class="text-emerald-900 dark:text-emerald-400 font-bold mb-2">Thumbnail Override</h4>
                    <p class="text-emerald-600/70 dark:text-emerald-400/50 text-xs mb-4">If the preview is broken or didn't generate correctly, attempt a recreation.</p>
                    <button id="regen-thumb-btn" class="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Regenerate Thumbnail
                    </button>
                </div>
                ` : ''}
            </div>
        `;

        // Handlers
        document.querySelectorAll('.category-preset').forEach(btn => {
            btn.onclick = () => {
                const input = document.getElementById('category-input');
                if (input) input.value = btn.dataset.value;
            };
        });

        const form = document.getElementById('edit-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('save-btn');
            btn.disabled = true;
            btn.innerText = 'Saving...';

            const formData = new FormData(form);
            const payload = {
                id: parseInt(mediaId),
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                genres: formData.get('genres')
            };

            const res = await put(CONFIG.ENDPOINTS.MEDIA_METADATA, payload);
            btn.disabled = false;
            btn.innerText = 'Save Changes';

            if (res?.success) {
                showToast('Media updated successfully', 'success');
            } else {
                showToast(res?.error || 'Failed to update media', 'error');
            }
        });

        const deleteBtn = document.getElementById('delete-btn');
        deleteBtn.addEventListener('click', () => {
            openModal('Confirm Deletion', `
                <div class="text-center p-2 mt-2">
                    <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete this file?</h4>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">Are you absolutely sure you want to delete this media? This action is irreversible.</p>
                    
                    <div class="flex gap-4">
                        <button id="cancel-delete-modal-btn" class="flex-1 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">Cancel</button>
                        <button id="confirm-delete-modal-btn" class="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">Yes, Delete</button>
                    </div>
                </div>
            `, null, 'max-w-sm');

            document.getElementById('cancel-delete-modal-btn')?.addEventListener('click', closeModal);

            document.getElementById('confirm-delete-modal-btn')?.addEventListener('click', async () => {
                closeModal();
                deleteBtn.disabled = true;
                deleteBtn.innerText = 'Deleting...';

                const res = await del(CONFIG.ENDPOINTS.MEDIA_DELETE, { id: parseInt(mediaId) });
                if (res?.success) {
                    showToast('Media deleted successfully', 'success');
                    window.history.back(); // Return to previous page gracefully
                } else {
                    showToast(res?.error || 'Failed to delete media', 'error');
                    deleteBtn.disabled = false;
                    deleteBtn.innerText = 'Delete Permanently';
                }
            });
        });

        const regenThumbBtn = document.getElementById('regen-thumb-btn');
        if (regenThumbBtn) {
            regenThumbBtn.addEventListener('click', async () => {
                regenThumbBtn.disabled = true;
                const originalContent = regenThumbBtn.innerHTML;
                regenThumbBtn.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Regenerating...</span>';

                const res = await post(`${CONFIG.ENDPOINTS.MEDIA_METADATA}/regenerate-thumbnail/${mediaId}`);

                if (res?.success) {
                    showToast('Thumbnail regeneration successful', 'success');
                    regenThumbBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg> Completed';
                    // Reload thumbnail after a short delay to allow background generation if any
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showToast(res?.error || 'Failed to regenerate thumbnail', 'error');
                    regenThumbBtn.disabled = false;
                    regenThumbBtn.innerHTML = originalContent;
                }
            });
        }
    };

    return { html, init };
};
