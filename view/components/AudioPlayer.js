import { CONFIG } from '../../src/global/config.js';
import { formatTime } from '../../src/utils/format.js';

/**
 * Premium Floating Audio Player.
 * Reworked from scratch for an amazing sleek user experience.
 */

// Global audio state
let _audio = null;
let _currentTrack = null;
let _playlist = [];
let _playlistIndex = -1;
let _isPlaying = false;

/** Get or create the audio element */
const getAudio = () => {
    if (!_audio) {
        _audio = new Audio();
        _audio.preload = 'metadata';
        
        // Native event synchronizations ensure UI perfectly matches actual HTML5 audio state
        _audio.addEventListener('play', () => {
            _isPlaying = true;
            updatePlayerUI();
            window.dispatchEvent(new CustomEvent('playstatechanged', { detail: { isPlaying: true } }));
        });
        
        _audio.addEventListener('pause', () => {
            _isPlaying = false;
            updatePlayerUI();
            window.dispatchEvent(new CustomEvent('playstatechanged', { detail: { isPlaying: false } }));
        });

        _audio.addEventListener('ended', () => {
            if (_playlistIndex >= 0 && _playlistIndex < _playlist.length - 1) {
                playTrackAtIndex(_playlistIndex + 1);
            }
        });
        _audio.addEventListener('timeupdate', updateProgress);
        _audio.addEventListener('loadedmetadata', updateProgress);
        
        // Retrieve saved volume
        const savedVol = localStorage.getItem('player_volume');
        if (savedVol !== null) _audio.volume = parseFloat(savedVol);
        else _audio.volume = 0.8;
    }
    return _audio;
};

/** Play a single track */
export const playTrack = (media) => {
    _currentTrack = media;
    _playlist = [media];
    _playlistIndex = 0;
    startPlayback(media);
};

/** Play a track from a playlist */
export const playPlaylist = (playlist, startIndex = 0) => {
    _playlist = playlist;
    _playlistIndex = startIndex;
    _currentTrack = playlist[startIndex];
    startPlayback(_currentTrack);
};

const playTrackAtIndex = (index) => {
    if (index < 0 || index >= _playlist.length) return;
    _playlistIndex = index;
    _currentTrack = _playlist[index];
    startPlayback(_currentTrack);
};

const startPlayback = (media) => {
    const audio = getAudio();
    const token = localStorage.getItem('token');
    
    // Force reset for new track
    audio.pause();
    audio.src = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${media.id}${token ? `?token=${token}` : ''}`;
    audio.load(); // Resets the media element for the new source

    document.querySelectorAll('video').forEach(v => v.pause());
    
    // Explicit UI update before play fires
    updatePlayerUI();

    // Dispatch custom track info tracking
    window.dispatchEvent(new CustomEvent('trackchanged', { detail: media }));

    audio.play().catch(err => {
        console.warn('Autoplay blocked or playback failed. Waiting for user interaction...', err);
        _isPlaying = false;
        updatePlayerUI();
        
        // Add a "tap to play" pulse effect to the play button
        const playBtn = document.getElementById('audio-play-btn');
        if (playBtn) {
            playBtn.classList.add('animate-pulse', 'ring-4', 'ring-purple-500/50');
            const clickHandler = () => {
                audio.play();
                playBtn.classList.remove('animate-pulse', 'ring-4', 'ring-purple-500/50');
                playBtn.removeEventListener('click', clickHandler);
            };
            playBtn.addEventListener('click', clickHandler);
        }
    });

    showPlayer();
};

/** Toggle play/pause */
export const togglePlayback = () => {
    const audio = getAudio();
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.play();
        document.querySelectorAll('video').forEach(v => v.pause());
    }
};

/** Forcefully pause audio dock */
export const pauseAudioDock = () => {
    const audio = getAudio();
    if (!audio.paused) {
        audio.pause();
    }
};

/** Skip to next track */
export const nextTrack = () => {
    if (_playlistIndex < _playlist.length - 1) {
        // Subtle bump animation for next
        document.getElementById('audio-forward-icon')?.animate([
            { transform: 'translateX(0px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0px)' }
        ], { duration: 200, easing: 'ease-out' });
        playTrackAtIndex(_playlistIndex + 1);
    }
};

/** Skip to previous track */
export const prevTrack = () => {
    const audio = getAudio();
    document.getElementById('audio-back-icon')?.animate([
        { transform: 'translateX(0px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0px)' }
    ], { duration: 200, easing: 'ease-out' });
    
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else if (_playlistIndex > 0) {
        playTrackAtIndex(_playlistIndex - 1);
    }
};

/** Seek to a position */
export const seekTo = (percent) => {
    const audio = getAudio();
    if (audio.duration) {
        audio.currentTime = (percent / 100) * audio.duration;
    }
};

/** Set volume 0-1 */
export const setVolume = (vol) => {
    const audio = getAudio();
    audio.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('player_volume', audio.volume.toString());
};

export const getCurrentTrack = () => _currentTrack;
export const isPlaying = () => _isPlaying;

/** Render the elegant floating player bar HTML */
export const AudioPlayerBar = () => {
    return {
        html: `
        <div id="audio-player-wrapper" class="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[98%] sm:w-[90%] max-w-4xl z-50 transform translate-y-[150%] opacity-0 scale-95 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            
            <div class="relative rounded-[2.5rem] overflow-visible group/player shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
                
                <!-- Floating Art that pops out slightly -->
                <div id="audio-floating-art" class="absolute -top-4 -left-2 sm:left-2 w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex items-center justify-center transform transition-transform duration-500 z-10 hidden sm:flex border border-white/20">
                    <svg class="w-8 h-8 text-white shadow-sm" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                    </svg>
                </div>

                <!-- Inner clip wrapper for backgrounds and progress bar -->
                <div class="relative bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-[2.5rem] overflow-hidden">
                
                    <!-- Inner soft gradient glow -->
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none"></div>



                <div class="flex items-center h-[4.5rem] px-3 sm:px-6 sm:pl-28 relative z-20 gap-3">
                    
                    <!-- Track Details -->
                    <div class="flex-1 min-w-0 pr-4">
                        <h4 id="audio-track-title" class="text-sm font-extrabold text-gray-900 dark:text-white truncate tracking-tight">Loading...</h4>
                        <p id="audio-track-info" class="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate uppercase tracking-widest mt-0.5">—</p>
                    </div>

                    <!-- Main Controls -->
                    <div class="flex items-center gap-1 sm:gap-2">
                        <button id="audio-prev-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-95">
                            <svg id="audio-back-icon" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                        </button>
                        
                        <button id="audio-play-btn" class="relative group w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg hover:shadow-purple-500/25 transition-all outline-none active:scale-90 overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg id="audio-play-icon" class="w-5 h-5 fill-current relative z-10 ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                        
                        <button id="audio-next-btn" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors active:scale-95">
                            <svg id="audio-forward-icon" class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                        </button>
                    </div>

                    <!-- Time & Additional Controls -->
                    <div class="hidden md:flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-white/10 ml-2">
                        <span id="audio-time" class="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 w-24 text-center tracking-tighter">0:00 / 0:00</span>
                        
                        <div class="flex items-center gap-2 group/vol relative cursor-pointer">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/vol:text-gray-900 dark:group-hover/vol:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 9v6" />
                            </svg>
                            <!-- Mini Volume Slider -->
                            <div class="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 ease-out flex items-center">
                                <input id="audio-volume" type="range" min="0" max="100" value="80" class="w-full h-1.5 bg-gray-200 dark:bg-white/20 rounded-full appearance-none accent-purple-500 cursor-pointer">
                            </div>
                        </div>
                    </div>

                    <!-- Close Button -->
                    <button id="audio-close-btn" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/80 dark:hover:bg-white/20 transition-colors active:scale-90 ml-1 sm:ml-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Sleek Floating Progress Bar -->
                <div class="px-5 sm:px-8 pb-4 relative z-30">
                    <div id="audio-seek-wrap" class="w-full relative h-1.5 sm:h-2 bg-gray-200 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden shadow-inner">
                        <div id="audio-seek-bg" class="absolute inset-0 bg-gray-300 dark:bg-white/20 origin-left scale-x-0 transition-transform pointer-events-none"></div>
                        <div id="audio-seek-bar" class="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-75 rounded-full" style="width: 0%"></div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        `,
        init: () => {
            // Setup controls
            document.getElementById('audio-play-btn')?.addEventListener('click', togglePlayback);
            document.getElementById('audio-prev-btn')?.addEventListener('click', prevTrack);
            document.getElementById('audio-next-btn')?.addEventListener('click', nextTrack);

            const volEl = document.getElementById('audio-volume');
            if (volEl && _audio) volEl.value = _audio.volume * 100;
            volEl?.addEventListener('input', (e) => {
                setVolume(e.target.value / 100);
            });

            document.getElementById('audio-seek-wrap')?.addEventListener('click', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                seekTo(percent);
            });

            // Smooth seek hover preview
            const seekWrap = document.getElementById('audio-seek-wrap');
            const seekBg = document.getElementById('audio-seek-bg');
            seekWrap?.addEventListener('mousemove', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                if(seekBg) seekBg.style.transform = `scaleX(${percent})`;
            });
            seekWrap?.addEventListener('mouseleave', () => {
                if(seekBg) seekBg.style.transform = 'scaleX(0)';
            });

            document.getElementById('audio-close-btn')?.addEventListener('click', () => {
                const audio = getAudio();
                audio.pause();
                audio.src = '';
                _currentTrack = null;
                hidePlayer();
            });
        }
    };
};

const showPlayer = () => {
    // Adding slight delay to make the entrance more impactful
    setTimeout(() => {
        const wrapper = document.getElementById('audio-player-wrapper');
        if (wrapper) {
            wrapper.classList.remove('translate-y-[150%]', 'opacity-0', 'scale-95');
            wrapper.classList.add('translate-y-0', 'opacity-100', 'scale-100');
            // Animate floating art bounce
            const art = document.getElementById('audio-floating-art');
            if (art) {
                art.style.transform = 'translateY(-10px) rotate(-3deg) scale(1.05)';
                setTimeout(() => art.style.transform = 'translateY(0) rotate(0) scale(1)', 300);
            }
        }
    }, 50);
};

const hidePlayer = () => {
    const wrapper = document.getElementById('audio-player-wrapper');
    if (wrapper) {
        wrapper.classList.add('translate-y-[150%]', 'opacity-0', 'scale-95');
        wrapper.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
    }
};

const updatePlayerUI = () => {
    const titleEl = document.getElementById('audio-track-title');
    const infoEl = document.getElementById('audio-track-info');
    const playIcon = document.getElementById('audio-play-icon');
    const playBtn = document.getElementById('audio-play-btn');

    if (titleEl && _currentTrack) {
        titleEl.textContent = _currentTrack.title || 'Unknown Track';
        infoEl.textContent = _currentTrack.category || _currentTrack.genres || 'MUSIC';
    }

    if (playIcon) {
        playIcon.innerHTML = _isPlaying
            ? `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`
            : `<path d="M8 5v14l11-7z"/>`;
        
        // Morph button colors
        if (playBtn) {
            if (_isPlaying) {
                playIcon.classList.remove('ml-0.5');
            } else {
                playIcon.classList.add('ml-0.5');
            }
        }
    }
    
    // Add pulsing to artwork when playing
    const art = document.getElementById('audio-floating-art');
    if (art) {
        if (_isPlaying) {
            if (!art.classList.contains('animate-[pulse_3s_ease-in-out_infinite]')) {
                art.classList.add('animate-[pulse_3s_ease-in-out_infinite]');
            }
        } else {
            art.classList.remove('animate-[pulse_3s_ease-in-out_infinite]');
        }
    }
};

const updateProgress = () => {
    const audio = getAudio();
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    const seekBar = document.getElementById('audio-seek-bar');
    const timeEl = document.getElementById('audio-time');

    if (seekBar) seekBar.style.width = `${percent}%`;
    if (timeEl) timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
};
