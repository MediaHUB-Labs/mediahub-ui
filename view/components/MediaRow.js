import { MediaCard } from './MediaCard.js';
import { ICONS } from '../../src/utils/icons.js';
import { CONFIG } from '../../src/global/config.js';

/**
 * Horizontal scrollable media row with title and "View All" link.
 */
export const MediaRow = (title, items, viewAllLink = '#', emptyMsg = 'Nothing here yet') => {
    if (!items || items.length === 0) {
        return `
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">${title}</h3>
            </div>
            <div class="flex items-center justify-center py-10 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-gray-200 dark:border-white/5">
                <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">${emptyMsg}</p>
            </div>
        </section>`;
    }

    return `
    <section class="mb-12 group/row">
        <div class="flex justify-between items-end mb-6">
            <div>
                <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${title}</h3>
                <div class="h-1 w-12 bg-orange-500 mt-1 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-500"></div>
            </div>
            ${viewAllLink !== '#' ? `
                <a href="${viewAllLink}" data-link class="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-yellow-500 hover:text-orange-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-1 pb-1">
                    View All
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.back.replace('L15 19l-7-7 7-7', 'M9 5l7 7-7 7')}</svg>
                </a>
            ` : ''}
        </div>
        <div class="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-0.5" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${items.map(item => `
                <div class="flex-shrink-0 w-40 sm:w-44 md:w-48 snap-start hover:scale-[1.02] transition-transform duration-300">
                    ${MediaCard(item)}
                </div>
            `).join('')}
        </div>
    </section>`;
};

/**
 * Continue Watching row — shows progress bars and Resume buttons on each card.
 */
export const ContinueWatchingRow = (items) => {
    if (!items || items.length === 0) return '';

    const cards = items.map(item => {
        const media = item.media;
        const mediaId = media.id || media.ID;
        const progress = item.progress;
        const percent = media.duration_sec > 0
            ? Math.round((progress.playhead_position_sec / media.duration_sec) * 100)
            : 0;

        const isAudio = media.mime_type?.startsWith('audio/') || media.media_type === 'audio';
        const link = isAudio ? '#' : `/player/${mediaId}`;

        return `
        <div class="flex-shrink-0 w-64 sm:w-72 md:w-80 snap-start group/card">
            <a href="${link}" ${!isAudio ? 'data-link' : ''} class="block" data-media-id="${mediaId}" data-media-type="${isAudio ? 'audio' : 'video'}">
                <div class="relative aspect-video bg-gray-200 dark:bg-zinc-900 rounded-[24px] overflow-hidden border border-gray-200 dark:border-white/5 ring-1 ring-black/5 dark:ring-white/5 group-hover/card:ring-orange-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl">
                    ${media.thumbnail_path ? `
                        <img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${mediaId}" class="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out" alt="${media.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'">
                    ` : `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                             <svg class="w-12 h-12 text-zinc-400 dark:text-zinc-700" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                ${isAudio ? ICONS.music : ICONS.video}
                            </svg>
                            <span class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-2">No Preview</span>
                        </div>
                    `}
                    
                    <!-- Hover Actions -->
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                        <div class="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover/card:scale-100 transition-transform duration-300">
                             <svg class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">${ICONS.play}</svg>
                        </div>
                        <span class="text-white text-xs font-black uppercase tracking-widest shadow-lg">Resume Playback</span>
                    </div>

                    <!-- Media Type Badge -->
                    <div class="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <span class="text-[9px] font-black uppercase tracking-widest text-white">${isAudio ? 'Audio' : 'Video'}</span>
                    </div>

                    <!-- Progress Bar (Playback) -->
                    <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/40 backdrop-blur-sm">
                        <div class="h-full bg-orange-500 transition-all duration-700 ease-out" style="width: ${percent}%; box-shadow: 0 0 10px rgba(249, 115, 22, 0.5)"></div>
                    </div>

                    <!-- Transcoding Status Indicators (New Premium UI) -->
                    <div id="transcode-badge-${mediaId}" class="absolute top-3 right-3 transcode-badge-container opacity-0 pointer-events-none transition-all duration-500 z-30" data-media-id="${mediaId}">
                        <div class="bg-violet-600/95 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg backdrop-blur-md shadow-lg border border-white/20 flex items-center gap-1.5 animate-pulse">
                            <svg class="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Converting <span class="progress-percent">0%</span>
                        </div>
                    </div>

                    <div class="transcode-status-container absolute bottom-0 left-0 right-0 h-2 bg-black/60 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-700 z-40 border-t border-white/10 rounded-b-[24px]" data-media-id="${mediaId}">
                        <div class="progress-bar h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 transition-all duration-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] relative overflow-hidden" style="width: 0%">
                             <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style="background-size: 200% 100%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 px-1">
                    <div class="flex justify-between items-start gap-3">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate flex-1 tracking-tight">${media.title}</h4>
                        <span class="text-[10px] font-black text-orange-600 dark:text-yellow-500 whitespace-nowrap">${percent}%</span>
                    </div>
                    <p class="text-[10px] text-gray-500 dark:text-zinc-500 uppercase tracking-widest font-bold mt-1">${media.category || (isAudio ? 'Music' : 'Movies')}</p>
                </div>
            </a>
        </div>`;
    }).join('');

    return `
    <section class="mb-16 group/watching">
        <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-500">
                     <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">${ICONS.play}</svg>
                </div>
                <div>
                   <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Continue Watching</h3>
                   <p class="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] -mt-1">Pick up where you left off</p>
                </div>
            </div>
        </div>
        <div class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory px-1 scrollbar-hide" style="scrollbar-width: none; -ms-overflow-style: none;">
            ${cards}
        </div>
    </section>`;
};
