
import { Header } from './view/components/Header.js'; 
import { Footer } from './view/components/Footer.js'; 
import { Connection } from './src/connection/Connection.js';
import { Home } from './view/Home.js';
import { AuthView } from './view/pages/Auth.js';


export const App = {
    async init() {
        // Render UI
        document.getElementById('header-container').innerHTML = Header();
        document.getElementById('footer-container').innerHTML = Footer();

        this.handleNavigation();
        
        // Route Check
        this.router();

        // Listen for URL changes
        window.addEventListener('popstate', () => this.router());

        // Update the listener
        window.addEventListener('hashchange', () => this.router());
        window.addEventListener('load', () => this.router());

        // Check Server Status
        this.updateServerStatus();
    },

    router() {
        const path = window.location.pathname;
        const main = document.getElementById('root');

        // 1. Define your "Dictionary" of routes
        const routes = {
            '/': () => main.innerHTML = Home(),
            '/login': () => AuthView('login'),
            '/signup': () => AuthView('register'),
            '/movies': () => { main.innerHTML = '<h1>Movies</h1>'; }, // Placeholder
            '/settings': () => { main.innerHTML = '<h1>Settings</h1>'; }
        };

        // 2. Clear the stage
        main.innerHTML = '';

        // 3. Find the function for the current path, or default to Home
        const renderPage = routes[path] || routes['/'];

        // 4. Execute the function
        renderPage();
    },

    handleNavigation() {
        // Intercept all clicks on the document
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[data-link]');
            if (anchor) {
                e.preventDefault();
                const url = anchor.getAttribute('href');
                window.history.pushState({}, "", url);
                this.router();
            }
        });
    },
    
    async updateServerStatus() {
        const statusElement = document.querySelector('#server-status-indicator');
        const textElement = document.querySelector('#server-status-text');

        if (!statusElement) return;

        const status = await Connection();

        // Update the UI dynamically
        statusElement.className = `w-2 h-2 rounded-full animate-pulse ${status.color}`;
        textElement.innerText = `Local Server: ${status.status}`;
    }
};

App.init();