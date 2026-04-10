export const Home = () => {
    return `
        <div class="p-8 space-y-12">

            ${HeroBanner()}

            <section>
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-semibold">Recently Added</h3>
                    <button class="text-sm text-yellow-500 hover:underline">View All</button>
                </div>
                
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    ${MovieCard("Interstellar", "2014", "https://via.placeholder.com/300x450")}
                    ${MovieCard("The Dark Knight", "2008", "https://via.placeholder.com/300x450")}
                    ${MovieCard("Inception", "2010", "https://via.placeholder.com/300x450")}
                    ${MovieCard("Arrival", "2016", "https://via.placeholder.com/300x450")}
                    ${MovieCard("Dune", "2021", "https://via.placeholder.com/300x450")}
                    ${MovieCard("The Batman", "2022", "https://via.placeholder.com/300x450")}
                </div>
            </section>

            <div class="h-20"></div>
        </div>
    `;
};

// Simple reusable card component
const MovieCard = (title, year, img) => `
    <div class="group cursor-pointer">
        <div class="relative aspect-[2/3] bg-white/5 rounded-lg overflow-hidden border border-white/5 group-hover:border-yellow-500 transition-all duration-300">
            <img src="${img}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
        <div class="mt-3">
            <h4 class="text-sm font-medium truncate">${title}</h4>
            <p class="text-xs text-gray-500">${year}</p>
        </div>
    </div>
`;

export const HeroBanner = () => {
    return `
        <section class="relative w-full h-[22rem] overflow-hidden rounded-3xl group shadow-2xl">
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
            <img 
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070" 
                class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                alt="Featured Content"
            />

            <div class="relative z-20 h-full p-10 flex flex-col justify-center max-w-2xl">
                <div class="flex items-center space-x-2 mb-4">
                    <span class="bg-red-600 text-[10px] font-bold uppercase px-2 py-1 rounded">Featured</span>
                    <span class="text-white/60 text-sm">Now Streaming</span>
                </div>
                
                <h1 class="text-5xl font-extrabold mb-4 tracking-tight">
                    Your Personal <span class="text-orange-500">Media Vault.</span>
                </h1>
                
                <p class="text-lg text-gray-300 mb-8 leading-relaxed">
                    Access your entire collection of movies and TV shows from any device. 
                    Organized, beautiful, and ready to play.
                </p>

                <div class="flex space-x-4">
                    <button class="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"/></svg>
                        Browse Library
                    </button>
                    <button class="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
                        Recently Added
                    </button>
                </div>
            </div>
        </section>
    `;
};