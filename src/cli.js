#!/usr/bin/env node
const minimist = require('minimist');
const { cmdCommit } = require('./commands/commit');
const { gitStatus, gitPull, gitPush } = require('./utils/git');
const { promptLogin } = require('./ui/prompts');
const ZenTaoClient = require('./services/zentaoClient');

process.env.ZENTAO_BASE_URL = 'https://rizentao.gientech.com/api.php/v1';

async function main() {
    const argv = minimist(process.argv.slice(2));
    const cmd = argv._[0];

    try {
        switch (cmd) {
            case 'commit':
                await cmdCommit(process.env.ZENTAO_BASE_URL || 'https://rizentao.gientech.com/api.php/v1');
                break;
            case 'status': {
                const res = await gitStatus();
                console.log(res.stdout || res.stderr);
                break;
            }
            case 'pull': {
                const res = await gitPull(argv.remote || 'origin', argv.branch || 'main');
                console.log(res.stdout || res.stderr);
                break;
            }
            case 'push': {
                const res = await gitPush(argv.remote || 'origin', argv.branch || 'main');
                console.log(res.stdout || res.stderr);
                break;
            }
            case 'login': {
                const base = process.env.ZENTAO_BASE_URL || 'https://rizentao.gientech.com/api.php/v1';
                const cred = await promptLogin();
                const client = new ZenTaoClient(base);
                await client.login(cred.account, cred.password);
                console.log('登录成功.');
                break;
            }
            case 'logout': {
                const base = process.env.ZENTAO_BASE_URL || 'https://rizentao.gientech.com/api.php/v1';
                const client = new ZenTaoClient(base);
                await client.logout();
                console.log('登出成功.');
                break;
            }
            default:
                console.log('Usage: zg <commit|status|pull|push|login|logout> [--args]');
        }
    } catch (err) {
        console.error('Error:', err && err.message ? err.message : err);
        process.exit(1);
    }
}

main();
