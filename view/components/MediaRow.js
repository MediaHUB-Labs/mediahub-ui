import { MediaCard } from './MediaCard.js';

/**
 * Horizontal scrollable media row with title and "View All" link.
 * Used on the home page for sections like "Continue Watching", "Recently Added".
 */
export const MediaRow = (title, items, viewAllLink = '#', emptyMsg = 'Nothing here yet') => {
    if (!items || items.length === 0) {
        return `
        <section class="mb-8">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${title}</h3>
            </div>
            <div class="flex items-center justify-center py-10 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-white/5">
                <p class="text-gray-400 dark:text-gray-500 text-sm">${emptyMsg}</p>
            </div>
        </section>`;
    }

    return `
    <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${title}</h3>
            ${viewAllLink !== '#' ? `
                <a href="${viewAllLink}" data-link class="text-sm text-orange-600 dark:text-yellow-500 hover:underline font-medium">View All →</a>
            ` : ''}
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${items.map(item => `
                <div class="flex-shrink-0 w-36 sm:w-40 md:w-44 snap-start">
                    ${MediaCard(item)}
                </div>
            `).join('')}
        </div>
    </section>`;
};

/**
 * Continue Watching row — shows progress bars on each card.
 */
export const ContinueWatchingRow = (items) => {
    if (!items || items.length === 0) return '';

    const cards = items.map(item => {
        const media = item.media;
        const progress = item.progress;
        const percent = media.duration_sec > 0
            ? Math.round((progress.playhead_position_sec / media.duration_sec) * 100)
            : 0;

        const isAudio = media.mime_type?.startsWith('audio/') || media.type === 'audio';
        const link = isAudio ? '#' : `/player/${media.id}`;

        return `
        <div class="flex-shrink-0 w-48 sm:w-56 md:w-64 snap-start">
            <a href="${link}" ${!isAudio ? 'data-link' : ''} class="group cursor-pointer block" data-media-id="${media.id}" data-media-type="${isAudio ? 'audio' : 'video'}">
                <div class="relative aspect-video bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-orange-500 dark:group-hover:border-yellow-500/50 transition-all">
                    ${media.thumbnail_path ? `
                        <img src="/api/media/thumbnail/${media.id}" class="w-full h-full object-cover" alt="${media.title}" loading="lazy"
                            onerror="this.style.display='none'">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-10 h-10 text-gray-300 dark:text-white/10" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    `}
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="w-12 h-12 ${isAudio ? 'bg-purple-500 text-white' : 'bg-white text-black'} rounded-full flex items-center justify-center shadow-xl">
                            <svg class="w-6 h-6 ml-0.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    <!-- Progress bar -->
                    <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div class="h-full bg-orange-500 dark:bg-yellow-500 transition-all" style="width: ${percent}%"></div>
                    </div>
                </div>
                <div class="mt-2 px-0.5">
                    <h4 class="text-sm font-semibold truncate text-gray-900 dark:text-white">${media.title}</h4>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">${percent}% watched</p>
                </div>
            </a>
        </div>`;
    }).join('');

    return `
    <section class="mb-8">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                <span class="text-orange-600 dark:text-yellow-500">▶</span> Continue Watching
            </h3>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${cards}
        </div>
    </section>`;
};
