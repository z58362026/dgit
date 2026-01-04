const axios = require('axios');
const CacheService = require('./cache');
const { selectProducts } = require('../ui/prompts');

class ZenTaoClient {
    constructor(baseURL) {
        this.ZenTaoInfo = {
            token: '',
            account: '',
            password: '',
            productId: null,
            productName: '',
        };
        this.baseURL = (baseURL || '').replace(/\/+$/, '');
        this.axios = axios.create({ baseURL: this.baseURL, timeout: 10000 });
        this.cache = new CacheService();
    }

    async setTokenHeader(token) {
        this.axios.defaults.headers.common['Token'] = token;
    }

    // 配置登录信息
    async loadCachedSession() {
        const cached = await this.cache.readSession();
        // console.log('获取到缓存token信息：', cached, '\n');
        if (cached) {
            this.ZenTaoInfo = {
                ...cached,
            };
            if (!(await this.verifyTokenEffective(cached.token))) {
                this.ZenTaoInfo.token = '';
                throw new Error('Token 无效或已过期.\n');
            }
            this.ZenTaoInfo.token = cached.token;
            await this.setTokenHeader(cached.token);
            return true;
        }
        throw new Error('禅道账户缓存信息不存在，请先登录。\n');
    }

    // 验证token状态
    async verifyTokenEffective(token) {
        try {
            await this.axios.get('/user', {
                headers: { Token: token },
            });
            return true;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.error('Token 无效或已过期');
                return false;
            }
        }
    }

    async login(account, password) {
        const resp = await this.axios.post(
            '/tokens',
            { account, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        const data = resp.data || {};
        const session = {
            token: data.token,
            account,
            password,
        };
        await this.cache.writeSession(session);
        await this.setTokenHeader(session.token);
        this.ZenTaoInfo = {
            ...this.ZenTaoInfo,
            token: session.token,
            account,
            password,
        };

        return session;
    }

    async logout() {
        await this.cache.clear();
        delete this.axios.defaults.headers.common['Authorization'];
    }

    // 获取产品列表
    async getProduct() {
        const res = await this.axios.get('/products?limit=9999&page=1');
        const products = res.data.products || [];
        const handledProducts = products.map((item) => {
            const { id, name } = item;
            return {
                id,
                name,
            };
        });
        const productInfo = await selectProducts(handledProducts);
        this.ZenTaoInfo = {
            ...this.ZenTaoInfo,
            productId: productInfo.id,
            productName: productInfo.name,
        };
        await this.cache.writeSession(this.ZenTaoInfo);
        console.log('选择的产品:', this.ZenTaoInfo.productId, this.ZenTaoInfo.productName);
    }

    // 获取bug列表
    async getBugs() {
        const res = await this.axios.get(`/products/${this.ZenTaoInfo.productId}/bugs?limit=9999&page=1`);
        return res.data?.bugs || [];
    }
}

module.exports = ZenTaoClient;
