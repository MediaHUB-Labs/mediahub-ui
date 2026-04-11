import { CONFIG } from '../../src/global/config.js';
import { App } from '../../App.js';
import { showToast } from '../components/Toast.js';

export const AuthView = (mode = 'login') => {
    const isLogin = mode === 'login';

    const html = `
        <div class="flex items-center justify-center min-h-[80vh] p-4">
            <div class="w-full max-w-md bg-white dark:bg-[#1a1a1a] p-10 rounded-3xl border border-gray-200 dark:border-white/5 shadow-2xl">
                
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center w-14 h-14 bg-orange-100 dark:bg-yellow-500/10 rounded-2xl mb-4">
                        <svg class="w-7 h-7 text-orange-600 dark:text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            ${isLogin 
                                ? `<path stroke-linecap="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />`
                                : `<path stroke-linecap="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />`
                            }
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">MediaHUB Authentication</p>
                </div>

                <form id="auth-form" class="space-y-4">
                    ${!isLogin ? `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">First Name</label>
                            <input type="text" name="first_name" required class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500" placeholder="John">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Last Name</label>
                            <input type="text" name="last_name" required class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500" placeholder="Doe">
                        </div>
                    </div>
                    ` : ''}

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Email</label>
                        <input type="email" name="email" required class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500" placeholder="you@example.com">
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wider">Password</label>
                        <input type="password" name="password" required minlength="6" class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-yellow-500 focus:ring-1 focus:ring-orange-500 dark:focus:ring-yellow-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500" placeholder="••••••••">
                    </div>

                    <!-- Error message slot -->
                    <div id="auth-error" class="hidden text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl"></div>

                    <button type="submit" id="auth-submit-btn" class="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-yellow-500 font-bold py-3 rounded-xl transition-all mt-2 shadow-lg text-sm">
                        ${isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div class="mt-8 text-center">
                    <button id="toggle-auth" class="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-yellow-500 transition">
                        ${isLogin ? "Don't have an account? <span class='font-bold'>Register</span>" : "Already have an account? <span class='font-bold'>Login</span>"}
                    </button>
                </div>
            </div>
        </div>
    `;

    const init = () => {
        const form = document.getElementById('auth-form');
        const toggleBtn = document.getElementById('toggle-auth');
        const errorDiv = document.getElementById('auth-error');

        // Toggle between Login/Signup
        toggleBtn?.addEventListener('click', () => {
            const nextMode = isLogin ? 'register' : 'login';
            const nextPath = isLogin ? '/signup' : '/login';
            window.history.pushState({}, "", nextPath);
            App.renderComponent('root', AuthView(nextMode));
        });

        // Handle Form Submission
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('auth-submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = isLogin ? 'Signing in...' : 'Creating account...';
            errorDiv.classList.add('hidden');

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());
            const endpoint = isLogin ? CONFIG.ENDPOINTS.LOGIN : CONFIG.ENDPOINTS.SIGNUP;

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('user', JSON.stringify(result.data.user || result.data.User));
                    showToast(isLogin ? 'Welcome back!' : 'Account created!', 'success');
                    setTimeout(() => { window.location.href = "/"; }, 500);
                } else {
                    errorDiv.textContent = result.error || 'Authentication failed';
                    errorDiv.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
                }
            } catch (err) {
                console.error("Auth Request Failed:", err);
                errorDiv.textContent = 'Network error — is the server running?';
                errorDiv.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = isLogin ? 'Sign In' : 'Create Account';
            }
        });
    };

    return { html, init };
};