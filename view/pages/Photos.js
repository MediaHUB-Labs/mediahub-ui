import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { isLoggedIn } from '../../src/utils/auth.js';
import { MediaGridSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { showUploadModal } from '../components/UploadModal.js';
import { MediaNav } from '../components/MediaNav.js';
import { openModal } from '../components/Modal.js';
import { ICONS } from '../../src/utils/icons.js';

export const Photos = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-4">
                <div class="flex items-center gap-4">
                    <a href="/" data-link class="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-emerald-600 rounded-xl transition-all active:scale-90 shadow-sm" title="Back to Dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.back}</svg>
                    </a>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.photo}</svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Photos</h1>
                            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Capture your favorite moments</p>
                        </div>
                    </div>
                </div>
                ${loggedIn ? `
                <button id="photo-upload-btn" class="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ICONS.upload}</svg>
                    Add Photos
                </button>
                ` : ''}
            </div>

            <div id="photo-grid-container" class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                ${MediaGridSkeleton(12)}
            </div>
        </div>
    `;

    const init = async () => {
        const fetchPhotos = async () => {
            const container = document.getElementById('photo-grid-container');
            const res = await get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'image' });
            
            if (res?.success) {
                const items = res.data?.items || [];
                if (items.length === 0) {
                    container.classList.remove('columns-2', 'md:columns-3', 'lg:columns-4');
                    container.innerHTML = MediaGridEmpty('No photos found', 'photo');
                } else {
                    container.innerHTML = items.map(photo => `
                        <div class="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md border border-white/5 animate-in fade-in duration-700 bg-gray-100 dark:bg-white/5 min-h-[150px] mb-4" data-media-id="${photo.id}">
                            <img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${photo.id}?token=${localStorage.getItem('token')}" 
                                 class="w-full h-auto min-h-[150px] object-cover group-hover:scale-110 transition-transform duration-700" 
                                 loading="lazy" alt="${photo.title}"
                                 onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                            
                            <!-- Missing Thumbnail Fallback -->
                            <div class="absolute inset-0 hidden items-center justify-center bg-gray-100 dark:bg-zinc-800/50">
                                <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <svg class="w-9 h-9 text-white opacity-80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                        ${ICONS.photo}
                                    </svg>
                                </div>
                            </div>
                            
                            <!-- Hover Actions -->
                            <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-10">
                                <button type="button" class="view-photo-btn w-32 py-2.5 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl" data-photo-id="${photo.id}" data-photo-title="${photo.title}">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg>
                                    View Photo
                                </button>
                                ${loggedIn ? `
                                <a href="/edit/${photo.id}" data-link class="w-32 py-2.5 bg-black/60 text-white border border-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 backdrop-blur-md">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.edit}</svg>
                                    Edit Media
                                </a>
                                ` : ''}
                            </div>

                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                                <p class="text-white text-xs font-bold truncate">${photo.title}</p>
                            </div>
                        </div>
                    `).join('');
                }
            } else {
                container.innerHTML = MediaGridEmpty('Failed to load photos', 'photo');
            }

            // Attach Lightbox Listeners
            document.querySelectorAll('.view-photo-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const photoId = btn.dataset.photoId;
                    const photoTitle = btn.dataset.photoTitle || 'Photo';
                    const photoUrl = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${photoId}?token=${localStorage.getItem('token')}`;
                    
                    openModal(photoTitle, `
                        <div class="flex justify-center bg-black/50 rounded-2xl overflow-hidden shadow-inner">
                            <img src="${photoUrl}" class="w-full max-h-[75vh] object-contain rounded-xl" alt="${photoTitle}">
                        </div>
                    `, null, 'max-w-6xl');
                });
            });
        };

        fetchPhotos();

        document.getElementById('photo-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => fetchPhotos());
        });
    };

    return { html, init };
};
