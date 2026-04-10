export const Footer = () => {
    return `
        <footer class="bg-[#111] border-t border-white/5 pt-12 pb-8 mt-12">
            <div class="max-w-7xl mx-auto px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    <div class="col-span-1 md:col-span-2">
                        <h3 class="text-yellow-500 font-bold text-lg mb-4">Media HUB</h3>
                        <p class="text-gray-500 text-sm leading-relaxed">
                            Your personal media library, organized and streamed beautifully. 
                            Built for the ultimate cinema experience at home.
                        </p>
                    </div>

                    <div>
                        <h4 class="text-white font-semibold mb-4">QuickLinks</h4>
                        <ul class="text-gray-500 text-sm space-y-2">
                            <li><a href="/" data-link class="hover:text-yellow-500 transition">Dashboard</a></li>
                            <li><a href="/login" data-link class="hover:text-yellow-500 transition">Login</a></li>
                            <li><a href="/movies" data-link class="hover:text-yellow-500 transition">Movies</a></li>
                            <li><a href="/tv" data-link class="hover:text-yellow-500 transition">TV Shows</a></li>
                            <li><a href="/music" data-link class="hover:text-yellow-500 transition">Music</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-semibold mb-4">Server Status</h4>
                        <div class="flex items-center gap-2 mb-2">
                            <span id="server-status-indicator" class="w-2 h-2 bg-gray-500 rounded-full"></span>
                            <span id="server-status-text" class="text-sm text-gray-400">Checking...</span>
                        </div>
                    </div>
                </div>

                <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-gray-600 text-xs">
                        &copy; ${new Date().getFullYear()} Media Hub. All rights reserved.
                    </p>
                    <div class="flex gap-6">
                        <a href="https://github.com/MediaHUB-Labs" class="text-gray-600 hover:text-white transition"><span class="sr-only">GitHub</span><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    </div>
                </div>
            </div>
        </footer>
    `;
};

{/* <div>
    <h4 class="text-white font-semibold mb-4">Support</h4>
    <ul class="text-gray-500 text-sm space-y-2">
        <li><a href="#" class="hover:text-yellow-500 transition">Documentation</a></li>
        <li><a href="#" class="hover:text-yellow-500 transition">API Reference</a></li>
        <li><a href="#" class="hover:text-yellow-500 transition">Settings</a></li>
    </ul>
</div> */}