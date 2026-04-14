import { Header } from './view/components/Header.js';
import { Footer } from './view/components/Footer.js';
import { AudioPlayerBar } from './view/components/AudioPlayer.js';
import { Home } from './view/Home.js';
import { AuthView } from './view/pages/Auth.js';
import { PageNotFound } from './view/pages/404.js';
import { Movies } from './view/pages/Movies.js';
import { Music } from './view/pages/Music.js';
import { Photos } from './view/pages/Photos.js';
import { Documents } from './view/pages/Documents.js';
import { Player } from './view/pages/Player.js';
import { Playlist } from './view/pages/Playlist.js';
import { Videos } from './view/pages/Videos.js';
import { Profile } from './view/pages/Profile.js';
import { EditMedia } from './view/pages/EditMedia.js';
import { initTheme } from './src/utils/theme.js';
import { isLoggedIn } from './src/utils/auth.js';
import { post, get } from './src/global/api.js';
import { CONFIG } from './src/global/config.js';
import { showToast } from './view/components/Toast.js';

export const App = {
    async init() {
        initTheme();
        
        // Render Persistent Components
        this.renderComponent('header-container', Header());
        this.renderComponent('footer-container', Footer());
        this.renderComponent('audio-player-container', AudioPlayerBar());
        
        this.handleNavigation();
        this.router();

        // Start polling if there are active transcode jobs
        this.startTranscodePolling();

        window.addEventListener('popstate', () => this.router());
    },

    // Helper to handle the Inject -> Init cycle
    renderComponent(containerId, component) {
        const container = document.getElementById(containerId);
        if (!container || !component) return;

        if (typeof component === 'string') {
            container.innerHTML = component;
        } else {
            container.innerHTML = component.html;
            if (component.init) component.init();
        }
    },

    router() {
        const path = window.location.pathname;
        const loggedIn = isLoggedIn();

        // Cleanup: pause any playing DOM video/audio elements to prevent ghost playback when detached
        document.querySelectorAll('video').forEach(media => media.pause());

        // Define private routes
        const privateRoutes = ['/movies', '/music', '/videos', '/photos', '/docs', '/profile', '/player/', '/playlist/', '/edit/'];
        const isPrivate = privateRoutes.some(route => path.startsWith(route));

        if (isPrivate && !loggedIn) {
            window.history.pushState({}, "", "/login");
            this.router();
            return;
        }

        // Static routes
        const routes = {
            '/': () => Home(),
            '/login': () => AuthView('login'),
            '/signup': () => AuthView('register'),
            '/movies': () => Movies(),
            '/music': () => Music(),
            '/videos': () => Videos(),
            '/photos': () => Photos(),
            '/docs': () => Documents(),
            '/profile': () => Profile(),
        };

        // Check static routes first
        if (routes[path]) {
            const component = routes[path]();
            this.renderComponent('root', component);
            window.scrollTo(0, 0);
            return;
        }

        // Dynamic routes (pattern matching)
        const playerMatch = path.match(/^\/player\/(\d+)$/);
        if (playerMatch) {
            const mediaId = playerMatch[1];
            const component = Player(mediaId);
            this.renderComponent('root', component);
            window.scrollTo(0, 0);
            return;
        }

        const playlistMatch = path.match(/^\/playlist\/(\d+)$/);
        if (playlistMatch) {
            const playlistId = playlistMatch[1];
            const component = Playlist(playlistId);
            this.renderComponent('root', component);
            window.scrollTo(0, 0);
            return;
        }

        const editMatch = path.match(/^\/edit\/(\d+)$/);
        if (editMatch) {
            const mediaId = editMatch[1];
            const component = EditMedia(mediaId);
            this.renderComponent('root', component);
            window.scrollTo(0, 0);
            return;
        }

        // 404 fallback
        const component = PageNotFound();
        this.renderComponent('root', component);
        window.scrollTo(0, 0);
    },

    handleNavigation() {
        document.addEventListener('click', async (e) => {
            const transcodeBtn = e.target.closest('.transcode-grid-btn, #transcode-btn');
            if (transcodeBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const mediaId = transcodeBtn.getAttribute('data-media-id');
                const originalText = transcodeBtn.textContent;
                
                transcodeBtn.disabled = true;
                transcodeBtn.innerText = 'Starting...';
                transcodeBtn.classList.add('opacity-70', 'pointer-events-none');
                
                const res = await post(`${CONFIG.ENDPOINTS.MEDIA_TRANSCODE}/${mediaId}`);
                if (!res?.success) {
                    showToast(res?.error || 'Failed to start transcoding', 'error');
                    transcodeBtn.disabled = false;
                    transcodeBtn.classList.remove('opacity-70', 'pointer-events-none');
                    transcodeBtn.innerText = 'Convert to HLS';
                    return;
                }
                
                showToast('Transcoding started in background', 'info');
                transcodeBtn.innerText = 'Transcoding...';
                transcodeBtn.classList.add('animate-pulse');
                
                // Trigger polling immediately
                this.startTranscodePolling();
                
                return;
            }

            const anchor = e.target.closest('a[data-link]');
            if (anchor) {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (href) {
                    // Always update history and run router, even if same path 
                    // (useful for re-initializing components upon "Sign In" clicks)
                    if (href !== window.location.pathname) {
                        window.history.pushState({}, "", href);
                    }
                    this.router();
                }
            }
        });
    },

    /** Re-render the header (e.g., after login/logout to update user state) */
    refreshHeader() {
        this.renderComponent('header-container', Header());
    },

    startTranscodePolling() {
        if (this.transcodePollingInterval) return;

        const poll = async () => {
            const res = await get(CONFIG.ENDPOINTS.TRANSCODE_STATUS);
            if (res?.success && res.data) {
                const jobs = res.data.job_progress || {};
                const activeIds = Object.keys(jobs);

                if (activeIds.length === 0) {
                    clearInterval(this.transcodePollingInterval);
                    this.transcodePollingInterval = null;
                    
                    const anyVisible = document.querySelector('[id^="transcode-status-"]:not(.opacity-0)');
                    if (anyVisible) {
                        this.router();
                    }
                    return;
                }

                this.updateTranscodeUI(jobs);
            }
        };

        // Execute immediately then start interval
        poll();
        this.transcodePollingInterval = setInterval(poll, 2000);
    },

    updateTranscodeUI(jobs) {
        // Update all instances of active jobs
        Object.entries(jobs).forEach(([mediaId, progress]) => {
            const roundedProgress = Math.round(progress);

            // 1. Update Progress Bars
            const barContainers = document.querySelectorAll(`.transcode-status-container[data-media-id="${mediaId}"]`);
            barContainers.forEach(container => {
                container.classList.remove('opacity-0', 'pointer-events-none');
                container.classList.add('opacity-100');
                const bar = container.querySelector('.progress-bar');
                if (bar) bar.style.width = `${progress}%`;
            });

            // 2. Update Badge Labels & Hide Trigger Buttons
            const badgeContainers = document.querySelectorAll(`.transcode-badge-container[data-media-id="${mediaId}"]`);
            badgeContainers.forEach(container => {
                container.classList.remove('opacity-0', 'pointer-events-none');
                container.classList.add('opacity-100');
                const percentLabel = container.querySelector('.progress-percent');
                if (percentLabel) percentLabel.textContent = `${roundedProgress}%`;
            });

            // Hide/Disable the actual trigger button to prevent overlapping and duplicate triggers
            const triggerBtns = document.querySelectorAll(`.transcode-btn-${mediaId}, .transcode-grid-btn[data-media-id="${mediaId}"], #transcode-btn`);
            triggerBtns.forEach(btn => {
                if (btn.id === 'transcode-btn') {
                    btn.disabled = true;
                    btn.textContent = 'Transcoding...';
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    btn.classList.add('hidden');
                }
            });
        });

        // Restore UI when jobs complete
        document.querySelectorAll('.transcode-status-container, .transcode-badge-container').forEach(el => {
            if (el.classList.contains('opacity-0')) return;
            const id = el.getAttribute('data-media-id');
            if (!jobs[id]) {
                el.classList.add('opacity-0', 'pointer-events-none');
                
                // Show/Enable the trigger buttons again
                const triggerBtns = document.querySelectorAll(`.transcode-btn-${id}, .transcode-grid-btn[data-media-id="${id}"], #transcode-btn`);
                triggerBtns.forEach(btn => {
                    if (btn.id === 'transcode-btn') {
                        btn.disabled = false;
                        btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg> Convert to HLS';
                        btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                        btn.classList.remove('hidden');
                    }
                });
                
                // If this item was just finished and we are on its edit page, refresh to show HLS badge
                const currentIdFromUrl = window.location.pathname.split('/').pop();
                if (currentIdFromUrl === id && window.location.pathname.includes('/edit/')) {
                     setTimeout(() => this.router(), 1500);
                }
            }
        });
    }
};

App.init();