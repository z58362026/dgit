const inquirer = require('inquirer');

async function selectCommitCategory() {
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Commit 类型:',
            choices: [
                { name: '需求', value: 'requirement' },
                { name: 'Bug', value: 'bug' },
            ],
        },
    ]);
    return ans.type;
}

async function selectProducts(product) {
    const choices = (product || []).map((b) => ({ name: `#${b.id} ${b.name}`, value: { id: b.id, name: b.name } }));
    const ans = await inquirer.prompt([{ type: 'list', name: 'productInfo', message: '请选择 产品:', choices }]);
    return ans.productInfo || { id: null, name: '' };
}

async function confirmLastProduct(message) {
    const ans = await inquirer.prompt([{ type: 'confirm', name: 'ok', message, default: true }]);
    return ans.ok;
}

async function selectBugs(bugs) {
    const choices = (bugs || []).map((b) => ({ name: `#${b.id} ${b.title}`, value: b.id }));
    const ans = await inquirer.prompt([
        { type: 'checkbox', name: 'ids', message: '请选择 bug（可多选）:', choices, pageSize: 15 },
    ]);
    return ans.ids || [];
}

async function selectProjects(project) {
    const choices = (project || []).map((b) => ({ name: `#${b.id} ${b.name}`, value: { id: b.id, name: b.name } }));
    const ans = await inquirer.prompt([{ type: 'list', name: 'projectInfo', message: '请选择 项目:', choices }]);
    return ans.projectInfo || { id: null, name: '' };
}

async function confirmLastProject(message) {
    const ans = await inquirer.prompt([{ type: 'confirm', name: 'ok', message, default: true }]);
    return ans.ok;
}

async function selectStories(stories) {
    const choices = (stories || []).map((b) => ({ name: `#${b.id} ${b.title}`, value: b.id }));
    const ans = await inquirer.prompt([{ type: 'list', name: 'story', message: '请选择 需求:', choices }]);
    return ans.story || '';
}

async function inputMessage(defaultMsg = '') {
    const ans = await inquirer.prompt([
        { type: 'input', name: 'msg', message: '请完善 commit 信息:', default: defaultMsg },
    ]);
    return ans.msg || '';
}

async function confirmProceed(message) {
    const ans = await inquirer.prompt([{ type: 'confirm', name: 'ok', message, default: true }]);
    return ans.ok;
}

async function promptLogin(defaultAccount = '') {
    const ans = await inquirer.prompt([
        { type: 'input', name: 'account', message: '禅道 账号:', default: defaultAccount },
        { type: 'password', name: 'password', message: '禅道 密码:' },
    ]);
    return ans;
}

module.exports = {
    selectCommitCategory,
    selectProducts,
    confirmLastProduct,
    selectBugs,
    selectProjects,
    confirmLastProject,
    selectStories,
    inputMessage,
    confirmProceed,
    promptLogin,
};
