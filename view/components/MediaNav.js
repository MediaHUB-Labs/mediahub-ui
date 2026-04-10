export const MediaNav = () => {
    const html = `
        <section class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
            ${CategoryBtn("Movies", "movies", "bg-blue-600", "/movies")}
            ${CategoryBtn("Music", "music", "bg-purple-600", "/music")}
            ${CategoryBtn("Photos", "photos", "bg-emerald-600", "/photos")}
            ${CategoryBtn("Documents", "documents", "bg-amber-600", "/docs")}
            ${CategoryBtn("Videos", "play", "bg-rose-600", "/videos")}
        </section>
    `;
    return html;
};

const CategoryBtn = (label, iconType, color, link) => {
    const icons = {
        movies: `<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />`,
        music: `<path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />`,
        photos: `<path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />`,
        documents: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
        file: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
        play: `<path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
    };

    return `
    <a href="${link}" data-link class="group">
        <div class="flex items-center p-4 bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 shadow-sm dark:shadow-none gap-2">
            <div class="w-8 h-8 md:w-12 md:h-12 p-2 md:p-1 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    ${icons[iconType] || icons.file}
                </svg>
            </div>
            <div>
                <span class="block text-sm md:text-lg font-bold text-gray-900 dark:text-white">${label}</span>
            </div>
        </div>
    </a>
    `;
};