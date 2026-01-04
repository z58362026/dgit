const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const CACHE_FILE = path.join(os.homedir(), '.zentao-cli-cache.json');

class CacheService {
    async readSession() {
        try {
            const raw = await fs.readFile(CACHE_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            return parsed;
        } catch {
            return null;
        }
    }

    async writeSession(s) {
        await fs.writeFile(CACHE_FILE, JSON.stringify(s, null, 2), { mode: 0o600, encoding: 'utf8' });
    }

    async clear() {
        try {
            await fs.unlink(CACHE_FILE);
        } catch {}
    }
}

module.exports = CacheService;
