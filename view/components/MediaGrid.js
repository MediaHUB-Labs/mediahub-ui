import { MediaCard } from './MediaCard.js';

/**
 * Responsive media grid component.
 * Renders an array of media items using MediaCard with loading/empty states.
 */

/** Render a loading skeleton grid */
export const MediaGridSkeleton = (count = 12) => {
    const cards = Array(count).fill(0).map(() => `
        <div class="animate-pulse">
            <div class="aspect-[2/3] bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
            <div class="mt-2.5 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-white/5 rounded-lg w-3/4"></div>
                <div class="h-3 bg-gray-200 dark:bg-white/5 rounded-lg w-1/2"></div>
            </div>
        </div>
    `).join('');

    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            ${cards}
        </div>
    `;
};

/** Render a loading skeleton for list-based tracks */
export const TrackListSkeleton = (count = 6) => {
    const rows = Array(count).fill(0).map(() => `
        <div class="flex items-center gap-4 p-4 animate-pulse">
            <div class="w-6 h-4 bg-gray-200 dark:bg-white/5 rounded"></div>
            <div class="w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-lg"></div>
            <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 dark:bg-white/5 rounded w-1/4"></div>
            </div>
            <div class="w-12 h-4 bg-gray-200 dark:bg-white/5 rounded hidden sm:block"></div>
        </div>
    `).join('');

    return `<div class="divide-y divide-gray-100 dark:divide-white/[0.02]">${rows}</div>`;
};

/** Render an empty state */
export const MediaGridEmpty = (message = 'No media found', icon = 'folder') => {
    const icons = {
        folder: `<path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />`,
        search: `<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />`,
        music: `<path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />`,
        image: `<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />`,
    };

    return `
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    ${icons[icon] || icons.folder}
                </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">${message}</p>
            <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload some files to get started</p>
        </div>
    `;
};

/** Render a responsive grid of media items */
export const MediaGrid = (items, cols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6') => {
    if (!items || items.length === 0) {
        return MediaGridEmpty();
    }

    return `
        <div class="grid ${cols} gap-5">
            ${items.map(item => MediaCard(item)).join('')}
        </div>
    `;
};
