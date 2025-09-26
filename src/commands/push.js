const { gitPush } = require('../utils/git');

async function push(remote = 'origin', branch = 'main') {
    try {
        const res = await gitPush(remote, branch);
        console.log(res.stdout || res.stderr);
    } catch (err) {
        console.error('Error during git push:', err && err.message ? err.message : err);
    }
}

module.exports = { push };
