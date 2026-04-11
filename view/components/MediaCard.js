import { formatDuration } from '../../src/utils/format.js';
import { CONFIG } from '../../src/global/config.js';

/**
 * Reusable media card component.
 * Supports video, audio, image, and document types.
 */
export const MediaCard = (media) => {
    const isVideo = media.mime_type?.startsWith('video/');
    const isAudio = media.mime_type?.startsWith('audio/');
    const isImage = media.mime_type?.startsWith('image/');

    // Determine the link
    let link = '#';
    if (isVideo) link = `/player/${media.id}`;
    else if (isImage) link = '#'; // handled by lightbox
    else if (isAudio) link = '#'; // handled by audio player

    // Determine thumbnail
    let thumbnailHtml = '';
    if (media.thumbnail_path) {
        thumbnailHtml = `<img src="${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${media.id}" 
            class="w-full h-full object-cover" alt="${media.title}" loading="lazy" 
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`;
    }

    // Icon fallback based on type
    const iconPaths = {
        video: `<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />`,
        audio: `<path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />`,
        image: `<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />`,
        document: `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    };
    const iconType = isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'document';
    const iconBgColors = { video: 'bg-blue-600', audio: 'bg-purple-600', image: 'bg-emerald-600', document: 'bg-amber-600' };

    const aspectClass = isAudio ? 'aspect-square' : 'aspect-[2/3]';
    const duration = (isVideo || isAudio) && media.duration_sec ? formatDuration(media.duration_sec) : '';

    return `
    <a href="${link}" ${link !== '#' ? 'data-link' : ''} class="group cursor-pointer media-card" data-media-id="${media.id}" data-media-type="${iconType}">
        <div class="relative ${aspectClass} bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 group-hover:border-orange-500 dark:group-hover:border-yellow-500/50 transition-all duration-300 shadow-sm dark:shadow-none">
            ${thumbnailHtml}
            <div class="absolute inset-0 flex items-center justify-center ${media.thumbnail_path ? 'hidden' : ''}" style="${media.thumbnail_path ? 'display:none' : ''}">
                <div class="w-16 h-16 ${iconBgColors[iconType]} rounded-2xl flex items-center justify-center opacity-40">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        ${iconPaths[iconType]}
                    </svg>
                </div>
            </div>
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                ${isVideo ? `
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-100 scale-75 transition-transform">
                    <svg class="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>` : ''}
                ${isAudio ? `
                <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-100 scale-75 transition-transform play-audio-btn">
                    <svg class="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>` : ''}
            </div>
            
            <!-- Duration badge -->
            ${duration ? `
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm">
                ${duration}
            </div>` : ''}
            
            <!-- New badge -->
            ${media.is_new ? `
            <div class="absolute top-2 left-2 bg-orange-600 dark:bg-yellow-500 text-white dark:text-black text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg">
                New
            </div>` : ''}
        </div>
        <div class="mt-2.5 px-0.5">
            <h4 class="text-sm font-semibold truncate text-gray-900 dark:text-white">${media.title || 'Untitled'}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">${media.category || ''} ${media.genres ? '• ' + media.genres.split(',')[0] : ''}</p>
        </div>
    </a>
    `;
};
