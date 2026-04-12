import { ICONS } from '../../src/utils/icons.js';

/**
 * Category Navigation — Shared across all media pages.
 * Supports optional live counts for the dashboard view.
 */
export const MediaNav = (stats = null) => {
    const html = `
        <section class="flex flex-nowrap overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-5" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${CategoryBtn("Movies", "movie", "bg-blue-600", "/movies", stats?.movies)}
            ${CategoryBtn("Music", "music", "bg-purple-600", "/music", stats?.music)}
            ${CategoryBtn("Photos", "photo", "bg-emerald-600", "/photos", stats?.photos)}
            ${CategoryBtn("Documents", "doc", "bg-amber-600", "/docs", stats?.docs)}
            ${CategoryBtn("Videos", "video", "bg-rose-600", "/videos", stats?.videos)}
        </section>
    `;
    return html;
};

const CategoryBtn = (label, iconKey, color, link, count = null) => {
    return `
    <a href="${link}" data-link class="group flex-shrink-0 sm:flex-none">
        <div class="flex items-center p-3 md:p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 hover:border-orange-500/50 dark:hover:border-yellow-500/50 transition-all duration-300 shadow-sm dark:shadow-none gap-3 min-w-[140px] sm:min-w-0">
            <div class="w-8 h-8 md:w-11 md:h-11 p-2 md:p-1.5 ${color} rounded-[14px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-full h-full text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    ${ICONS[iconKey]}
                </svg>
            </div>
            <div class="flex flex-col">
                <span class="block text-sm md:text-base font-black text-gray-900 dark:text-white leading-tight">${label}</span>
                ${count !== null ? `
                    <span class="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">${count} items</span>
                ` : ''}
            </div>
        </div>
    </a>
    `;
};