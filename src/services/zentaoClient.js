const axios = require('axios');
const CacheService = require('./cache');

class ZenTaoClient {
    constructor(baseURL) {
        this.baseURL = (baseURL || '').replace(/\/+$/, '');
        this.axios = axios.create({ baseURL: this.baseURL, timeout: 10000 });
        this.cache = new CacheService();
    }

    async setTokenHeader(token) {
        this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    async loadCachedSession() {
        const cached = await this.cache.readSession();
        if (cached) {
            if (cached.expiresAt && Date.now() >= cached.expiresAt) {
                return false;
            }
            await this.setTokenHeader(cached.token);
            return true;
        }
        return false;
    }

    async login(account, password) {
        const resp = await this.axios.post('/api/user-login', { account, password });
        const data = resp.data || {};
        const session = {
            token: data.token,
            account,
            expiresAt: Date.now() + (data.ttl || 3600) * 1000,
        };
        await this.cache.writeSession(session);
        await this.setTokenHeader(session.token);
        return session;
    }

    async logout() {
        await this.cache.clear();
        delete this.axios.defaults.headers.common['Authorization'];
    }

    async ensureSession() {
        const cached = await this.cache.readSession();
        if (cached && (!cached.expiresAt || Date.now() < cached.expiresAt)) {
            await this.setTokenHeader(cached.token);
            return cached;
        }
        throw new Error('No cached ZenTao session. Please login first.');
    }

    async getBugs(params) {
        await this.ensureSession();
        const resp = await this.axios.get('/api/bugs', {
            params: { limit: (params && params.limit) || 50, projectId: params && params.projectId },
        });
        return (resp.data && (resp.data.items || resp.data)) || [];
    }
}

module.exports = ZenTaoClient;
