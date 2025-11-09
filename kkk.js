export class StateManager {
    constructor() {
        this.state = {
            user: null,
            videos: [],
            preferences: {},
            session: {}
        };
        this.subscribers = new Set();
    }

    async init() {
        await this.loadState();
        this.setupPersistence();
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
        this.saveState();
    }

    async loadState() {
        try {
            const saved = localStorage.getItem('socialflow_state');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('State load error:', error);
        }
    }

    async saveState() {
        try {
            localStorage.setItem('socialflow_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('State save error:', error);
        }
    }

    setupPersistence() {
        // Periodic state saving
        setInterval(() => this.saveState(), 30000);
        
        // Save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveState();
            }
        });
    }
}