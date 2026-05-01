import { CONFIG } from './config.js';

/**
 * Central HTTP client with automatic JWT token injection.
 * Redirects to /login on 401 responses.
 */

const getHeaders = (isFormData = false) => {
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on a public auth page to prevent redirect loops
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/signup') {
            window.location.href = '/login';
        }
        return null;
    }
    
    try {
        return await response.json();
    } catch {
        return null;
    }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint path
 * @param {Object} params - Query parameters
 */
export const get = async (endpoint, params = {}) => {
    const url = new URL(CONFIG.API_BASE_URL + endpoint, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, value);
        }
    });

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: getHeaders(),
        });
        return await handleResponse(response);
    } catch (err) {
        console.error('API GET Error:', err);
        return { success: false, error: 'Network error' };
    }
};

/**
 * POST request (JSON body)
 * @param {string} endpoint - API endpoint path
 * @param {Object} body - Request body
 */
export const post = async (endpoint, body = {}) => {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + endpoint, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return await handleResponse(response);
    } catch (err) {
        console.error('API POST Error:', err);
        return { success: false, error: 'Network error' };
    }
};

/**
 * POST request with FormData (for file uploads)
 * @param {string} endpoint - API endpoint path
 * @param {FormData} formData - Form data including files
 * @param {Function} onProgress - Progress callback (0-100)
 */
export const upload = (endpoint, formData, onProgress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = localStorage.getItem('token');

        xhr.open('POST', CONFIG.API_BASE_URL + endpoint);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        });

        xhr.onload = () => {
            try {
                const result = JSON.parse(xhr.responseText);
                if (xhr.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                resolve(result);
            } catch {
                reject(new Error('Invalid response'));
            }
        };

        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
    });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint path
 * @param {Object} body - Request body
 */
export const put = async (endpoint, body = {}) => {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + endpoint, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return await handleResponse(response);
    } catch (err) {
        console.error('API PUT Error:', err);
        return { success: false, error: 'Network error' };
    }
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint path
 * @param {Object} body - Request body
 */
export const del = async (endpoint, body = {}) => {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + endpoint, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        return await handleResponse(response);
    } catch (err) {
        console.error('API DELETE Error:', err);
        return { success: false, error: 'Network error' };
    }
};

/**
 * Build streaming URL for media
 * @param {number} mediaId - Media item ID
 */
export const getStreamUrl = (mediaId) => {
    const token = localStorage.getItem('token');
    return `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${mediaId}?token=${token}`;
};

/**
 * Build thumbnail URL for media
 * @param {number} mediaId - Media item ID
 */
export const getThumbnailUrl = (mediaId) => {
    return `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_THUMBNAIL}/${mediaId}`;
};
