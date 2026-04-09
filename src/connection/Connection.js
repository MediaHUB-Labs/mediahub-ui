import { CONFIG } from "../global/config.js";

export const Connection = async () => {
    const SERVER_URL = CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.HEALTH; 
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch(SERVER_URL, { 
            method: 'GET',
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
            return { online: true, status: "Online", color: "bg-green-500" };
        }
        throw new Error();
    } catch (err) {
        return { online: false, status: "Offline", color: "bg-red-500" };
    }
};