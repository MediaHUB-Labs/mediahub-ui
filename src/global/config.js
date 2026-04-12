export const CONFIG = {
    API_BASE_URL: "http://192.168.0.108:9123/api",
    ENDPOINTS: {
        // Health
        HEALTH: "/health",

        // Auth
        LOGIN: "/auth/login",
        SIGNUP: "/auth/signup",
        USER: "/auth/user",

        // Media
        MEDIA_HEALTH: "/media/health",
        MEDIA_ADD: "/media/add",
        MEDIA_LIST: "/media/list",
        MEDIA_SEARCH: "/media/search",
        MEDIA_CATEGORIES: "/media/categories",
        MEDIA_DETAILS: "/media/details",
        MEDIA_METADATA: "/media/metadata",
        MEDIA_DELETE: "/media/item",
        MEDIA_VAULT: "/media/vault",
        MEDIA_STREAM: "/media/stream",       // + /:id
        MEDIA_THUMBNAIL: "/media/thumbnail", // + /:id
        MEDIA_HLS: "/media/hls",             // + /:id
        MEDIA_TRANSCODE: "/media/transcode", // + /:id
        TRANSCODE_STATUS: "/media/transcode/status",

        // Progress
        PROGRESS_SAVE: "/progress/save",
        PROGRESS_CONTINUE: "/progress/continue",
        PROGRESS_CLEAR: "/progress/clear",

        // Playlists
        PLAYLIST_CREATE: "/playlist/create",
        PLAYLIST_LIST: "/playlist/list",
        PLAYLIST: "/playlist",               // + /:id
    }
};