const {
    selectCommitCategory,
    confirmLastProduct,
    confirmLastProject,
    selectBugs,
    selectStories,
    inputMessage,
    confirmProceed,
    promptLogin,
} = require('../ui/prompts');
const ZenTaoClient = require('../services/zentaoClient');
const { gitAddAll, gitCommit, gitHasChanges } = require('../utils/git');

async function cmdCommit(baseUrl) {
    const hasChanges = await gitHasChanges();
    if (!hasChanges) {
        console.log('No changes to commit.');
        return;
    }

    // 登录
    const client = new ZenTaoClient(baseUrl);
    try {
        await client.loadCachedSession();
        // 判断是否继续使用当前账号
        const ok = await confirmProceed(`是否继续使用当前账号 #${client.ZenTaoInfo.account}?`);
        if (!ok) {
            console.log('\n请登录新的账号');
            const cred = await promptLogin();
            try {
                await client.login(cred.account, cred.password);
                console.log('登录成功\n');
            } catch (e) {
                console.error('登陆失败:', e && e.message ? e.message : e);
                return;
            }
        }
    } catch (err) {
        console.warn('\n需要登录禅道获取bug列表,尝试使用已保存账号自动登录\n');
        try {
            await client.login(client.ZenTaoInfo.account, client.ZenTaoInfo.password);
            console.log('已保存账号自动登录成功\n');
            // 判断是否继续使用当前账号
            const ok = await confirmProceed(`是否继续使用当前账号 #${client.ZenTaoInfo.account}?`);
            if (!ok) {
                console.log('\n请登录新的账号');
                const cred = await promptLogin();
                try {
                    await client.login(cred.account, cred.password);
                    console.log('登录成功\n');
                } catch (e) {
                    console.error('登陆失败:', e && e.message ? e.message : e);
                    return;
                }
            }
        } catch (e) {
            console.error('已保存账号登陆失败，请重新输入\n');
            const cred = await promptLogin(client.ZenTaoInfo.account || '');
            try {
                await client.login(cred.account, cred.password);
                console.log('登录成功\n');
            } catch (e) {
                console.error('登陆失败:', e && e.message ? e.message : e);
                return;
            }
        }
    }

    const category = await selectCommitCategory();
    const payload = { category, issueIds: [], message: '' };

    if (category === 'bug') {
        let bugs;
        // 判断是否需要获取新产品
        const needsNewProduct =
            !client.ZenTaoInfo.productId ||
            !(await confirmLastProduct(
                `是否继续使用产品 #${client.ZenTaoInfo.productId} ${client.ZenTaoInfo.productName} 获取 bug 列表?`,
            ));
        // 需要时获取新产品
        if (needsNewProduct) {
            await client.getProduct();
        }
        // 获取bug列表
        bugs = await client.getBugs();

        if (!bugs || bugs.length === 0) {
            console.log('当前产品下无bug.');
        } else {
            const ids = await selectBugs(bugs);
            payload.issueIds = ids;
        }
    } else {
        let stories;
        // 判断是否需要获取新项目
        const needsNewProject =
            !client.ZenTaoInfo.projectId ||
            !(await confirmLastProject(
                `是否继续使用项目 #${client.ZenTaoInfo.projectId} ${client.ZenTaoInfo.projectName} 获取 需求 列表?`,
            ));
        // 需要时获取新产品
        if (needsNewProject) {
            await client.getProject();
        }
        // 获取需求列表
        stories = await client.getStories();

        if (!stories || stories.length === 0) {
            console.log('当前项目下无需求.');
        } else {
            const id = await selectStories(stories);
            payload.issueIds = [id];
        }
    }

    const custom = (await inputMessage('commit 信息')).trim();
    payload.message = custom;

    const headerPrefix = category === 'bug' ? 'fix' : 'feat';
    const headerIds = payload.issueIds.length ? payload.issueIds.join(',') : '10000';
    const commitMsg = `${headerPrefix}:[${headerIds}] ${payload.message}`;

    const ok = await confirmProceed(`commit 信息预览:\n${commitMsg}\n\n确认提交?`);
    if (!ok) return;

    await gitAddAll();
    const result = await gitCommit(`${commitMsg}`);
    if (result.code === 0) {
        console.log('提交成功');
    } else {
        console.error('提交失败', result.stderr || result.stdout);
    }
}

module.exports = { cmdCommit };
