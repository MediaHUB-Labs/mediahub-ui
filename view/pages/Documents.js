import { get, del, getStreamUrl } from '../../src/global/api.js';
import { CONFIG } from '../../src/global/config.js';
import { requireAuth } from '../../src/utils/auth.js';
import { showUploadModal } from '../components/UploadModal.js';
import { showToast } from '../components/Toast.js';
import { MediaNav } from '../components/MediaNav.js';
import { formatDate, formatFileSize, getFileIcon } from '../../src/utils/format.js';

export const Documents = () => {
    if (!requireAuth()) return { html: '', init: () => { } };

    const html = `
        <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            ${MediaNav()}
            <!-- Page Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        <span class="text-amber-500">📄</span> Documents
                    </h1>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Your private document vault — only you can see these</p>
                </div>
                <button id="docs-upload-btn" class="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 transition-all shadow-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Document
                </button>
            </div>

            <!-- Search -->
            <div class="relative mb-5">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" id="docs-search" placeholder="Search documents..."
                    class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition placeholder-gray-400 dark:placeholder-gray-500">
            </div>

            <!-- Document List -->
            <div id="docs-content" class="space-y-2">
                <div class="animate-pulse space-y-2">
                    ${Array(5).fill(0).map(() => `<div class="h-16 bg-gray-200 dark:bg-white/5 rounded-xl"></div>`).join('')}
                </div>
            </div>

            <div id="docs-load-more" class="hidden text-center py-8">
                <button id="docs-load-more-btn" class="px-8 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition">Load More</button>
            </div>
        </div>

        <!-- Document Lightbox -->
        <div id="doc-lightbox" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl hidden items-center justify-center p-4">
            <button id="doc-lightbox-close" class="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10 bg-black/50 hover:bg-black/80 rounded-full transition-all">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="w-full max-w-5xl h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl relative">
                <iframe id="doc-lightbox-iframe" class="w-full h-full border-0" src=""></iframe>
            </div>
            <div id="doc-lightbox-info" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-2.5 rounded-2xl text-sm font-medium backdrop-blur-sm"></div>
        </div>
    `;

    const init = async () => {
        let docs = [];
        let offset = 0;
        const limit = 20;
        let searchTimeout = null;

        const renderDocs = () => {
            const container = document.getElementById('docs-content');
            if (docs.length === 0) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-24 text-center">
                        <div class="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                            <svg class="w-12 h-12 text-amber-500/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">No documents yet</p>
                        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload documents to start your vault</p>
                    </div>`;
                return;
            }

            container.innerHTML = docs.map((doc, idx) => {
                const ext = doc.title?.split('.').pop()?.toUpperCase() || 'FILE';
                return `
                <div class="doc-row relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 cursor-pointer transition-all group" data-index="${idx}">
                    <div class="w-11 h-11 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 object-contain" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            ${getFileIcon(doc.mime_type)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0 pr-4">
                        <div class="flex items-center gap-3">
                            <p class="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">${doc.title || 'Untitled'}</p>
                            <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-200 dark:border-amber-500/20">${ext}</span>
                        </div>
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">${formatFileSize(doc.file_size_kb)} • ${formatDate(doc.created_at)}</p>
                    </div>
                    
                    <!-- Actions Array -->
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href="${getStreamUrl(doc.id)}" target="_blank"
                            class="doc-action p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition" title="Download Original">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                        <button class="doc-action doc-delete-btn p-2.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition" data-id="${doc.id}" title="Delete Document">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>`;
            }).join('');

            // View handlers directly on the row
            container.querySelectorAll('.doc-row').forEach(row => {
                const idx = parseInt(row.dataset.index);
                const doc = docs[idx]; // Capture doc at bind time to avoid any async/search overwrite drift
                
                row.addEventListener('click', (e) => {
                    if (e.target.closest('.doc-action')) return; // Ignore click if targeting download/delete
                    if (!doc) {
                        console.error("Critical: Document data missing at click time!");
                        return;
                    }
                    
                    const lb = document.getElementById('doc-lightbox');
                    const iframe = document.getElementById('doc-lightbox-iframe');
                    const info = document.getElementById('doc-lightbox-info');
                    
                    if (!lb || !iframe) {
                        console.error("Critical: Lightbox DOM missing!");
                        return;
                    }
                    
                    iframe.src = getStreamUrl(doc.id);
                    if (info) info.textContent = `${doc.title || 'Untitled'} — ${formatFileSize(doc.file_size_kb)}`;
                    
                    lb.classList.remove('hidden');
                    lb.classList.add('flex');
                });
            });

            // Delete handlers
            container.querySelectorAll('.doc-delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (!confirm('Delete this document?')) return;
                    const id = parseInt(btn.dataset.id);
                    const res = await del(CONFIG.ENDPOINTS.MEDIA_DELETE, { id });
                    if (res?.success) {
                        showToast('Document deleted', 'success');
                        loadDocs(true);
                    } else {
                        showToast(res?.error || 'Delete failed', 'error');
                    }
                });
            });
        };

        const loadDocs = async (reset = false) => {
            if (reset) { offset = 0; docs = []; }
            const res = await get(CONFIG.ENDPOINTS.MEDIA_VAULT, { type: 'document', limit, offset });
            if (res?.success) {
                const items = res.data?.items || [];
                docs = reset ? items : [...docs, ...items];
                renderDocs();
                const total = res.data?.total_count || 0;
                document.getElementById('docs-load-more').classList.toggle('hidden', docs.length >= total);
            }
        };

        // Search
        document.getElementById('docs-search')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const q = e.target.value.trim();
                if (!q) { loadDocs(true); return; }
                const res = await get(CONFIG.ENDPOINTS.MEDIA_SEARCH, { q, limit: 50 });
                if (res?.success) {
                    docs = (res.data?.items || []).filter(i => !i.mime_type?.startsWith('video/') && !i.mime_type?.startsWith('audio/') && !i.mime_type?.startsWith('image/'));
                    renderDocs();
                    document.getElementById('docs-load-more').classList.add('hidden');
                }
            }, 400);
        });

        document.getElementById('docs-load-more-btn')?.addEventListener('click', () => { offset += limit; loadDocs(false); });
        document.getElementById('docs-upload-btn')?.addEventListener('click', () => showUploadModal(() => loadDocs(true)));

        // Lightbox handlers
        const hideLightbox = () => {
            const lb = document.getElementById('doc-lightbox');
            const iframe = document.getElementById('doc-lightbox-iframe');
            lb.classList.add('hidden');
            lb.classList.remove('flex');
            iframe.src = '';
        };

        document.getElementById('doc-lightbox-close')?.addEventListener('click', hideLightbox);
        document.addEventListener('keydown', (e) => {
            const lb = document.getElementById('doc-lightbox');
            if (lb && !lb.classList.contains('hidden') && e.key === 'Escape') {
                hideLightbox();
            }
        });

        await loadDocs(true);
    };

    return { html, init };
};
