import { get } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { isLoggedIn } from '../../src/utils/auth.js';
import { MediaGridEmpty } from '../components/MediaGrid.js';
import { showUploadModal } from '../components/UploadModal.js';
import { MediaNav } from '../components/MediaNav.js';
import { ICONS } from '../../src/utils/icons.js';

export const Documents = () => {
    const loggedIn = isLoggedIn();

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-[90vh]">
            ${MediaNav()}
            
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
                <div class="flex items-center gap-4">
                    <a href="/" data-link class="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-amber-600 rounded-xl transition-all shadow-sm" title="Back to Dashboard">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">${ICONS.back}</svg>
                    </a>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.doc}</svg>
                        </div>
                        <div>
                            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Documents</h1>
                            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage documents and archives</p>
                        </div>
                    </div>
                </div>
                ${loggedIn ? `
                <button id="doc-upload-btn" class="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.upload}</svg>
                    Import Doc
                </button>
                ` : ''}
            </div>

            <!-- Master-Detail Layout -->
            <div class="flex flex-col lg:flex-row gap-6 mt-4">
                <!-- Sidebar: Document List -->
                <div class="w-full lg:w-96 flex flex-col bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden">
                    <div class="p-4 border-b border-gray-200 dark:border-white/5">
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">${ICONS.search}</svg>
                            <input type="text" id="doc-search" placeholder="Search archive..."
                                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition">
                        </div>
                    </div>
                    <div id="doc-list" class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin max-h-[800px] min-h-[400px]">
                        <!-- Items inject here -->
                    </div>
                </div>

                <!-- Detail: Viewer -->
                <div class="flex-1 bg-white dark:bg-zinc-900/30 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col relative group">
                    <div id="doc-viewer-placeholder" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                         <div class="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                            <svg class="w-10 h-10 opacity-20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">${ICONS.doc}</svg>
                         </div>
                         <h3 class="text-xl font-bold text-gray-600 dark:text-gray-300">No Document Selected</h3>
                         <p class="text-sm max-w-xs mt-2 font-medium">Select a file from the sidebar to preview its contents and manage its metadata.</p>
                    </div>
                    
                    <div id="doc-viewer-content" class="hidden h-full flex flex-col">
                        <div class="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
                            <div class="min-w-0">
                                <h2 id="viewer-title" class="text-xl font-black text-gray-900 dark:text-white truncate"></h2>
                                <p id="viewer-meta" class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1"></p>
                            </div>
                            <div class="flex gap-2">
                                <a id="viewer-download" href="#" target="_blank" class="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-amber-600 rounded-xl transition-all shadow-sm" title="Download">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">${ICONS.download}</svg>
                                </a>
                                ${loggedIn ? `
                                 <a id="viewer-edit" href="#" data-link class="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-orange-500 rounded-xl transition-all shadow-sm" title="Edit Metadata">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${ICONS.edit}</svg>
                                </a>
                                ` : ''}
                            </div>
                        </div>
                        <iframe id="doc-iframe" class="w-full min-h-[800px] border-0 bg-white shadow-inner" src="about:blank"></iframe>
                    </div>
                </div>
            </div>
        </div>
    `;

    const init = async () => {
        let allDocs = [];

        const renderList = (docs) => {
            const container = document.getElementById('doc-list');
            if (docs.length === 0) {
                container.innerHTML = MediaGridEmpty('No results', 'doc');
                return;
            }

            container.innerHTML = docs.map(doc => `
                <button class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left doc-item group" data-id="${doc.id}">
                    <div class="w-11 h-11 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${ICONS.doc}</svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-gray-900 dark:text-white truncate">${doc.title || 'Untitled'}</p>
                        <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">${doc.mime_type?.split('/')[1] || 'DOC'}</p>
                    </div>
                </button>
            `).join('');

            // Click events
            container.querySelectorAll('.doc-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const doc = docs.find(d => d.id === id);
                    if (doc) showDoc(doc);

                    // Highlight active
                    container.querySelectorAll('.doc-item').forEach(i => i.classList.remove('bg-amber-50', 'dark:bg-amber-500/10', 'ring-1', 'ring-amber-500/20'));
                    btn.classList.add('bg-amber-50', 'dark:bg-amber-500/10', 'ring-1', 'ring-amber-500/20');
                });
            });
        };

        const showDoc = (doc) => {
            const placeholder = document.getElementById('doc-viewer-placeholder');
            const content = document.getElementById('doc-viewer-content');
            const iframe = document.getElementById('doc-iframe');
            const title = document.getElementById('viewer-title');
            const meta = document.getElementById('viewer-meta');
            const download = document.getElementById('viewer-download');
            const edit = document.getElementById('viewer-edit');

            placeholder.classList.add('hidden');
            content.classList.remove('hidden');

            title.textContent = doc.title;
            meta.textContent = `${doc.category || 'Document'} • ${doc.mime_type}`;

            const fileUrl = `${CONFIG.API_BASE_URL}${CONFIG.ENDPOINTS.MEDIA_STREAM}/${doc.id}?token=${localStorage.getItem('token')}`;
            iframe.src = fileUrl;
            download.href = fileUrl;
            if (edit) edit.href = `/edit/${doc.id}`;
        };

        const fetchDocs = async () => {
            const res = await get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'document' });
            if (res?.success) {
                allDocs = res.data?.items || [];
                renderList(allDocs);
            }
        };

        fetchDocs();

        document.getElementById('doc-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = allDocs.filter(d =>
                d.title?.toLowerCase().includes(q) ||
                d.category?.toLowerCase().includes(q)
            );
            renderList(filtered);
        });

        document.getElementById('doc-upload-btn')?.addEventListener('click', () => {
            showUploadModal(() => fetchDocs());
        });
    };

    return { html, init };
};
