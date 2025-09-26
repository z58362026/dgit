const { selectCommitCategory, selectBugs, inputMessage, confirmProceed, promptLogin } = require('../ui/prompts');
const ZenTaoClient = require('../services/zentaoClient');
const { gitAddAll, gitCommit, gitHasChanges } = require('../utils/git');

async function cmdCommit(baseUrl) {
    const hasChanges = await gitHasChanges();
    if (!hasChanges) {
        console.log('No changes to commit.');
        return;
    }

    const category = await selectCommitCategory();
    const payload = { category, issueIds: [], message: '' };

    if (category === 'bug') {
        const client = new ZenTaoClient(baseUrl);
        let bugs;
        try {
            await client.loadCachedSession();
            bugs = await client.getBugs();
        } catch (err) {
            console.warn('Need to login to ZenTao to fetch bugs.');
            const cred = await promptLogin(process.env.ZENTAO_ACCOUNT || '');
            try {
                await client.login(cred.account, cred.password);
                bugs = await client.getBugs();
            } catch (e) {
                console.error('Login or fetching bugs failed:', e && e.message ? e.message : e);
                return;
            }
        }

        if (!bugs || bugs.length === 0) {
            console.log('No bugs returned from ZenTao.');
            const cont = await confirmProceed('Continue commit without bug ids?');
            if (!cont) return;
        } else {
            const ids = await selectBugs(bugs);
            payload.issueIds = ids;
        }
    } else {
        const idsInput = await inputMessage('enter requirement ids separated by comma (e.g. 123,456)');
        payload.issueIds = idsInput
            .split(',')
            .map((s) => parseInt(s.trim(), 10))
            .filter(Boolean);
    }

    const custom = (await inputMessage('commit message body')).trim();
    payload.message = custom;

    const headerPrefix = category === 'bug' ? 'BUG' : 'REQ';
    const headerIds = payload.issueIds.length ? payload.issueIds.join(',') : '0';
    const firstLine = payload.message.split('\n')[0] || '';
    const header = `[${headerPrefix}:${headerIds}] ${firstLine}`;

    const ok = await confirmProceed(
        `Will commit with header:\n${header}\n\nMessage body preview:\n${payload.message}\nProceed?`,
    );
    if (!ok) return;

    await gitAddAll();
    const result = await gitCommit(`${header}\n\n${payload.message}`);
    if (result.code === 0) {
        console.log('Commit successful');
    } else {
        console.error('Commit failed', result.stderr || result.stdout);
    }
}

module.exports = { cmdCommit };
