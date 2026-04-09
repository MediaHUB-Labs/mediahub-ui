export const Header = () => {
    return `
        <div class="flex items-center justify-between h-full px-8 py-2 bg-[#111] backdrop-blur-md border-b border-white/5">
            <div class="flex items-center gap-4">
                <div class="text-yellow-500 font-bold text-xl cursor-pointer"> Media HUB </div>
            </div>
            <div class="flex flex-1 justify-end tems-center gap-6">
                <div class="relative w-full max-w-sm">
                    <input type="text" 
                        class="w-full py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:bg-white/10 focus:border-yellow-500 transition-all" 
                        placeholder="Search movies, shows...">
                </div>
                
                <div class="flex items-center">
                    <div class="flex items-center cursor-pointer">
                        <div class="w-8 h-8 rounded bg-yellow-600 flex items-center justify-center font-bold text-xs">JD</div>
                    </div>
                </div>
            </div>
        </div>
    `;
};