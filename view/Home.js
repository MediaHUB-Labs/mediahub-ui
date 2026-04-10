import { MediaNav } from "./components/MediaNav.js";

export const Home = () => {
    const html= `
        ${MediaNav()}

        <div class="bg-gray-100 dark:bg-[#0f0f0f] transition-colors duration-300">
            
            ${HeroBanner()}
                
            <section class="mt-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">Recently Added</h3>
                    <button class="text-sm text-orange-600 dark:text-yellow-500 hover:underline">View All</button>
                </div>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    ${MovieCard("Interstellar", "2014", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=300&h=450&auto=format&fit=crop")}
                    ${MovieCard("The Dark Knight", "2008", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=300&h=450&auto=format&fit=crop")}
                    ${MovieCard("Inception", "2010", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&h=450&auto=format&fit=crop")}
                    ${MovieCard("Arrival", "2016", "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?q=80&w=300&h=450&auto=format&fit=crop")}
                    ${MovieCard("Dune", "2021", "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=300&h=450&auto=format&fit=crop")}
                    ${MovieCard("The Batman", "2022", "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=300&h=450&auto=format&fit=crop")}
                </div>
            </section>

            <div class="h-20"></div>
        </div>
    `;
    const init = () => {
        
    };
    return { html, init };
};

const HeroBanner = () => {
    return `
        <section class="relative w-full overflow-hidden rounded-3xl group shadow-2xl bg-gray-200 dark:bg-zinc-900">
            <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-black dark:via-black/60 dark:to-transparent z-10 transition-colors duration-300"></div>
            
            <img 
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070" 
                class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 dark:opacity-100"
                alt="Featured Content"
            />

            <div class="relative z-20 p-8 md:p-10 h-full flex flex-col justify-center max-w-3xl">
                <div class="flex items-center gap-2 mb-4">
                    <span class="bg-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded text-white">Featured</span>
                    <span class="text-gray-600 dark:text-white/60 text-sm font-medium">Now Streaming</span>
                </div>
                
                <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
                    Your Personal <span class="text-orange-600 dark:text-orange-500">Media Vault.</span>
                </h1>
                
                <p class="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                    Access your entire collection of movies and TV shows from any device. 
                    Organized, beautiful, and ready to play.
                </p>

                <div class="flex gap-4 flex-col md:flex-row">
                    <button class="bg-gray-900 text-white dark:bg-white dark:text-black px-8 py-3 rounded-xl font-bold hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all flex justify-center items-center shadow-lg">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"/></svg>
                        Browse Library
                    </button>
                    <button class="bg-black/5 dark:bg-white/10 backdrop-blur-md text-gray-900 dark:text-white border border-black/10 dark:border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/20 transition-all">
                        Recently Added
                    </button>
                </div>
            </div>
        </section>
    `;
};

/**
 * Movie Card - Updated for Light/Dark
 */
const MovieCard = (title, year, img) => `
    <div class="group cursor-pointer">
        <div class="relative aspect-[2/3] bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-orange-500 dark:group-hover:border-yellow-500 transition-all duration-300">
            <img src="${img}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
        <div class="mt-3">
            <h4 class="text-sm font-medium truncate text-gray-900 dark:text-white">${title}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">${year}</p>
        </div>
    </div>
`;