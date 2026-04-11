import { Connection } from '../../src/connection/Connection.js';

export const Footer = () => {
    const html = `
        <footer class="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pt-16 pb-12 mt-20 relative z-10 transition-colors duration-300">
            <div class="px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    
                    <!-- Branding & Mission -->
                    <div class="md:col-span-12 lg:col-span-5">
                        <a href="/" data-link class="text-yellow-600 dark:text-yellow-500 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity mb-6 inline-block"> 
                            Media<span class="text-gray-900 dark:text-white">HUB</span> 
                        </a>
                        <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                            Your personal media library, organized and streamed beautifully. 
                            Built for the ultimate cinema experience at home. Private Cloud Infrastructure.
                        </p>
                    </div>

                    <!-- Library Links -->
                    <div class="md:col-span-4 lg:col-span-2">
                        <h4 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Library</h4>
                        <ul class="text-gray-500 dark:text-gray-400 text-sm space-y-3">
                            <li><a href="/movies" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors flex items-center gap-2">🎬 Movies</a></li>
                            <li><a href="/music" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors flex items-center gap-2">🎵 Music</a></li>
                            <li><a href="/videos" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors flex items-center gap-2">📹 Videos</a></li>
                            <li><a href="/photos" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors flex items-center gap-2">📸 Photos</a></li>
                        </ul>
                    </div>

                    <!-- Account Links -->
                    <div class="md:col-span-4 lg:col-span-2">
                        <h4 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">Account</h4>
                        <ul class="text-gray-500 dark:text-gray-400 text-sm space-y-3">
                            <li><a href="/profile" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors">Your Profile</a></li>
                            <li><a href="/docs" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors">Documents</a></li>
                            <li><a href="/login" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors">Sign In</a></li>
                            <li><a href="/signup" data-link class="hover:text-orange-600 dark:hover:text-yellow-500 transition-colors">Create Account</a></li>
                        </ul>
                    </div>

                    <!-- System Status -->
                    <div class="md:col-span-4 lg:col-span-3">
                        <h4 class="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">System Status</h4>
                        <div class="inline-flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm">
                            <span id="server-status-indicator" class="w-2.5 h-2.5 bg-gray-400 rounded-full transition-colors duration-500"></span>
                            <span id="server-status-text" class="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Checking Hub...</span>
                        </div>
                    </div>
                </div>

                <!-- Bottom Bar -->
                <div class="border-t border-gray-200 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div class="text-center md:text-left">
                        <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            &copy; ${new Date().getFullYear()} MediaHUB Labs. All rights reserved.
                        </p>
                        <div class="mt-2 text-center md:text-left">
                            <span class="text-xs text-gray-500 md:inline-block">Made with <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 font-black tracking-wider">ANTIGRAVITY</span></span>
                            <span class="hidden md:inline mx-2 text-gray-300 dark:text-gray-700">|</span>
                            <a href="/LICENSE" target="_blank" class="text-xs text-gray-500 hover:text-orange-600 dark:hover:text-yellow-500 transition-all">MIT License</a>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-8">
                        <a href="https://github.com/MediaHUB-Labs" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <span class="sr-only">GitHub</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    `;
    const init = async () => {
        const serverStatusIndicator = document.getElementById('server-status-indicator');
        const serverStatusText = document.getElementById('server-status-text');

        const status = await Connection();

        if (serverStatusIndicator && serverStatusText) {
            serverStatusIndicator.className = `w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] animate-pulse ${status.color}`;
            serverStatusText.innerText = `HUB: ${status.status}`;
        }
    }
    return { html, init };
};