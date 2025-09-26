const ZenTaoClient = require('../src/services/zentaoClient');
const CacheService = require('../src/services/cache');

async function refreshLoginCache() {
  const account = process.env.ZENTAO_ACCOUNT;
  const password = process.env.ZENTAO_PASSWORD;
  const baseUrl = process.env.ZENTAO_BASE_URL || 'https://zentao.example.com';

  if (!account || !password) {
    console.error('ZENTAO_ACCOUNT and ZENTAO_PASSWORD environment variables are required.');
    process.exit(1);
  }

  const client = new ZenTaoClient(baseUrl);
  const cache = new CacheService();

  try {
    const session = await client.login(account, password);
    await cache.writeSession(session);
    console.log('Login cache refreshed successfully.');
  } catch (error) {
    console.error('Failed to refresh login cache:', error && error.message ? error.message : error);