import { MediaNav } from "./components/MediaNav.js";
import { get } from '../src/global/api.js';
import { CONFIG } from '../src/global/config.js';
import { isLoggedIn } from '../src/utils/auth.js';
import { MediaRow, ContinueWatchingRow } from './components/MediaRow.js';
import { playTrack } from './components/AudioPlayer.js';

export const Home = () => {
    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            ${MediaNav()}

            <div class="transition-colors duration-300">
                ${HeroBanner()}

                <!-- Dynamic Sections -->
                <div class="mt-16 relative w-full">
                    <!-- Subtle ambient ambient glow matching app aesthetics -->
                    <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-gradient-to-b from-purple-500/10 via-orange-500/5 to-transparent rounded-[100%] blur-[100px] pointer-events-none -z-10"></div>
                    
                    <div id="home-sections" class="space-y-16 relative z-10 px-2 sm:px-4">
                        <!-- Continue Watching -->
                        <div id="section-continue" class="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both ease-out"></div>
                        
                        <!-- Recently Added -->
                        <div id="section-recent" class="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 fill-mode-both ease-out">
                            <section class="mb-8">
                                <div class="flex justify-between items-center mb-6">
                                    <div class="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 rounded-xl animate-pulse"></div>
                                </div>
                                <div class="flex gap-5 overflow-hidden">
                                    ${Array(6).fill(0).map(() => `
                                        <div class="flex-shrink-0 w-36 sm:w-40 md:w-44 flex flex-col gap-3">
                                            <div class="aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 rounded-2xl animate-pulse shadow-sm"></div>
                                            <div class="h-4 bg-gray-200 dark:bg-white/5 rounded-lg w-3/4 animate-pulse"></div>
                                            <div class="h-3 bg-gray-200 dark:bg-white/5 rounded-lg w-1/2 animate-pulse mt-1"></div>
                                        </div>
                                    `).join('')}
                                </div>
                            </section>
                        </div>
                        
                        <!-- Movies -->
                        <div id="section-movies" class="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both ease-out"></div>
                        <!-- Music -->
                        <div id="section-music" class="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both ease-out"></div>
                    </div>
                </div>

                <div class="h-20"></div>
            </div>
        </div>
    `;

    const init = async () => {
        const loggedIn = isLoggedIn();
        
        // Prepare requests
        const requests = [
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { limit: 12 }),
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video', category: 'Movie', limit: 8 }),
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'audio', limit: 8 }),
        ];

        // Only fetch progress if logged in
        if (loggedIn) {
            requests.unshift(get(CONFIG.ENDPOINTS.PROGRESS_CONTINUE, { limit: 10 }));
        }

        const responses = await Promise.all(requests);
        
        let continueRes, recentRes, movieRes, musicRes;
        if (loggedIn) {
            [continueRes, recentRes, movieRes, musicRes] = responses;
        } else {
            [recentRes, movieRes, musicRes] = responses;
        }

        // Continue Watching
        const continueEl = document.getElementById('section-continue');
        if (continueRes?.success && continueRes.data?.length > 0) {
            const cwItems = continueRes.data.filter(item => 
                item.media?.mime_type?.startsWith('video/') || 
                item.media?.mime_type?.startsWith('audio/') ||
                item.media?.type === 'video' ||
                item.media?.type === 'audio'
            );
            if(cwItems.length > 0) {
                continueEl.innerHTML = ContinueWatchingRow(cwItems);
            }
        }

        // Recently Added
        const recentEl = document.getElementById('section-recent');
        if (recentRes?.success) {
            let items = recentRes.data?.items || [];
            items = items.filter(item => 
                item.mime_type?.startsWith('video/') || 
                item.mime_type?.startsWith('audio/') ||
                item.type === 'video' ||
                item.type === 'audio'
            );
            recentEl.innerHTML = MediaRow('Recently Added', items, '/movies', 'No media uploaded yet');
        }

        // Movies
        const movieEl = document.getElementById('section-movies');
        if (movieRes?.success) {
            const items = movieRes.data?.items || [];
            if (items.length > 0) {
                movieEl.innerHTML = MediaRow('Explore Movies', items, '/movies');
            }
        }

        // Music
        const musicEl = document.getElementById('section-music');
        if (musicRes?.success) {
            const items = musicRes.data?.items || [];
            if (items.length > 0) {
                musicEl.innerHTML = MediaRow('Your Music', items, '/music');
            }
        }

        // --- Bind Audio Clicks ---
        const allItems = [
            ...(continueRes?.data || []).map(i => i.media),
            ...(recentRes?.data?.items || []),
            ...(movieRes?.data?.items || []),
            ...(musicRes?.data?.items || [])
        ].filter(Boolean);

        document.querySelectorAll('[data-media-type="audio"]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const id = parseInt(card.dataset.mediaId);
                const item = allItems.find(i => i.id === id);
                if (item) {
                    playTrack(item);
                }
            });
        });
    };

    return { html, init };
};

const HeroBanner = () => {
    return `
        <section class="relative w-full overflow-hidden rounded-3xl group shadow-2xl bg-gray-200 dark:bg-zinc-900">
            <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-black dark:via-black/60 dark:to-transparent z-10 transition-colors duration-300"></div>
            
            <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-purple-600/20 dark:from-orange-600/10 dark:to-purple-600/10"></div>

            <div class="relative z-20 p-8 md:p-10 h-full flex flex-col justify-center max-w-3xl min-h-[280px]">
                <div class="flex items-center gap-2 mb-4">
                    <span class="bg-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded text-white">Featured</span>
                    <span class="text-gray-600 dark:text-white/60 text-sm font-medium">Now Streaming</span>
                </div>
                
                <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
                    Your Personal <span class="text-orange-600 dark:text-orange-500">Media Vault.</span>
                </h1>
                
                <p class="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    Access your entire collection of movies, music, photos, and documents from any device. 
                    Organized, beautiful, and ready to play.
                </p>

                <div class="flex gap-4 flex-col md:flex-row">
                    <a href="/movies" data-link class="bg-gray-900 text-white dark:bg-white dark:text-black px-8 py-3 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all flex justify-center items-center shadow-lg">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"/></svg>
                        Browse Library
                    </a>
                    <a href="/music" data-link class="bg-black/5 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white border border-black/10 dark:border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/20 transition-all text-center">
                        🎵 Music Library
                    </a>
                </div>
            </div>
        </section>
    `;
};