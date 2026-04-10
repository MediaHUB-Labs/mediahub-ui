export const PageNotFound = () => {
    const html = `
        <div class="flex flex-col items-center justify-center h-screen px-6 text-center">
            <div class="relative">
                <h1 class="text-9xl font-black text-gray-100 dark:text-white/5 select-none">404</h1>
                <div class="absolute inset-0 flex items-center justify-center">
                    <svg class="w-20 h-20 text-orange-600 dark:text-yellow-500 animate-pulse" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        <path stroke-linecap="round" d="M10 8v4m0 0v.01M10 12h.01"></path>
                    </svg>
                </div>
            </div>

            <h2 class="mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Content Missing from Vault
            </h2>
            <p class="mt-4 text-gray-500 dark:text-gray-400 max-w-md">
                This sector of the library appears to be empty. The metadata for this link is 
                either corrupted or the file has been relocated during a system sweep.
            </p>

            <div class="mt-10 flex justify-center">
                <a href="/" class="bg-orange-600 dark:bg-yellow-500 text-white dark:text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                    Return to Dashboard
                </a>
            </div>
            <div class="mt-20 flex items-center gap-2 opacity-50">
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                <span class="text-xs font-mono uppercase tracking-widest">MediaHUB</span>
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
                <div class="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
        </div>
    `;
    const init = () => {
        
    };
    return { html, init };

};