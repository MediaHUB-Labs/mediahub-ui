/**
 * Formatting utility functions for display.
 */

/** Format seconds into human readable duration: "1h 23m" or "4m 12s" */
export const formatDuration = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return '--';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

/** Format seconds into mm:ss or hh:mm:ss */
export const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return '0:00';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const ss = s.toString().padStart(2, '0');
    const mm = h > 0 ? m.toString().padStart(2, '0') : m.toString();
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
};

/** Format kilobytes into human readable size: "4.2 MB" or "1.3 GB" */
export const formatFileSize = (kb) => {
    if (!kb || kb <= 0) return '--';
    if (kb < 1024) return `${kb} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
};

/** Format ISO date string to readable: "Apr 11, 2026" */
export const formatDate = (isoStr) => {
    if (!isoStr) return '--';
    try {
        const date = new Date(isoStr);
        if (date.getFullYear() <= 1) return '--';
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch { return '--'; }
};

/** Format ISO date string to relative time: "2 hours ago" */
export const timeAgo = (isoStr) => {
    if (!isoStr) return '';
    try {
        const date = new Date(isoStr);
        if (date.getFullYear() <= 1) return '';
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return formatDate(isoStr);
    } catch { return ''; }
};

/** Get a display-friendly media type from MIME */
export const getMediaTypeLabel = (mimeType) => {
    if (!mimeType) return 'File';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.startsWith('image/')) return 'Image';
    return 'Document';
};

/** Get a category badge color class */
export const getCategoryColor = (category) => {
    const colors = {
        'Movie': 'bg-blue-600',
        'Music': 'bg-purple-600',
        'Photo': 'bg-emerald-600',
        'Document': 'bg-amber-600',
        'Video': 'bg-rose-600',
    };
    return colors[category] || 'bg-gray-600';
};

/** Get a file type icon SVG path(s) based on MIME type */
export const getFileIcon = (mimeType) => {
    if (!mimeType) return `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`;
    if (mimeType.startsWith('video/')) return `<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />`;
    if (mimeType.startsWith('audio/')) return `<path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />`;
    if (mimeType.startsWith('image/')) return `<path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />`;
    return `<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`;
};
