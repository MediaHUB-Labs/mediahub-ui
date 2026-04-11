import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { isLoggedIn } from '../../src/utils/auth.js';
import { MediaGrid, MediaGridSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { MediaNav } from '../components/MediaNav.js';
import { showUploadModal } from '../components/UploadModal.js';
import { showToast } from '../components/Toast.js';

export const Videos = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span class="text-rose-500">📹</span> Personal Videos
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Your personal video collection and clips</p>
                </div>
                ${loggedIn ? `
                <button id="videos-upload-btn" class="flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-500 transition-all shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Upload
                </button>
                ` : ''}
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="flex flex-1 min-w-0 max-w-xs">
                    <div class="relative w-full">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" id="videos-search" placeholder="Search videos..."
                            class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500">
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div id="videos-content">
                ${MediaGridSkeleton()}
            </div>

            <!-- Load More -->
            <div id="videos-load-more" class="hidden text-center py-8">
                <button id="load-more-btn" class="px-8 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                    Load More
                </button>
            </div>
        </div>
    `;

    const init = async () => {
        let currentOffset = 0;
        const limit = 24;
        let allItems = [];
        let searchTimeout = null;

        // Load videos
        const loadVideos = async (reset = false) => {
            if (reset) { currentOffset = 0; allItems = []; }

            const params = {
                type: 'video',
                // Filter by category if we want to distinguish from "Movie"
                // But for now, let's just fetch all videos and filter out "Movie" category if needed
                // actually the user wants a "Videos" tab, so let's assume Category="Video" or "Home Video"
                limit,
                offset: currentOffset,
            };

            const res = await get(CONFIG.ENDPOINTS.MEDIA_LIST, params);
            const content = document.getElementById('videos-content');

            if (res?.success) {
                // Filter items to show only things that aren't "Movie" category if they overlap
                // Or just show all videos if that's what's expected.
                // Given the context, "Videos" usually means non-Movie content.
                const items = (res.data?.items || []).filter(item => item.category !== 'Movie');
                
                allItems = reset ? items : [...allItems, ...items];
                content.innerHTML = allItems.length > 0 ? MediaGrid(allItems) : MediaGridEmpty('No videos found', 'play');

                const totalCount = res.data?.total_count || 0;
                const loadMoreDiv = document.getElementById('videos-load-more');
                loadMoreDiv.classList.toggle('hidden', allItems.length >= totalCount);
            } else {
                content.innerHTML = MediaGridEmpty('Failed to load videos');
            }
        };

        // Search
        const doSearch = async (query) => {
            if (!query.trim()) { loadVideos(true); return; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q: query, limit: 50 });
            const content = document.getElementById('videos-content');
            if (res?.success) {
                const items = (res.data?.items || []).filter(i => i.mime_type?.startsWith('video/') && i.category !== 'Movie');
                content.innerHTML = items.length > 0 ? MediaGrid(items) : MediaGridEmpty('No results found', 'search');
                document.getElementById('videos-load-more').classList.add('hidden');
            }
        };

        document.getElementById('videos-search')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => doSearch(e.target.value), 400);
        });

        document.getElementById('load-more-btn')?.addEventListener('click', () => {
            currentOffset += limit;
            loadVideos(false);
        });

        document.getElementById('videos-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => loadVideos(true));
        });

        await loadVideos(true);
    };

    return { html, init };
};
