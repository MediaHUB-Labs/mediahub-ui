import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth, isLoggedIn } from '../../src/utils/auth.js';
import { MediaGrid, MediaGridSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { showUploadModal } from '../components/UploadModal.js';
import { MediaNav } from '../components/MediaNav.js';
import { showToast } from '../components/Toast.js';

export const Movies = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span class="text-orange-600 dark:text-yellow-500">🎬</span> Movies
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Browse and stream your movie collection</p>
                </div>
                ${loggedIn ? `
                <button id="movies-upload-btn" class="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 dark:hover:bg-yellow-500 dark:hover:text-black transition-all shadow-lg">
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
                        <input type="text" id="movies-search" placeholder="Search movies..."
                            class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500">
                    </div>
                </div>
                <select id="movies-category" class="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white outline-none cursor-pointer">
                    <option value="">All Categories</option>
                </select>
                <div class="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                    <button id="view-grid" class="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-600 dark:text-yellow-500 bg-white dark:bg-white/10 shadow-sm">Grid</button>
                    <button id="view-list" class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition">List</button>
                </div>
            </div>

            <!-- Content -->
            <div id="movies-content">
                ${MediaGridSkeleton()}
            </div>

            <!-- Load More -->
            <div id="movies-load-more" class="hidden text-center py-8">
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

        // Load categories
        const catRes = await get(CONFIG.ENDPOINTS.MEDIA_CATEGORIES);
        if (catRes?.success && catRes.data?.categories) {
            const select = document.getElementById('movies-category');
            catRes.data.categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                select.appendChild(opt);
            });
        }

        // Load movies
        const loadMovies = async (reset = false) => {
            if (reset) { currentOffset = 0; allItems = []; }

            const params = {
                type: 'video',
                limit,
                offset: currentOffset,
            };

            const category = document.getElementById('movies-category')?.value;
            if (category) params.category = category;

            const res = await get(CONFIG.ENDPOINTS.MEDIA_LIST, params);
            const content = document.getElementById('movies-content');

            if (res?.success) {
                const items = res.data?.items || [];
                allItems = reset ? items : [...allItems, ...items];
                content.innerHTML = allItems.length > 0 ? MediaGrid(allItems) : MediaGridEmpty('No movies found', 'folder');

                // Show/hide load more
                const totalCount = res.data?.total_count || 0;
                const loadMoreDiv = document.getElementById('movies-load-more');
                if (allItems.length < totalCount) {
                    loadMoreDiv.classList.remove('hidden');
                } else {
                    loadMoreDiv.classList.add('hidden');
                }
            } else {
                content.innerHTML = MediaGridEmpty('Failed to load movies');
            }
        };

        // Search
        const doSearch = async (query) => {
            if (!query.trim()) { loadMovies(true); return; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q: query, limit: 50 });
            const content = document.getElementById('movies-content');
            if (res?.success) {
                const items = (res.data?.items || []).filter(i => i.mime_type?.startsWith('video/'));
                content.innerHTML = items.length > 0 ? MediaGrid(items) : MediaGridEmpty('No results found', 'search');
                document.getElementById('movies-load-more').classList.add('hidden');
            }
        };

        document.getElementById('movies-search')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => doSearch(e.target.value), 400);
        });

        document.getElementById('movies-category')?.addEventListener('change', () => loadMovies(true));

        document.getElementById('load-more-btn')?.addEventListener('click', () => {
            currentOffset += limit;
            loadMovies(false);
        });

        document.getElementById('movies-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => loadMovies(true));
        });

        // Initial load
        await loadMovies(true);
    };

    return { html, init };
};
