import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth } from '../../src/utils/auth.js';
import { showUploadModal } from '../components/UploadModal.js';
import { MediaNav } from '../components/MediaNav.js';
import { formatDate, formatFileSize } from '../../src/utils/format.js';

export const Photos = () => {

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span class="text-emerald-500">📷</span> Photos
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Your private photo vault — only you can see these</p>
                </div>
                <button id="photos-upload-btn" class="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Photos
                </button>
            </div>

            <!-- Gallery Grid -->
            <div id="photos-content">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse">
                    ${Array(10).fill(0).map(() => `<div class="aspect-square bg-gray-200 dark:bg-white/5 rounded-xl"></div>`).join('')}
                </div>
            </div>

            <!-- Load More -->
            <div id="photos-load-more" class="hidden text-center py-8">
                <button id="photos-load-more-btn" class="px-8 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition">Load More</button>
            </div>
        </div>

        <!-- Lightbox -->
        <div id="photo-lightbox" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl hidden items-center justify-center p-4">
            <button id="lightbox-close" class="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <button id="lightbox-prev" class="absolute left-4 text-white/70 hover:text-white p-2 z-10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button id="lightbox-next" class="absolute right-4 text-white/70 hover:text-white p-2 z-10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            <img id="lightbox-img" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" src="" alt="">
            <div id="lightbox-info" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-2.5 rounded-2xl text-sm font-medium backdrop-blur-sm"></div>
        </div>
    `;

    const init = async () => {
        let photos = [];
        let offset = 0;
        const limit = 30;
        let lightboxIndex = 0;

        const renderGallery = () => {
            const container = document.getElementById('photos-content');
            if (photos.length === 0) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-24 text-center">
                        <div class="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                            <svg class="w-12 h-12 text-emerald-500/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">Your photo vault is empty</p>
                        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload photos to start building your private collection</p>
                    </div>`;
                return;
            }

            container.innerHTML = `
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    ${photos.map((photo, idx) => `
                        <div class="group cursor-pointer photo-item relative" data-index="${idx}">
                            <div class="aspect-square bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-emerald-500 transition-all">
                                <img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${photo.id}?token=${localStorage.getItem('token')}" 
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    alt="${photo.title}" loading="lazy">
                            </div>
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-end p-3">
                                <div>
                                    <p class="text-white text-xs font-medium truncate">${photo.title}</p>
                                    <p class="text-white/60 text-[10px]">${formatDate(photo.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>`;

            // Bind click to open lightbox
            container.querySelectorAll('.photo-item').forEach(item => {
                item.addEventListener('click', () => {
                    lightboxIndex = parseInt(item.dataset.index);
                    showLightbox();
                });
            });
        };

        const showLightbox = () => {
            const lb = document.getElementById('photo-lightbox');
            const img = document.getElementById('lightbox-img');
            const info = document.getElementById('lightbox-info');
            const photo = photos[lightboxIndex];
            if (!photo) return;

            img.src = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${photo.id}?token=${localStorage.getItem('token')}`;
            info.textContent = `${photo.title || 'Untitled'} — ${formatFileSize(photo.file_size_kb)}`;
            lb.classList.remove('hidden');
            lb.classList.add('flex');
        };

        const hideLightbox = () => {
            const lb = document.getElementById('photo-lightbox');
            lb.classList.add('hidden');
            lb.classList.remove('flex');
        };

        document.getElementById('lightbox-close')?.addEventListener('click', hideLightbox);
        document.getElementById('lightbox-prev')?.addEventListener('click', () => {
            lightboxIndex = (lightboxIndex - 1 + photos.length) % photos.length;
            showLightbox();
        });
        document.getElementById('lightbox-next')?.addEventListener('click', () => {
            lightboxIndex = (lightboxIndex + 1) % photos.length;
            showLightbox();
        });
        // Keyboard nav
        document.addEventListener('keydown', (e) => {
            const lb = document.getElementById('photo-lightbox');
            if (lb?.classList.contains('hidden')) return;
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + photos.length) % photos.length; showLightbox(); }
            if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % photos.length; showLightbox(); }
        });

        const loadPhotos = async (reset = false) => {
            if (reset) { offset = 0; photos = []; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'image', limit, offset });
            if (res?.success) {
                const items = res.data?.items || [];
                photos = reset ? items : [...photos, ...items];
                renderGallery();
                const total = res.data?.total_count || 0;
                document.getElementById('photos-load-more').classList.toggle('hidden', photos.length >= total);
            }
        };

        document.getElementById('photos-load-more-btn')?.addEventListener('click', () => { offset += limit; loadPhotos(false); });
        document.getElementById('photos-upload-btn')?.addEventListener('click', () => showUploadModal(() => loadPhotos(true)));

        await loadPhotos(true);
    };

    return { html, init };
};
