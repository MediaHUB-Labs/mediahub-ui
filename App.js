
import { Header } from './view/components/Header.js'; 
import { Footer } from './view/components/Footer.js'; 
import { Connection } from './src/connection/Connection.js';

const app = {
    async init() {
        // Render UI
        document.getElementById('header-container').innerHTML = Header();
        document.getElementById('footer-container').innerHTML = Footer();

        // Route Check
        this.router();

        // Listen for URL changes
        window.addEventListener('popstate', () => this.router());

        // Check Server Status
        this.updateServerStatus();
    },

    router() {
        const path = window.location.pathname;
        const main = document.getElementById('main-content');

        // Simple routing logic
        if (path === '/') {
            main.innerHTML = Home();
        } else if (path === '/movies') {
            main.innerHTML = Movies();
        }
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

app.init();