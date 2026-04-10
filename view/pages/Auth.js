import { CONFIG } from '../../src/global/config.js';
import { App } from '../../App.js';

export const AuthView = (mode = 'login') => {
    const root = document.getElementById('root');
    const isLogin = mode === 'login';

    root.innerHTML = `
        <div class="flex items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-300">
            <div class="w-full max-w-md bg-[#1a1a1a] p-10 rounded-3xl border border-white/5 shadow-2xl">
                
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-bold text-white mb-2">${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p class="text-gray-500 text-sm">MediaHUB Authentication</p>
                </div>

                <form id="auth-form" class="space-y-4">
                    ${!isLogin ? `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-400 uppercase mb-2">First Name</label>
                            <input type="text" name="first_name" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-400 uppercase mb-2">Last Name</label>
                            <input type="text" name="last_name" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition">
                        </div>
                    </div>
                    ` : ''}

                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase mb-2">Email</label>
                        <input type="email" name="email" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition" placeholder="you@example.com">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-400 uppercase mb-2">Password</label>
                        <input type="password" name="password" required minlength="6" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition" placeholder="••••••••">
                    </div>

                    <button type="submit" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all mt-4">
                        ${isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div class="mt-8 text-center">
                    <button id="toggle-auth" class="text-sm text-gray-500 hover:text-yellow-500 transition">
                        ${isLogin ? "Don't have an account? <span class='font-bold'>Register</span>" : "Already have an account? <span class='font-bold'>Login</span>"}
                    </button>
                </div>
            </div>
        </div>
    `;

    bindAuthEvents(isLogin);
};

function bindAuthEvents(isLogin) {
    const form = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-auth');

    toggleBtn?.addEventListener('click', () => {
        AuthView(isLogin ? 'register' : 'login');
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form data to Object
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        // Determine Go Endpoint based on mode
        const endpoint = isLogin ? CONFIG.ENDPOINTS.LOGIN : CONFIG.ENDPOINTS.SIGNUP;

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token',result.data.token);
                window.history.pushState({}, "", "/");
                App.router();
            } else {
                console.error(`Error: ${result.error || 'Authentication failed'}`);
            }
        } catch (err) {
            console.error("Auth Request Failed:", err);
        }
    });
}