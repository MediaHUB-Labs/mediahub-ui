import { formatDuration } from '../../src/utils/format.js';
import { CONFIG } from '../../src/global/config.js';
import { isLoggedIn } from '../../src/utils/auth.js';
import { ICONS } from '../../src/utils/icons.js';

/**
 * Reusable media card component.
 * Supports video, audio, image, and document types.
 */
export const MediaCard = (media) => {
    const loggedIn = isLoggedIn();
    const isVideo = media.mime_type?.startsWith('video/') || media.type === 'video';
    const isAudio = media.mime_type?.startsWith('audio/') || media.type === 'audio';
    const isImage = media.mime_type?.startsWith('image/') || media.type === 'image';
    const isDoc = !isVideo && !isAudio && !isImage;

    // Determine the link
    let link = '#';
    if (isVideo) link = `/player/${media.id}`;
    else if (isImage) link = '#'; // handled by lightbox
    else if (isAudio) link = '#'; // handled by audio player

    // Determine thumbnail
    let thumbnailHtml = '';
    if (media.thumbnail_path) {
        thumbnailHtml = `<img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${media.id}?token=${localStorage.getItem('token')}" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="${media.title}" loading="lazy" 
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`;
    }

    // Icon fallback based on type
    const iconKey = isVideo ? 'video' : isAudio ? 'music' : isImage ? 'photo' : 'doc';
    const iconBgColors = { video: 'bg-blue-600', music: 'bg-purple-600', photo: 'bg-emerald-600', doc: 'bg-amber-600' };

    // Determine display type based on category or mime_type
    let displayType = media.category || 'File';
    if (media.type === 'video' && !media.category) displayType = 'Video';
    if (media.type === 'audio' && !media.category) displayType = 'Audio';

    const aspectClass = (isAudio || isImage) ? 'aspect-square' : 'aspect-[16/9] md:aspect-[2/3]';
    const duration = (isVideo || isAudio) && media.duration_sec ? formatDuration(media.duration_sec) : '';

    return `
    <div class="group relative media-card animate-in fade-in duration-500" data-media-id="${media.id}" data-media-type="${iconKey}">
        <div class="relative ${aspectClass} bg-gray-100 dark:bg-white/[0.03] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-orange-500 transition-all duration-300 shadow-sm">
            ${thumbnailHtml}
            <div class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800/50 ${media.thumbnail_path ? 'hidden' : ''}" style="${media.thumbnail_path ? 'display:none' : ''}">
                <div class="w-16 h-16 ${iconBgColors[iconKey]} rounded-2xl flex items-center justify-center shadow-inner">
                    <svg class="w-9 h-9 text-white opacity-80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        ${ICONS[iconKey]}
                    </svg>
                </div>
            </div>
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                <a href="${link}" ${link !== '#' ? 'data-link' : ''} class="w-32 py-2.5 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">${ICONS.play}</svg>
                    Play
                </a>
                ${loggedIn ? `
                <a href="/edit/${media.id}" data-link class="w-32 py-2.5 bg-black/60 text-white border border-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all transform translate-y-2 group-hover:translate-y-0 backdrop-blur-md">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.edit}</svg>
                    Edit
                </a>
                ` : ''}
            </div>
            
            <!-- Badges -->
            ${duration ? `<div class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm">${duration}</div>` : ''}
            ${media.is_new ? `<div class="absolute top-2 left-2 bg-orange-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg">New</div>` : ''}
            
            ${isVideo && media.is_transcoded ? `
            <div class="absolute top-2 right-2 bg-blue-600/90 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg backdrop-blur-sm flex items-center gap-1">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.hls}</svg>
                HLS
            </div>` : ''}

            ${isVideo && !media.is_transcoded && loggedIn ? `
            <button class="absolute top-2 right-2 bg-black/60 hover:bg-violet-600 text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-xl backdrop-blur-sm transition-all shadow-lg border border-white/10 z-20 transcode-grid-btn" data-media-id="${media.id}">
                HLS
            </button>
            ` : ''}
        </div>
        <div class="mt-2.5 px-0.5">
            <h4 class="text-sm font-semibold truncate text-gray-900 dark:text-white">${media.title || 'Untitled'}</h4>
            <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/5">${displayType}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400 truncate">${media.genres || ''}</span>
            </div>
        </div>
    </div>
    `;
};
