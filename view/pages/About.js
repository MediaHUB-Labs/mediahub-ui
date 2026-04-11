export const About = () => {
    return `
        <div class="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
            <h2 class="text-4xl font-bold mb-6 text-yellow-500">About MediaHUB</h2>
            
            <div class="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6 text-gray-300">
                <p class="text-lg leading-relaxed">
                    MediaHUB is a self-hosted media server designed to give you full control over your digital library. 
                    Stream your movies, shows, and music to any device in your home network.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div>
                        <h4 class="text-white font-bold mb-2 uppercase text-xs tracking-widest">Backend Stack</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm text-gray-400">
                            <li>Go (Golang)</li>
                            <li>Gin Web Framework</li>
                            <li>GORM & SQLite</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-white font-bold mb-2 uppercase text-xs tracking-widest">Frontend Stack</h4>
                        <ul class="list-disc list-inside space-y-1 text-sm text-gray-400">
                            <li>Vanilla JavaScript (ES6+)</li>
                            <li>Tailwind CSS</li>
                            <li>SPA Architecture</li>
                        </ul>
                    </div>
                </div>

                <div class="pt-8 border-t border-white/5 text-center">
                    <p class="text-sm text-gray-500 italic">"Your media, your rules."</p>
                </div>
            </div>
        </div>
    `;
};