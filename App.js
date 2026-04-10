import { Header } from './view/components/Header.js';
import { Footer } from './view/components/Footer.js';
import { Home } from './view/Home.js';
import { AuthView } from './view/pages/Auth.js';
import { PageNotFound } from './view/pages/404.js';
import { initTheme, toggleTheme } from './src/utils/theme.js';

export const App = {
    async init() {
        initTheme();
        
        // Render Persistent Components
        this.renderComponent('header-container', Header());
        this.renderComponent('footer-container', Footer());
        
        this.handleNavigation();
        this.bindTheme();
        this.router();

        window.addEventListener('popstate', () => this.router());
    },

    // Helper to handle the Inject -> Init cycle
    renderComponent(containerId, component) {
        const container = document.getElementById(containerId);
        if (!container || !component) return;

        container.innerHTML = component.html;
        if (component.init) component.init();
    },

    router() {
        const path = window.location.pathname;
        const routes = {
            '/': () => Home(),
            '/login': () => AuthView('login'),
            '/signup': () => AuthView('register'),
            '/movies': () => ({ html: '<h1>Movies</h1>', init: () => {} }),
        };

        const componentFunc = routes[path] || PageNotFound;
        const component = componentFunc();

        this.renderComponent('root', component);
        window.scrollTo(0, 0);
    },

    handleNavigation() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[data-link]');
            if (anchor) {
                e.preventDefault();
                window.history.pushState({}, "", anchor.getAttribute('href'));
                this.router();
            }
        });
    },

    bindTheme() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) toggleTheme();
        });
    }
};

App.init();