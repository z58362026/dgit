const { gitStatus } = require('../utils/git');

async function status() {
    try {
        const result = await gitStatus();
        return result;
    } catch (error) {
        throw new Error(`Failed to get git status: ${error && error.message ? error.message : error}`);
    }
}

module.exports = { status };
