import { get, post, del } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth, isLoggedIn } from '../../src/utils/auth.js';
import { MediaGrid, MediaGridSkeleton, TrackListSkeleton, MediaGridEmpty } from '../components/MediaGrid.js';
import { showUploadModal } from '../components/UploadModal.js';
import { showToast } from '../components/Toast.js';
import { openModal, closeModal } from '../components/Modal.js';
import { playTrack, playPlaylist, getCurrentTrack } from '../components/AudioPlayer.js';
import { MediaNav } from '../components/MediaNav.js';
import { formatDuration } from '../../src/utils/format.js';
import { ICONS } from '../../src/utils/icons.js';

export const Music = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            
            <!-- Page Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
                <div class="flex items-center gap-5">
                    <a href="/" data-link class="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-purple-500 rounded-2xl transition-all shadow-sm group" title="Back to Dashboard">
                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.back}</svg>
                    </a>
                    <div class="flex items-center gap-5">
                        <div class="w-14 h-14 bg-purple-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-purple-500/20">
                            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.music}</svg>
                        </div>
                        <div>
                            <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Music Library</h1>
                            <p class="text-gray-500 dark:text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mt-1">High-Fidelity Audio Vault</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    ${loggedIn ? `
                    <button id="music-upload-btn" class="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 transition-all shadow-xl active:scale-95">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.upload}</svg>
                        Import Audio
                    </button>
                    <button id="music-create-playlist-btn" class="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-purple-500 rounded-2xl transition-all border border-transparent hover:border-purple-500/30" title="New Playlist">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.plus}</svg>
                    </button>
                    ` : ''}
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <!-- Sidebar: Playlists -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                             <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-zinc-500">Your Playlists</h3>
                             <span id="playlist-count" class="text-[10px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-lg border border-purple-500/20">0</span>
                        </div>
                        <div id="playlist-list" class="space-y-3">
                             ${Array(4).fill(0).map(() => `<div class="h-12 bg-gray-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>`).join('')}
                        </div>
                    </div>
                    
                    <!-- Quick Stats -->
                    <div class="bg-gradient-to-br from-purple-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/10">
                         <p class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 text-white">Storage Usage</p>
                         <h4 class="text-2xl font-black tracking-tighter mb-4">Lossless Audio</h4>
                         <div class="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                             <div class="h-full bg-white rounded-full" style="width: 45%"></div>
                         </div>
                    </div>
                </div>

                <!-- Main Content: Tracks -->
                <div class="lg:col-span-3 space-y-6">
                    <!-- Search & Filter Bar -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1 relative group">
                            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.search}</svg>
                            <input type="text" id="music-search" placeholder="Search track, album, or artist..."
                                class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all placeholder-gray-400 dark:placeholder-zinc-600">
                        </div>
                        <button id="music-play-all" class="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">${ICONS.play}</svg>
                            Play Collection
                        </button>
                    </div>

                    <!-- Track Header -->
                    <div class="grid grid-cols-12 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 border-b border-gray-200 dark:border-white/5">
                        <div class="col-span-1">#</div>
                        <div class="col-span-6 md:col-span-7">Title</div>
                        <div class="col-span-3 md:col-span-2">Category</div>
                        <div class="col-span-2 md:col-span-2 text-right">Duration</div>
                    </div>

                    <!-- Track List -->
                    <div id="music-tracks" class="space-y-1">
                        ${TrackListSkeleton(10)}
                    </div>

                    <div id="music-load-more" class="hidden text-center py-10">
                        <button id="music-load-more-btn" class="px-10 py-3 bg-gray-100 dark:bg-zinc-800 border border-transparent hover:border-purple-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-600 transition-all cursor-pointer">
                            Load More Tracks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const init = async () => {
        let musicItems = [];
        let offset = 0;
        const limit = 30;
        let searchTimeout = null;

        const renderTrackList = (tracks) => {
            const container = document.getElementById('music-tracks');
            const currentTrack = getCurrentTrack();

            if (!tracks || tracks.length === 0) {
                container.innerHTML = MediaGridEmpty('No tracks found in library', 'music');
                return;
            }

            container.innerHTML = tracks.map((track, idx) => {
                const isActive = currentTrack && currentTrack.id === track.id;
                return `
                <div class="grid grid-cols-12 items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer track-row ${isActive ? 'bg-purple-50 dark:bg-purple-500/5 ring-1 ring-purple-500/20' : ''}" data-id="${track.id}" data-index="${idx}">
                    <div class="col-span-1">
                        <span class="text-xs font-black font-mono ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}">
                            ${isActive ? '▶' : (idx + 1).toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div class="col-span-6 md:col-span-7 flex items-center gap-4 min-w-0">
                        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative overflow-hidden">
                             <svg class="w-4 h-4 text-purple-600 dark:text-purple-400 ${isActive ? 'opacity-0' : 'group-hover:opacity-0'} transition-opacity" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.music}</svg>
                             <div class="absolute inset-0 flex items-center justify-center bg-purple-600 text-white opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'} transition-opacity shadow-inner">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">${ICONS.play}</svg>
                             </div>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-bold ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'} truncate">${track.title || 'Untitled'}</p>
                            <p class="text-[10px] text-gray-500 dark:text-zinc-500 truncate mt-0.5 font-bold uppercase tracking-wider">${track.genres || 'Unknown Genre'}</p>
                        </div>
                    </div>
                    <div class="col-span-3 md:col-span-2 hidden sm:block">
                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
                            ${track.category || 'Audio'}
                        </span>
                    </div>
                    <div class="col-span-2 md:col-span-2 flex items-center justify-end gap-3">
                        <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            ${loggedIn ? `
                                <button class="add-to-playlist-btn p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-purple-500 transition-all cursor-pointer" title="Add to Playlist" data-id="${track.id}">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.plus}</svg>
                                </button>
                                <a href="/edit/${track.id}" data-link class="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-orange-500 transition-all cursor-pointer" title="Edit">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.edit}</svg>
                                </a>
                            ` : ''}
                        </div>
                        <span class="text-[11px] font-black text-gray-400 dark:text-zinc-500 font-mono">${track.duration_sec ? formatDuration(track.duration_sec) : '--:--'}</span>
                    </div>
                </div>
                `;
            }).join('');

            // Events
            container.querySelectorAll('.track-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    if (e.target.closest('button') || e.target.closest('a')) return;
                    const idx = parseInt(row.dataset.index);
                    playPlaylist(tracks, idx);
                });
            });

            container.querySelectorAll('.add-to-playlist-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const mediaId = parseInt(btn.dataset.id);
                    showAddToPlaylistModal(mediaId);
                });
            });
        };

        const loadMusic = async (reset = false) => {
            if (reset) { offset = 0; musicItems = []; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'audio', limit, offset });
            if (res?.success) {
                const items = res.data?.items || [];
                musicItems = reset ? items : [...musicItems, ...items];
                renderTrackList(musicItems);

                const total = res.data?.total_count || 0;
                document.getElementById('music-load-more').classList.toggle('hidden', musicItems.length >= total);
            }
        };

        const loadPlaylists = async () => {
            const res = await get(CONFIG.ENDPOINTS.PLAYLIST_LIST);
            const container = document.getElementById('playlist-list');
            const countEl = document.getElementById('playlist-count');
            if (res?.success) {
                const playlists = res.data || [];
                countEl.textContent = playlists.length;
                if (playlists.length === 0) {
                    container.innerHTML = `<p class="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center py-8 opacity-50">No playlists</p>`;
                } else {
                    container.innerHTML = playlists.map(pl => `
                        <a href="/playlist/${pl.id}" data-link class="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-black/5 transition-all group">
                            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                                <svg class="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.playlist}</svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${pl.name}</p>
                                <p class="text-[9px] text-gray-400 font-black uppercase tracking-tight">${pl.item_count || 0} tracks</p>
                            </div>
                        </a>
                    `).join('');
                }
            }
        };

        // Actions
        document.getElementById('music-play-all')?.addEventListener('click', () => {
            if (musicItems.length > 0) playPlaylist(musicItems, 0);
        });

        document.getElementById('music-search')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const q = e.target.value.trim();
                if (!q) { loadMusic(true); return; }
                const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q, limit: 50 });
                if (res?.success) {
                    const items = (res.data?.items || []).filter(i => i.mime_type?.startsWith('audio/') || i.type === 'audio');
                    renderTrackList(items);
                    document.getElementById('music-load-more').classList.add('hidden');
                }
            }, 400);
        });

        document.getElementById('music-load-more-btn')?.addEventListener('click', () => {
            offset += limit;
            loadMusic(false);
        });

        document.getElementById('music-create-playlist-btn')?.addEventListener('click', () => {
             // ... existing playlist creation logic ...
             openModal('Create Playlist', `
                <form id="create-playlist-form" class="space-y-6">
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-[0.2em]">Playlist Name</label>
                        <input type="text" name="name" required class="w-full bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-bold outline-none transition" placeholder="New Wave Vibes">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-[0.2em]">Story / Context</label>
                        <input type="text" name="description" class="w-full bg-gray-50 dark:bg-zinc-800 border border-transparent focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-bold outline-none transition" placeholder="Optional">
                    </div>
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="is_public" class="w-5 h-5 rounded-lg accent-purple-600 transition-all">
                        <span class="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-500 group-hover:text-purple-500">Public Playlist</span>
                    </label>
                    <button type="submit" class="w-full bg-purple-600 text-white font-black py-4 rounded-xl hover:bg-purple-700 transition shadow-xl text-xs uppercase tracking-[0.2em]">Establish Playlist</button>
                </form>
            `);
            setTimeout(() => {
                document.getElementById('create-playlist-form')?.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const fd = new FormData(e.target);
                    const res = await post(CONFIG.ENDPOINTS.PLAYLIST_CREATE, {
                        name: fd.get('name'),
                        description: fd.get('description'),
                        is_public: !!fd.get('is_public'),
                    });
                    if (res?.success) {
                        showToast('Playlist created!', 'success');
                        closeModal();
                        loadPlaylists();
                    } else {
                        showToast(res?.error || 'Failed to create playlist', 'error');
                    }
                });
            }, 100);
        });

        document.getElementById('music-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => loadMusic(true));
        });

        await Promise.all([loadMusic(true), loadPlaylists()]);

        if (window._musicTrackHandler) window.removeEventListener('trackchanged', window._musicTrackHandler);
        window._musicTrackHandler = () => renderTrackList(musicItems);
        window.addEventListener('trackchanged', window._musicTrackHandler);

        const showAddToPlaylistModal = async (mediaId) => {
            const res = await get(CONFIG.ENDPOINTS.PLAYLIST_LIST);
            if (!res?.success) return;
            const playlists = res.data || [];
            if (playlists.length === 0) {
                showToast('Create a playlist first.', 'warning');
                return;
            }

            openModal('Add to Playlist', `
                <div class="space-y-6">
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Playlist</p>
                    <div class="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                        ${playlists.map(pl => `
                            <button class="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all text-left group playlist-choice-btn cursor-pointer" data-playlist-id="${pl.id}">
                                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors">
                                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.music}</svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-black text-gray-900 dark:text-white truncate">${pl.name}</p>
                                    <p class="text-[9px] text-gray-500 uppercase tracking-widest font-black">${pl.item_count || 0} items in queue</p>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `);

            document.querySelectorAll('.playlist-choice-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const plId = btn.dataset.playlistId;
                    const addRes = await post(`${CONFIG.ENDPOINTS.PLAYLIST}/${plId}/add`, { media_id: mediaId });
                    if (addRes?.success) {
                        showToast('Added to playlist!', 'success');
                        closeModal();
                        loadPlaylists();
                    } else {
                        showToast(addRes?.error || 'Failed to add', 'error');
                    }
                });
            });
        };
    };

    return { html, init };
};
