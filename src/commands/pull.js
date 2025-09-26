const { gitPull } = require('../utils/git');

async function pull(remote = 'origin', branch = 'main') {
    try {
        const res = await gitPull(remote, branch);
        console.log(res.stdout || res.stderr);
    } catch (err) {
        console.error('Error executing git pull:', err && err.message ? err.message : err);
    }
}

module.exports = { pull };
