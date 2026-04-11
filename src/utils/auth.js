/**
 * Auth utility helpers for managing user sessions.
 */

/** Get the stored JWT token */
export const getToken = () => localStorage.getItem('token');

/** Get the stored user object */
export const getUser = () => {
    try {
        const raw = localStorage.getItem('user');
        if (raw && raw !== 'undefined') return JSON.parse(raw);
    } catch { /* ignore */ }
    return null;
};

/** Check if a user is logged in (has token) */
export const isLoggedIn = () => !!getToken();

/** Clear session and redirect to login */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

/**
 * Auth guard — call at the top of protected page constructors.
 * Returns true if authenticated, false (and redirects) if not.
 */
export const requireAuth = () => {
    return isLoggedIn();
};

/** Get user initials for avatar display */
export const getInitials = (user) => {
    if (!user) return '??';
    const f = user.first_name ? user.first_name[0] : '';
    const l = user.last_name ? user.last_name[0] : '';
    return (f + l).toUpperCase() || (user.email ? user.email[0].toUpperCase() : '?');
};
