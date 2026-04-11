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

export const Music = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span class="text-purple-500">🎵</span> Music
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Your music library & playlists</p>
                </div>
                ${loggedIn ? `
                <div class="flex gap-3">
                    <button id="music-create-playlist-btn" class="flex items-center gap-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-bold text-sm border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" d="M12 4v16m8-8H4" />
                        </svg>
                        New Playlist
                    </button>
                    <button id="music-upload-btn" class="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-500 transition-all shadow-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                    </button>
                </div>
                ` : ''}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Sidebar: Playlists -->
                <div class="lg:col-span-1">
                    <div class="bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200 dark:border-white/5 p-4">
                        <h3 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Your Playlists</h3>
                        <div id="playlist-list" class="space-y-2">
                            <div class="animate-pulse space-y-2">
                                <div class="h-10 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                                <div class="h-10 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main: Music Library -->
                <div class="lg:col-span-3">
                    <!-- Search -->
                    <div class="relative mb-5">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" id="music-search" placeholder="Search music..."
                            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500">
                    </div>

                    <!-- Track List -->
                    <div id="music-tracks" class="space-y-1">
                        ${TrackListSkeleton(10)}
                    </div>

                    <div id="music-load-more" class="hidden text-center py-6">
                        <button id="music-load-more-btn" class="px-8 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition">
                            Load More
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

        // ─── Track List Renderer ───
        const renderTrackList = (tracks) => {
            const container = document.getElementById('music-tracks');
            const currentTrack = getCurrentTrack();

            if (!tracks || tracks.length === 0) {
                container.innerHTML = MediaGridEmpty('No music found', 'music');
                return;
            }

            container.innerHTML = tracks.map((track, idx) => {
                const isActive = currentTrack && currentTrack.id === track.id;
                return `
                <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group cursor-pointer track-row ${isActive ? 'bg-purple-100/50 dark:bg-purple-500/10 ring-1 ring-purple-500/20' : ''}" data-id="${track.id}" data-index="${idx}">
                    <span class="text-xs ${isActive ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-400'} w-6 text-right font-mono">
                        ${isActive ? '▶' : idx + 1}
                    </span>
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                        <svg class="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        <svg class="w-4 h-4 text-white/60 group-hover:opacity-0 absolute transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'} truncate">${track.title || 'Untitled'}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${track.category || ''} ${track.genres ? '• ' + track.genres : ''}</p>
                    </div>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                        ${loggedIn ? `
                            <button class="add-to-playlist-btn p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-purple-500 transition" title="Add to Playlist" data-id="${track.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                            </button>
                            <button class="delete-music-btn p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition" title="Delete" data-id="${track.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        ` : ''}
                    </div>
                    <span class="text-xs text-gray-400 font-mono">${track.duration_sec ? formatDuration(track.duration_sec) : '--'}</span>
                </div>
            `;
            }).join('');

            // Play on click (if not clicking an action button)
            container.querySelectorAll('.track-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    if (e.target.closest('button')) return;
                    const idx = parseInt(row.dataset.index);
                    playPlaylist(tracks, idx);
                });
            });

            // Add to Playlist
            container.querySelectorAll('.add-to-playlist-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const mediaId = parseInt(btn.dataset.id);
                    showAddToPlaylistModal(mediaId);
                });
            });

            // Delete Music
            container.querySelectorAll('.delete-music-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this track?')) {
                        const id = parseInt(btn.dataset.id);
                        const res = await del(CONFIG.ENDPOINTS.MEDIA_DELETE, { id });
                        if (res?.success) {
                            showToast('Track deleted', 'success');
                            loadMusic(true);
                        } else {
                            showToast(res?.error || 'Delete failed', 'error');
                        }
                    }
                });
            });
        };

        // ─── Load Music ───
        const loadMusic = async (reset = false) => {
            if (reset) { offset = 0; musicItems = []; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_LIST, { type: 'audio', limit, offset });
            if (res?.success) {
                const items = res.data?.items || [];
                musicItems = reset ? items : [...musicItems, ...items];
                renderTrackList(musicItems);

                const total = res.data?.total_count || 0;
                const loadMoreDiv = document.getElementById('music-load-more');
                loadMoreDiv.classList.toggle('hidden', musicItems.length >= total);
            }
        };

        // ─── Search ───
        document.getElementById('music-search')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const q = e.target.value.trim();
                if (!q) { loadMusic(true); return; }
                const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q, limit: 50 });
                if (res?.success) {
                    const items = (res.data?.items || []).filter(i => i.mime_type?.startsWith('audio/'));
                    renderTrackList(items);
                    document.getElementById('music-load-more').classList.add('hidden');
                }
            }, 400);
        });

        document.getElementById('music-load-more-btn')?.addEventListener('click', () => {
            offset += limit;
            loadMusic(false);
        });

        // ─── Load Playlists ───
        const loadPlaylists = async () => {
            const res = await get(CONFIG.ENDPOINTS.PLAYLIST_LIST);
            const container = document.getElementById('playlist-list');
            if (res?.success) {
                const playlists = res.data || [];
                if (playlists.length === 0) {
                    container.innerHTML = `<p class="text-sm text-gray-400 dark:text-gray-500  text-center py-4">No playlists yet</p>`;
                } else {
                    container.innerHTML = playlists.map(pl => `
                        <a href="/playlist/${pl.id}" data-link class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group">
                            <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M9 19V6l12-3v13" />
                                </svg>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">${pl.name}</p>
                                <p class="text-[11px] text-gray-500">${pl.item_count || 0} tracks</p>
                            </div>
                        </a>
                    `).join('');
                }
            }
        };

        // ─── Create Playlist ───
        document.getElementById('music-create-playlist-btn')?.addEventListener('click', () => {
            openModal('Create Playlist', `
                <form id="create-playlist-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Name</label>
                        <input type="text" name="name" required class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-purple-500 outline-none transition" placeholder="My Playlist">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Description</label>
                        <input type="text" name="description" class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-purple-500 outline-none transition" placeholder="Optional">
                    </div>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_public" class="w-4 h-4 rounded accent-purple-500">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Make playlist public</span>
                    </label>
                    <button type="submit" class="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl hover:bg-purple-500 transition text-sm">Create</button>
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

        // Upload
        document.getElementById('music-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => loadMusic(true));
        });

        // Initial load
        await Promise.all([loadMusic(true), loadPlaylists()]);

        // ─── Post-load event listeners ───
        if (window._musicTrackHandler) window.removeEventListener('trackchanged', window._musicTrackHandler);
        window._musicTrackHandler = () => renderTrackList(musicItems);
        window.addEventListener('trackchanged', window._musicTrackHandler);

        // Sub-renderers/helpers
        const showAddToPlaylistModal = async (mediaId) => {
            const res = await get(CONFIG.ENDPOINTS.PLAYLIST_LIST);
            if (!res?.success) {
                showToast('Failed to load playlists', 'error');
                return;
            }

            const playlists = res.data || [];
            if (playlists.length === 0) {
                showToast('No playlists found. Create one first.', 'warning');
                return;
            }

            openModal('Add to Playlist', `
                <div class="space-y-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Select a playlist to add this track to:</p>
                    <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                        ${playlists.map(pl => `
                            <button class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left group playlist-choice-btn" data-playlist-id="${pl.id}">
                                <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13"/></svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${pl.name}</p>
                                    <p class="text-[10px] text-gray-500 uppercase tracking-wider">${pl.item_count || 0} tracks</p>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `);

            // Selection handler
            document.querySelectorAll('.playlist-choice-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const plId = btn.dataset.playlistId;
                    const addRes = await post(`${CONFIG.ENDPOINTS.PLAYLIST}/${plId}/add`, { media_id: mediaId });
                    if (addRes?.success) {
                        showToast('Added to playlist!', 'success');
                        closeModal();
                        loadPlaylists(); // Update counts
                    } else {
                        showToast(addRes?.error || 'Failed to add', 'error');
                    }
                });
            });
        };
    };

    return { html, init };
};
