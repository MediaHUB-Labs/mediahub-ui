export const Header = () => {
    // 1. Get user data from localStorage
    const userJson = localStorage.getItem('user');
    let user = null;

    if(userJson!==null && userJson!=="undefined"){
        user = JSON.parse(userJson);
    }
    // Helper to get initials (e.g., "John Doe" -> "JD")
    const getInitials = (user) => {
        if (!user) return "??";
        const f = user.first_name ? user.first_name[0] : "";
        const l = user.last_name ? user.last_name[0] : "";
        return (f + l).toUpperCase() || user.email[0].toUpperCase();
    };

    const html = `
        <header class="flex flex-col gap-4 md:flex-row items-center justify-between px-8 py-4 bg-gray-300 dark:bg-[#111] border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div class="flex items-center gap-4">
                <a href="/" data-link class="text-yellow-600 dark:text-yellow-600 font-bold text-2xl cursor-pointer tracking-tight"> 
                    Media<span class="text-gray-900 dark:text-white">HUB</span> 
                </a>
                
                <button id="theme-toggle" class="rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all group border border-gray-200 dark:border-white/10 shadow-md p-2">
                    <svg class="block dark:hidden w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                    </svg>

                    <svg class="hidden dark:block w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            </div>

            <div class="flex flex-1 justify-end items-center gap-6 w-full md:w-auto">
                <div class="relative w-full max-w-sm group">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" 
                        class="w-full py-2 pl-10 pr-4 bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 transition-all" 
                        placeholder="Search metadata...">
                </div>
                
                <div class="flex items-center gap-4">
                    ${user ? `
                        <div class="flex flex-row justify-center items-center gap-3 pl-4 border-l border-gray-400/20">
                            <div class="hidden lg:block text-right">
                                <p class="text-[12px] font-bold uppercase tracking-widest text-gray-900 dark:text-white">${user.first_name} ${user.last_name}</p>
                            </div>
                            
                            <a href="/dashboard" data-link class="w-9 h-9 rounded-full bg-orange-600 dark:bg-yellow-500 flex items-center justify-center font-bold text-white dark:text-black text-xs shadow-lg hover:scale-105 transition-transform">
                                ${getInitials(user)}
                            </a>

                            <button id="logout-btn" class="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Log Out">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </button>
                        </div>
                    ` : `
                        <a href="/login" data-link class="text-xs font-bold uppercase tracking-widest px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-orange-600 dark:hover:bg-yellow-500 dark:hover:text-black transition-all">
                            Sign In
                        </a>
                    `}
                </div>
            </div>
        </header>
    `;
    const init = () => {
        const btn = document.getElementById('logout-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = '/login';
            });
        }
    };

    return { html, init };
};
