export class VideoPlayer {
    constructor(container) {
        this.container = container;
        this.videoElement = container.querySelector('video');
        this.isPlaying = false;
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupEventListeners();
        this.setupPreloadStrategy();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.load();
                } else {
                    this.pause();
                }
            });
        }, { threshold: 0.7 });

        this.observer.observe(this.container);
    }

    setupPreloadStrategy() {
        // Adaptive preload based on network conditions
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.saveData || connection.effectiveType === 'slow-2g') {
                this.videoElement.preload = 'metadata';
            } else {
                this.videoElement.preload = 'auto';
            }
        }
    }

    async load() {
        if (this.videoElement.dataset.src) {
            this.videoElement.src = this.videoElement.dataset.src;
            delete this.videoElement.dataset.src;
            await this.videoElement.load();
        }
    }

    async play() {
        try {
            await this.videoElement.play();
            this.isPlaying = true;
        } catch (error) {
            console.error('Video play failed:', error);
        }
    }

    pause() {
        this.videoElement.pause();
        this.isPlaying = false;
    }

    destroy() {
        this.pause();
        this.observer?.disconnect();
        this.videoElement.src = '';
        this.videoElement.load();
    }
}