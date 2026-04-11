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
import { initTheme } from './src/utils/theme.js';
import { isLoggedIn } from './src/utils/auth.js';

export const App = {
    async init() {
        initTheme();
        
        // Render Persistent Components
        this.renderComponent('header-container', Header());
        this.renderComponent('footer-container', Footer());
        this.renderComponent('audio-player-container', AudioPlayerBar());
        
        this.handleNavigation();
        this.router();

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
        const privateRoutes = ['/movies', '/music', '/videos', '/photos', '/docs', '/profile', '/player/', '/playlist/'];
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

        // 404 fallback
        const component = PageNotFound();
        this.renderComponent('root', component);
        window.scrollTo(0, 0);
    },

    handleNavigation() {
        document.addEventListener('click', (e) => {
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
    }
};

App.init();