import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { isLoggedIn } from '../../src/utils/auth.js';
import { MediaGrid, MediaGridSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { showUploadModal } from '../components/UploadModal.js';
import { MediaNav } from '../components/MediaNav.js';
import { ICONS } from '../../src/utils/icons.js';

export const Videos = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-4">
                <div class="flex items-center gap-4">
                    <a href="/" data-link class="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-rose-600 rounded-xl transition-all active:scale-90 shadow-sm" title="Back to Dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.back}</svg>
                    </a>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.video}</svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Videos</h1>
                            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Personal clips and recordings</p>
                        </div>
                    </div>
                </div>
                ${loggedIn ? `
                <button id="video-upload-btn" class="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-500 transition-all shadow-lg active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ICONS.upload}</svg>
                    Upload Video
                </button>
                ` : ''}
            </div>

            <div id="video-grid-container">
                ${MediaGridSkeleton(12)}
            </div>
        </div>
    `;

    const init = async () => {
        const fetchVideos = async () => {
            const container = document.getElementById('video-grid-container');
            const res = await get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video' });
            
            if (res?.success) {
                // Filter out movies
                const items = (res.data?.items || []).filter(i => i.category !== 'Movie');
                if (items.length === 0) {
                    container.innerHTML = MediaGridEmpty('No videos found', 'video');
                } else {
                    container.innerHTML = MediaGrid(items);
                }
            } else {
                container.innerHTML = MediaGridEmpty('Failed to load videos', 'video');
            }
        };

        fetchVideos();

        document.getElementById('video-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => fetchVideos());
        });
    };

    return { html, init };
};
