import { get, del } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth } from '../../src/utils/auth.js';
import { TrackListSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { MediaNav } from '../components/MediaNav.js';
import { playTrack, playPlaylist, getCurrentTrack } from '../components/AudioPlayer.js';
import { formatDuration } from '../../src/utils/format.js';
import { showToast } from '../components/Toast.js';

/**
 * Immersive Playlist Overhaul (V2)
 * Total rework of UI and Logic
 */
export const Playlist = (playlistId) => {
    if (!requireAuth()) return { html: '', init: () => { } };

    const html = `
        <div id="playlist-view" class="relative min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500 overflow-x-hidden">
            <!-- Immersive Hero Layer -->
            <div id="hero-backdrop" class="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-purple-900/40 via-purple-900/10 to-transparent -z-10 opacity-0 transition-opacity duration-1000"></div>
            
            <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
                ${MediaNav()}

                <div class="mt-8 flex flex-col items-center">
                    <!-- Central Playlist Identity -->
                    <div class="w-full flex flex-col items-center text-center mb-12 animate-in fade-in zoom-in duration-700">
                        <div id="artwork-container" class="relative group cursor-pointer mb-8">
                            <!-- Visual Ring -->
                            <div class="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                            
                            <!-- Large Artwork -->
                            <div class="relative w-64 h-64 sm:w-80 sm:h-80 bg-zinc-200 dark:bg-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white dark:border-white/10 ring-1 ring-black/5 transform group-hover:scale-[1.02] transition-transform duration-500">
                                <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
                                    <svg class="w-32 h-32 text-white/10" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                                        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                                    </svg>
                                </div>
                                
                                <!-- Hover Play Overlay -->
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                    <div class="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-3xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                        <svg class="w-12 h-12 text-purple-600 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="max-w-3xl">
                            <h1 id="page-title" class="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 drop-shadow-sm leading-tight">Loading...</h1>
                            <p id="page-desc" class="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-medium tracking-tight opacity-70 mb-10 max-w-2xl mx-auto">—</p>
                            
                            <div class="flex flex-wrap items-center justify-center gap-4">
                                <button id="btn-play-all" class="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-purple-600 dark:hover:bg-purple-500 dark:hover:text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3">
                                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    PLAY EVERYTHING
                                </button>
                                <button id="btn-delete" class="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all active:scale-90" title="Delete Playlist">
                                    <svg class="w-6 h-6 text-current" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Refined Content Section -->
                    <div class="w-full mt-12 mb-24 animate-in slide-in-from-bottom duration-1000 delay-300">
                        <div class="grid grid-cols-1 gap-1" id="tracks-container">
                            ${TrackListSkeleton(12)}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .float { animation: float 6s ease-in-out infinite; }
            </style>
        </div>
    `;

    const init = async () => {
        const _state = {
            playlist: null,
            tracks: [],
            currentId: null
        };

        const updateUI = () => {
            const container = document.getElementById('tracks-container');
            const active = getCurrentTrack();
            
            if (!_state.tracks.length) {
                container.innerHTML = MediaGridEmpty('This playlist is waiting for its first track.', 'music');
                return;
            }

            container.innerHTML = _state.tracks.map((track, i) => {
                const isActive = active && active.id === track.id;
                return `
                <div class="group flex items-center px-6 py-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-all duration-300 cursor-pointer track-card ${isActive ? 'bg-white dark:bg-white/10 shadow-xl dark:shadow-none ring-1 ring-purple-500/20' : ''}" data-index="${i}">
                    <!-- Index Number / Play Icon -->
                    <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 relative">
                        <span class="text-xs font-mono font-black text-gray-400 group-hover:opacity-0 transition-opacity ${isActive ? 'text-purple-500' : ''}">${isActive ? '▶' : i + 1}</span>
                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg class="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                    </div>

                    <!-- Metadata -->
                    <div class="flex-1 px-4 min-w-0">
                        <h4 class="text-base font-bold truncate ${isActive ? 'text-purple-600' : 'text-gray-900 dark:text-white'} leading-tight tracking-tight">${track.title || 'Untitled Track'}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">${track.category || 'MUSIC'}</span>
                            <span class="text-[10px] text-gray-300 dark:text-gray-700 font-bold">•</span>
                            <span class="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">${new Date(track.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <!-- Actions & Time -->
                    <div class="flex items-center gap-6">
                        <span class="text-xs font-mono font-bold text-gray-400 group-hover:hidden">${track.duration_sec ? formatDuration(track.duration_sec) : '--'}</span>
                        <div class="hidden group-hover:flex items-center gap-2">
                             <button class="btn-remove p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors active:scale-90" data-id="${track.id}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        };

        // Centralized Event Delegation
        document.getElementById('playlist-view')?.addEventListener('click', async (e) => {
            const playBtn = e.target.closest('#btn-play-all');
            const artBtn = e.target.closest('#artwork-container');
            const deleteBtn = e.target.closest('#btn-delete');
            const trackCard = e.target.closest('.track-card');
            const removeBtn = e.target.closest('.btn-remove');

            // 1. Play All Actions
            if (playBtn || artBtn) {
                if (_state.tracks.length) playPlaylist(_state.tracks, 0);
                else showToast('Put some tracks in first!', 'info');
                return;
            }

            // 2. Individual Track Playback
            if (trackCard && !removeBtn) {
                const idx = parseInt(trackCard.dataset.index);
                playPlaylist(_state.tracks, idx);
                return;
            }

            // 3. Remove from Playlist
            if (removeBtn) {
                e.stopPropagation();
                const mediaId = removeBtn.dataset.id;
                const res = await del(`${CONFIG.ENDPOINTS.PLAYLIST}/${playlistId}/remove`, { media_id: parseInt(mediaId) });
                if (res?.success) {
                    showToast('Removed from playlist', 'info');
                    refresh();
                }
                return;
            }

            // 4. Delete Playlist
            if (deleteBtn) {
                if (confirm('Permanently delete this playlist? This cannot be undone.')) {
                    const res = await del(`${CONFIG.ENDPOINTS.PLAYLIST}/${playlistId}`);
                    if (res?.success) {
                        showToast('Playlist deleted', 'success');
                        window.history.pushState({}, "", "/music");
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                }
                return;
            }
        });

        const refresh = async () => {
            const res = await get(`${CONFIG.ENDPOINTS.PLAYLIST}/${playlistId}`);
            if (res?.success) {
                _state.playlist = res.data;
                _state.tracks = res.data.items?.map(i => i.media || i) || [];
                
                // Content Injection
                document.getElementById('page-title').textContent = _state.playlist.name;
                document.getElementById('page-desc').textContent = _state.playlist.description || 'Nothing else matters, just the music.';
                document.getElementById('hero-backdrop').style.opacity = '1';
                
                updateUI();
            } else {
                showToast(res?.error || 'Could not load your playlist', 'error');
            }
        };

        // Live Audio Sync
        if (window._pl_master_sync) window.removeEventListener('trackchanged', window._pl_master_sync);
        window._pl_master_sync = () => updateUI();
        window.addEventListener('trackchanged', window._pl_master_sync);

        // Initial Load
        await refresh();
    };

    return { html, init };
};
