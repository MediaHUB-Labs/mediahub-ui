export const NowPlaying = () => {
    const html = `
        <div class="flex items-center justify-between h-24 px-6 bg-[#121212] border-t border-white/5">
            <div class="flex items-center w-1/4 gap-4">
                <div class="w-12 h-16 bg-white/10 rounded overflow-hidden flex-shrink-0">
                    <img src="https://via.placeholder.com/150x225" class="w-full h-full object-cover">
                </div>
                <div class="truncate">
                    <h4 class="text-sm font-bold truncate">Interstellar</h4>
                    <p class="text-xs text-gray-500">2014 • 2h 49m</p>
                </div>
            </div>

            <div class="flex flex-col items-center w-1/2 max-w-xl">
                <div class="flex items-center gap-6 mb-2">
                    <button class="text-gray-400 hover:text-white transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6z"/></svg></button>
                    <button class="p-2 bg-white text-black rounded-full hover:scale-105 transition">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </button>
                    <button class="text-gray-400 hover:text-white transition"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6z"/></svg></button>
                </div>
                <div class="w-full flex items-center gap-3">
                    <span class="text-[10px] text-gray-500">45:12</span>
                    <div class="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                        <div class="absolute inset-y-0 left-0 bg-yellow-500 w-1/3 rounded-full"></div>
                        <div class="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span class="text-[10px] text-gray-500">2:49:00</span>
                </div>
            </div>

            <div class="flex items-center justify-end w-1/4 gap-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 9v6m0 0l-3-3m3 3l3-3"></path></svg>
                <div class="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="bg-gray-400 h-full w-2/3"></div>
                </div>
            </div>
        </div>
    `;
    const init = () => {
        
    };
    return { html, init };

};