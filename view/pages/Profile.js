import { get, put } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth, getUser, getInitials, logout } from '../../src/utils/auth.js';
import { showToast } from '../components/Toast.js';
import { formatDate } from '../../src/utils/format.js';

export const Profile = () => {

    const user = getUser();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Profile Card -->
            <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl overflow-hidden">
                <!-- Banner -->
                <div class="h-32 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 relative">
                    <div class="absolute -bottom-10 left-8">
                        <div class="w-20 h-20 rounded-2xl bg-orange-600 dark:bg-yellow-500 flex items-center justify-center text-2xl font-extrabold text-white dark:text-black border-4 border-white dark:border-[#1a1a1a] shadow-xl">
                            ${getInitials(user)}
                        </div>
                    </div>
                </div>

                <div class="pt-14 px-8 pb-8">
                    <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">${user?.first_name || ''} ${user?.last_name || ''}</h1>
                    <p class="text-gray-500 text-sm mt-1">${user?.email || ''}</p>
                    <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Member since ${formatDate(user?.created_at)}</p>

                    <!-- Edit Form -->
                    <form id="profile-form" class="mt-8 space-y-5 w-full md:w-1/2">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">First Name</label>
                                <input type="text" name="first_name" value="${user?.first_name || ''}" 
                                    class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Last Name</label>
                                <input type="text" name="last_name" value="${user?.last_name || ''}" 
                                    class="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm focus:border-orange-500 dark:focus:border-yellow-500 outline-none transition">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wider">Email</label>
                            <input type="email" value="${user?.email || ''}" disabled
                                class="w-full bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed">
                        </div>

                        <button type="submit" id="save-profile-btn"
                            class="px-2 cursor-pointer bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-2.5 rounded-xl hover:bg-orange-600 dark:hover:bg-yellow-500 transition-all text-sm">
                            Save Changes
                        </button>
                    </form>

                    <!-- Danger Zone -->
                    <div class="mt-10 pt-6 border-t border-gray-100 dark:border-white/5">
                        <h3 class="text-sm font-bold text-red-500 uppercase tracking-wider mb-4">Danger Zone</h3>
                        <button id="logout-profile-btn" class="px-5 py-2 cursor-pointer border border-red-200 dark:border-red-500/20 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const init = () => {
        // Save profile
        document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const res = await put(CONFIG.ENDPOINTS.USER, {
                id: user?.id,
                first_name: fd.get('first_name'),
                last_name: fd.get('last_name'),
            });
            if (res?.success) {
                // Update localStorage
                const updated = { ...user, first_name: fd.get('first_name'), last_name: fd.get('last_name') };
                localStorage.setItem('user', JSON.stringify(updated));
                showToast('Profile updated!', 'success');
                // Refresh header
                setTimeout(() => window.location.reload(), 800);
            } else {
                showToast(res?.error || 'Update failed', 'error');
            }
        });

        // Logout
        document.getElementById('logout-profile-btn')?.addEventListener('click', () => {
            logout();
        });
    };

    return { html, init };
};
