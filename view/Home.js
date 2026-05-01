import { MediaNav } from "./components/MediaNav.js";
import { get } from '../src/global/api.js';
import { CONFIG } from '../src/global/config.js';
import { isLoggedIn } from '../src/utils/auth.js';
import { MediaRow, ContinueWatchingRow } from './components/MediaRow.js';
import { playTrack } from './components/AudioPlayer.js';
import { ICONS } from '../src/utils/icons.js';
import { showUploadModal } from "./components/UploadModal.js";

/**
 * Home Page — The heart of the MediaHub dashboard.
 */
export const Home = () => {
    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 overflow-x-hidden transition-all duration-500">
            <!-- Navigation & Stats Merged -->
            <div id="home-nav-container" class="animate-in fade-in slide-in-from-top-4 duration-700">
                ${MediaNav()}
            </div>

            <!-- Dynamic Hero -->
            <div id="home-featured" class="animate-in fade-in zoom-in-95 duration-1000 delay-200 fill-mode-both">
                <div class="h-[400px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
            </div>

            <div class="relative w-full">
                <!-- Ambient Glows -->
                <div class="absolute -top-32 left-1/4 w-[400px] h-[400px] bg-orange-500/[0.03] dark:bg-orange-500/[0.08] rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-1000"></div>
                <div class="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] dark:bg-purple-500/[0.08] rounded-full blur-[150px] pointer-events-none -z-10 transition-colors duration-1000"></div>
                
                <div id="home-sections" class="space-y-20 relative z-10">
                    <!-- Continue Watching -->
                    <div id="section-continue"></div>
                    
                    <!-- Recently Added -->
                    <div id="section-recent">
                         <div class="h-64 bg-gray-50 dark:bg-white/[0.02] rounded-[2rem] animate-pulse"></div>
                    </div>
                    
                    <!-- Movies -->
                    <div id="section-movies"></div>
                    
                    <!-- Videos -->
                    <div id="section-videos"></div>
                    
                    <!-- Music -->
                    <div id="section-music"></div>
                </div>
            </div>
        </div>
    `;

    const init = async () => {
        const loggedIn = isLoggedIn();

        // Prepare requests
        const requests = [
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { limit: 12 }),        // [0] Recently Added
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video', category: 'Movie', limit: 10 }), // [1] Movies
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video', limit: 30 }), // [2] Videos (to filter)
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'audio', limit: 10 }), // [3] Music
        ];

        if (loggedIn) {
            requests.unshift(get(CONFIG.ENDPOINTS.PROGRESS_CONTINUE, { limit: 10 }));
        }

        const statsRequests = [
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video', category: 'Movie', limit: 1 }),
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'audio', limit: 1 }),
            get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'image', limit: 1 }),
            get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'document', limit: 1 }),
            get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'video', limit: 1 }) // Total videos
        ];

        const [responses, statsResponses] = await Promise.all([
            Promise.all(requests),
            Promise.all(statsRequests)
        ]);

        let continueRes, recentRes, movieRes, videoRes, musicRes;
        if (loggedIn) {
            [continueRes, recentRes, movieRes, videoRes, musicRes] = responses;
        } else {
            [recentRes, movieRes, videoRes, musicRes] = responses;
        }

        // --- Update Nav Stats ---
        const navContainer = document.getElementById('home-nav-container');
        const stats = {
            movies: statsResponses[0].data?.total_count || 0,
            music: statsResponses[1].data?.total_count || 0,
            photos: statsResponses[2].data?.total_count || 0,
            docs: statsResponses[3].data?.total_count || 0,
            videos: (statsResponses[4].data?.total_count || 0) - (statsResponses[0].data?.total_count || 0)
        };
        if (stats.videos < 0) stats.videos = statsResponses[4].data?.total_count || 0;
        navContainer.innerHTML = MediaNav(stats);

        // --- Render Hero ---
        const featuredEl = document.getElementById('home-featured');
        const moviesForHero = (movieRes.data?.items || []).filter(v => v.type === 'video');
        const featured = moviesForHero.length > 0 ? moviesForHero[0] : null; featuredEl.innerHTML = `
            <section class="relative min-h-[500px] w-full overflow-hidden rounded-[2.5rem] group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-2xl transition-all duration-300">
                <!-- Branded Background Layer -->
                <div class="absolute inset-0 opacity-30 dark:opacity-50">
                    ${featured ? `
                        <img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${featured.id}?token=${localStorage.getItem('token')}" class="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110 ease-out" 
                             onerror="this.src='https://images.unsplash.com/photo-1485090916713-f3689b7e1960?q=80&w=2670&auto=format&fit=crop'">
                    ` : `
                        <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-black"></div>
                    `}
                </div>
                <!-- Dynamic Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/60 dark:to-transparent z-10 transition-colors duration-500"></div>
                
                <div class="relative z-20 p-8 md:p-16 h-full min-h-[500px] flex flex-col justify-center max-w-4xl">
                    <div class="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                        <span class="bg-orange-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg text-white shadow-lg tracking-[0.2em] flex items-center gap-2">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.play}</svg>
                             MediaHUB Vault
                        </span>
                    </div>
                    
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                        Your Personal <span class="text-orange-500">Collection</span>
                    </h1>
                    
                    <p class="text-sm md:text-lg text-gray-600 dark:text-white/50 mb-10 leading-relaxed line-clamp-2 font-medium max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                        ${featured ? `Enjoying <span class="text-gray-900 dark:text-white font-bold">${featured.title}</span>. ` : ''}Securely manage and stream your movies, music, and private media archive from any device.
                    </p>
                    <div class="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                        ${featured ? `
                            <a href="/player/${featured.id}" data-link class="bg-gray-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-orange-500 hover:text-white transition-all flex items-center shadow-2xl group/btn hover:scale-105 active:scale-95">
                                <svg class="w-5 h-5 mr-3 fill-current group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24">${ICONS.play}</svg>
                                WATCH NOW
                            </a>
                        ` : ''}
                        <button id="hero-upload-btn" class="bg-white/40 dark:bg-black/40 backdrop-blur-xl text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-xl hover:scale-105 active:scale-95">
                            UPLOAD FILE
                        </button>
                    </div>
                </div>
            </section>
        `;

        const heroUpload = document.getElementById('hero-upload-btn');
        if (heroUpload) {
            heroUpload.onclick = () => showUploadModal(() => window.location.reload());
        }

        // --- Render Rows ---
        // Recently Added
        const recentEl = document.getElementById('section-recent');
        if (recentRes?.success) {
            let items = recentRes.data?.items || [];
            items = items.filter(item => item.type === 'video' || item.type === 'audio');
            recentEl.innerHTML = MediaRow('Latest Arrivals', items, '/movies', 'No media uploaded yet');
        }

        // Movies row
        const movieEl = document.getElementById('section-movies');
        if (movieRes?.success) {
            const items = movieRes.data?.items || [];
            if (items.length > 0) {
                movieEl.innerHTML = MediaRow('Latest Movies', items, '/movies');
            }
        }

        // Videos row
        const videoEl = document.getElementById('section-videos');
        if (videoRes?.success) {
            const items = (videoRes.data?.items || []).filter(i => i.category !== 'Movie');
            if (items.length > 0) {
                videoEl.innerHTML = MediaRow('Top Videos', items, '/videos');
            }
        }

        // Music row
        const musicEl = document.getElementById('section-music');
        if (musicRes?.success) {
            const items = musicRes.data?.items || [];
            if (items.length > 0) {
                musicEl.innerHTML = MediaRow('Fresh Tracks', items, '/music');
            }
        }

        // Continue Watching
        const continueEl = document.getElementById('section-continue');
        if (continueRes?.success && continueRes.data?.length > 0) {
            const cwItems = continueRes.data.filter(item => item.media);
            if (cwItems.length > 0) {
                continueEl.innerHTML = ContinueWatchingRow(cwItems);
            }
        }

        // --- Audio Listeners ---
        const allItems = [
            ...(continueRes?.data || []).map(i => i.media),
            ...(recentRes?.data?.items || []),
            ...(movieRes?.data?.items || []),
            ...(musicRes?.data?.items || [])
        ].filter(Boolean);

        document.querySelectorAll('[data-media-type="music"]').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = parseInt(card.dataset.mediaId);
                const item = allItems.find(i => i.id === id);
                if (item) playTrack(item);
            });
        });
    };

    return { html, init };
};