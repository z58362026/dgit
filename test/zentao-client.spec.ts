import { ZenTaoClient } from '../src/lib/zentao-client';

describe('ZenTaoClient', () => {
    let client: ZenTaoClient;

    beforeAll(() => {
        client = new ZenTaoClient('username', 'password');
    });

    it('should login successfully', async () => {
        const loginResponse = await client.login();
        expect(loginResponse).toHaveProperty('success', true);
    });

    it('should fetch bug list', async () => {
        await client.login();
        const bugList = await client.getBugList();
        expect(Array.isArray(bugList)).toBe(true);
    });

    it('should cache login session', async () => {
        await client.login();
        const cachedSession = client.getCachedSession();
        expect(cachedSession).toHaveProperty('username', 'username');
    });

    it('should handle API errors gracefully', async () => {
        client = new ZenTaoClient('invalidUser', 'invalidPass');
        await expect(client.login()).rejects.toThrow('Login failed');
    });
});