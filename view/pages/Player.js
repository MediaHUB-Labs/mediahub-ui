import { get, post, getStreamUrl } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth, isLoggedIn } from '../../src/utils/auth.js';
import { formatDuration, formatFileSize, formatDate } from '../../src/utils/format.js';
import { showToast } from '../components/Toast.js';
import { pauseAudioDock } from '../components/AudioPlayer.js';

/**
 * Video Player Page — full-screen player with progress tracking.
 */
export const Player = (mediaId) => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1800px] relative">
            <!-- Theater Glow Ambient Background -->
            <div id="theater-glow" class="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[80vh] bg-gradient-to-b from-orange-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none -z-10 transition-colors duration-1000"></div>

            <!-- Video Container -->
            <div class="relative bg-black rounded-3xl overflow-hidden shadow-[0_30px_100px_-15px_rgba(0,0,0,0.6)] dark:shadow-[0_30px_100px_-15px_rgba(0,0,0,1)] mb-8 border border-gray-200 dark:border-white/10 group z-10 w-full lg:w-[90%] xl:w-[85%] mx-auto transition-transform duration-500 hover:scale-[1.01]">
                <video id="video-player" class="w-full aspect-video outline-none" controls autoplay>
                    <source src="${getStreamUrl(mediaId)}">
                    Your browser does not support the video tag.
                </video>
            </div>

            <!-- Media Info -->
            <div id="player-info" class="animate-pulse">
                <div class="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-1/3 mb-4"></div>
                <div class="h-4 bg-gray-200 dark:bg-white/5 rounded-lg w-2/3 mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-white/5 rounded-lg w-1/2"></div>
            </div>
        </div>
    `;

    const init = async () => {
        const video = document.getElementById('video-player');
        const infoContainer = document.getElementById('player-info');

        // Immediately pause audio dock since video autoplays
        pauseAudioDock();

        // Also ensure we pause audio if user manually clicks play later
        video.addEventListener('play', pauseAudioDock);
        video.addEventListener('playing', pauseAudioDock);

        // Load media details
        const res = await post(CONFIG.ENDPOINTS.MEDIA_DETAILS, { id: parseInt(mediaId) });
        if (!res?.success) {
            infoContainer.innerHTML = `<p class="text-red-500">Failed to load media details</p>`;
            return;
        }

        const media = res.data;

        // Set glow based on video category
        const glow = document.getElementById('theater-glow');
        if (glow && media.category === 'Movie') {
            glow.className = glow.className.replace('from-orange-500/10', 'from-blue-500/20').replace('via-purple-500/5', 'via-indigo-500/10');
        }

        // Render info
        infoContainer.innerHTML = `
            <div class="flex flex-col lg:flex-row lg:items-start gap-8 w-full lg:w-[90%] xl:w-[85%] mx-auto bg-white/50 dark:bg-black/20 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl transition-all">
                <div class="flex-1 min-w-0">
                    <h1 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">${media.title || 'Untitled'}</h1>
                    
                    <div class="flex flex-wrap items-center gap-3 mb-6">
                        ${media.category ? `<span class="text-[11px] font-black uppercase tracking-widest text-orange-600 dark:text-yellow-500 bg-orange-50 dark:bg-yellow-500/10 px-3.5 py-1.5 rounded-xl border border-orange-200 dark:border-yellow-500/20">${media.category}</span>` : ''}
                        ${media.genres ? media.genres.split(',').map(g => `
                            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10">${g.trim()}</span>
                        `).join('') : ''}
                    </div>
                    
                    ${media.description ? `<p class="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">${media.description}</p>` : ''}
                    
                    <div class="flex flex-wrap gap-x-8 gap-y-3 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-white/10">
                        ${media.duration_sec ? `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ${formatDuration(media.duration_sec)}</span>` : ''}
                        ${media.resolution ? `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> ${media.resolution}</span>` : ''}
                        ${media.file_size_kb ? `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg> ${formatFileSize(media.file_size_kb)}</span>` : ''}
                        <span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> ${formatDate(media.created_at)}</span>
                    </div>
                </div>
                
                <div class="flex gap-4 flex-shrink-0 mt-2 lg:mt-0">
                    ${media.is_transcoded ? `
                    <button id="play-hls-btn" class="px-5 py-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-600/30">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>
                        HLS Stream
                    </button>` : ''}
                </div>
            </div>
        `;

        // ─── Progress Tracking ───
        let lastSavedTime = 0;
        const SAVE_INTERVAL = 15; // seconds

        if (loggedIn) {
            // Load existing progress
            const progressRes = await get(CONFIG.ENDPOINTS.PROGRESS_CONTINUE, { limit: 50 });
            if (progressRes?.success) {
                const existing = (progressRes.data || []).find(item => item.media?.id === parseInt(mediaId));
                if (existing?.progress?.playhead_position_sec > 0) {
                    video.currentTime = existing.progress.playhead_position_sec;
                    lastSavedTime = existing.progress.playhead_position_sec;
                }
            }

            const saveProgress = async () => {
                if (!video.currentTime || video.currentTime - lastSavedTime < SAVE_INTERVAL) return;
                lastSavedTime = video.currentTime;
                await post(CONFIG.ENDPOINTS.PROGRESS_SAVE, {
                    media_id: parseInt(mediaId),
                    position_sec: video.currentTime,
                });
            };

            // Save on pause
            video.addEventListener('pause', saveProgress);

            // Save periodically during playback
            const progressInterval = setInterval(() => {
                if (!video.paused) saveProgress();
            }, SAVE_INTERVAL * 1000);

            // Save on page leave
            const beforeUnload = () => {
                if (video.currentTime > 0) {
                    // Use sendBeacon for async save before unload
                    const token = localStorage.getItem('token');
                    navigator.sendBeacon(
                        `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.PROGRESS_SAVE}`,
                        new Blob([JSON.stringify({
                            media_id: parseInt(mediaId),
                            position_sec: video.currentTime,
                        })], { type: 'application/json' })
                    );
                }
                clearInterval(progressInterval);
            };
            window.addEventListener('beforeunload', beforeUnload);

            // Cleanup when navigating away
            const popStateHandler = () => {
                video.pause();
                beforeUnload();
                window.removeEventListener('popstate', popStateHandler);
                window.removeEventListener('beforeunload', beforeUnload);
            };
            window.addEventListener('popstate', popStateHandler);
        }
    };

    return { html, init };
};
