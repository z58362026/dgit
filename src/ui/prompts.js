const inquirer = require('inquirer');

async function selectCommitCategory() {
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'Commit type:',
            choices: [
                { name: 'Requirement', value: 'requirement' },
                { name: 'Bug', value: 'bug' },
            ],
        },
    ]);
    return ans.type;
}

async function selectBugs(bugs) {
    const choices = (bugs || []).map((b) => ({ name: `#${b.id} ${b.title}`, value: b.id }));
    const ans = await inquirer.prompt([
        { type: 'checkbox', name: 'ids', message: 'Select bugs:', choices, pageSize: 15 },
    ]);
    return ans.ids || [];
}

async function inputMessage(defaultMsg = '') {
    const ans = await inquirer.prompt([
        { type: 'input', name: 'msg', message: 'Additional commit message:', default: defaultMsg },
    ]);
    return ans.msg || '';
}

async function confirmProceed(message) {
    const ans = await inquirer.prompt([{ type: 'confirm', name: 'ok', message, default: true }]);
    return ans.ok;
}

async function promptLogin(defaultAccount = '') {
    const ans = await inquirer.prompt([
        { type: 'input', name: 'account', message: 'ZenTao account:', default: defaultAccount },
        { type: 'password', name: 'password', message: 'ZenTao password:' },
    ]);
    return ans;
}

module.exports = { selectCommitCategory, selectBugs, inputMessage, confirmProceed, promptLogin };
