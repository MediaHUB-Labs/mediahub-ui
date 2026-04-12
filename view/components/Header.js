import { get, getStreamUrl } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { getInitials, getUser, isLoggedIn } from '../../src/utils/auth.js';
import { toggleTheme } from '../../src/utils/theme.js';
import { showUploadModal } from './UploadModal.js';
import { playPlaylist } from './AudioPlayer.js';
import { ICONS } from '../../src/utils/icons.js';

export const Header = () => {
    const user = getUser();

    const html = `
        <header class="flex flex-col gap-4 md:flex-row items-center justify-between px-6 lg:px-8 py-3 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300 sticky top-0 z-30">
            <div class="flex items-center gap-4">
                <a href="/" data-link class="text-yellow-600 dark:text-yellow-500 font-bold text-2xl cursor-pointer tracking-tight hover:opacity-80 transition-opacity"> 
                    Media<span class="text-gray-900 dark:text-white">HUB</span> 
                </a>
                
                <button id="theme-toggle" class="rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all group border border-gray-200 dark:border-white/10 shadow-sm p-2">
                    <svg class="block dark:hidden w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                    </svg>
                    <svg class="hidden dark:block w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            </div>

            <div class="flex flex-1 justify-end items-center gap-4 w-full md:w-auto">
                <!-- Search -->
                <div class="relative w-full max-w-sm group" id="search-wrapper">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.search}</svg>
                    </span>
                    <input type="text" id="global-search-input"
                        class="w-full py-2 pl-10 pr-4 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 focus:border-transparent transition-all" 
                        placeholder="Search media..." autocomplete="off">
                    <!-- Search Results Dropdown -->
                    <div id="search-results" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl max-h-80 overflow-y-auto hidden z-50">
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    ${user ? `
                        <!-- Upload FAB -->
                        <button id="header-upload-btn" class="p-2. rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-orange-100 dark:hover:bg-yellow-500/10 text-gray-500 hover:text-orange-600 dark:hover:text-yellow-500 transition-all border border-gray-200 dark:border-white/10" title="Upload">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                ${ICONS.plus}
                            </svg>
                        </button>

                        <div class="flex flex-row justify-center items-center gap-3 pl-3 border-l border-gray-200 dark:border-white/10">
                            <div class="hidden lg:block text-right">
                                <p class="text-[12px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">${user.first_name} ${user.last_name}</p>
                            </div>
                            
                            <a href="/profile" data-link class="w-9 h-9 rounded-full bg-orange-600 dark:bg-yellow-500 flex items-center justify-center font-bold text-white dark:text-black text-xs shadow-lg hover:scale-105 transition-transform">
                                ${getInitials(user)}
                            </a>

                            <button id="logout-btn" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Log Out">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </button>
                        </div>
                    ` : `
                        <a href="/login" data-link class="flex items-center gap-2 text-xs font-bold uppercase px-3 md:px-5 py-2 md:py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-orange-600 dark:hover:bg-yellow-500 dark:hover:text-black transition-all shadow-md group">
                            <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <span class="hidden md:inline">Sign In</span>
                        </a>
                    `}
                </div>
            </div>
        </header>
    `;

    const init = () => {
        // Theme Toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            toggleTheme();
        });

        // Logout
        const btn = document.getElementById('logout-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = '/login';
            });
        }

        // Upload
        document.getElementById('header-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => {
                // Refresh current page
                window.dispatchEvent(new PopStateEvent('popstate'));
            });
        });

        // Global Search
        let searchTimeout = null;
        const searchInput = document.getElementById('global-search-input');
        const searchResults = document.getElementById('search-results');

        const hideResults = () => {
            searchResults?.classList.add('hidden');
        };

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const q = e.target.value.trim();
            if (!q) { hideResults(); return; }

            searchTimeout = setTimeout(async () => {
                if (!isLoggedIn()) return;
                const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q, limit: 8 });
                if (res?.success) {
                    const items = res.data?.items || [];
                    if (items.length === 0) {
                        searchResults.innerHTML = `<div class="p-4 text-sm text-gray-400 text-center">No results for "${q}"</div>`;
                    } else {
                        searchResults.innerHTML = items.map(item => {
                            const isVideo = item.mime_type?.startsWith('video/');
                            const isAudio = item.mime_type?.startsWith('audio/');
                            const link = isVideo ? `/player/${item.id}` : isAudio ? '#' : '#';
                            const typeLabel = isVideo ? 'Video' : isAudio ? 'Audio' : item.mime_type?.startsWith('image/') ? 'Photo' : 'Document';
                            const typeColor = isVideo ? 'text-blue-500' : isAudio ? 'text-purple-500' : item.mime_type?.startsWith('image/') ? 'text-emerald-500' : 'text-amber-500';

                            return `
                            <a href="${link}" ${link !== '#' ? 'data-link' : ''} class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer search-result-item" data-id="${item.id}" data-type="${typeLabel.toLowerCase()}">
                                <div class="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="text-xs font-bold ${typeColor}">${typeLabel.charAt(0)}</span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${item.title}</p>
                                    <p class="text-[11px] ${typeColor}">${typeLabel} ${item.category ? '• ' + item.category : ''}</p>
                                </div>
                            </a>`;
                        }).join('');

                        // Re-bind global search click behaviors
                        searchResults.querySelectorAll('.search-result-item').forEach(row => {
                            row.addEventListener('click', (e) => {
                                const type = row.dataset.type;
                                if (type === 'video') {
                                    hideResults();
                                    return; // Handled natively by data-link interception
                                }

                                e.preventDefault(); // Stop href="#" scroll logic
                                const item = items.find(i => i.id === parseInt(row.dataset.id));
                                if (!item) return;

                                hideResults();

                                if (type === 'audio') {
                                    playPlaylist([item], 0);
                                } else {
                                    const streamUrl = getStreamUrl(item.id);
                                    window.open(streamUrl);
                                }
                            });
                        });
                    }
                    searchResults.classList.remove('hidden');
                }
            }, 350);
        });

        // Close search on click outside (Managed handler to prevent leaks)
        if (window._headerDocClick) document.removeEventListener('click', window._headerDocClick);
        window._headerDocClick = (e) => {
            if (!e.target.closest('#search-wrapper')) hideResults();
        };
        document.addEventListener('click', window._headerDocClick);

        // Close on Escape
        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { hideResults(); searchInput.blur(); }
        });
    };

    return { html, init };
};
