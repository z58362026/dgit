const { spawn } = require('child_process');

function runGit(args) {
    return new Promise((resolve) => {
        const p = spawn('git', args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';
        p.stdout.on('data', (d) => (stdout += d.toString()));
        p.stderr.on('data', (d) => (stderr += d.toString()));
        p.on('close', (code) => resolve({ stdout: stdout.trim(), stderr: stderr.trim(), code }));
    });
}

const gitStatus = () => runGit(['status', '--porcelain', '--branch']);
const gitPull = (remote = 'origin', branch = 'main') => runGit(['pull', remote, branch]);
const gitPush = (remote = 'origin', branch = 'main') => runGit(['push', remote, branch]);
const gitCommit = (message) => runGit(['commit', '-m', message]);
const gitAddAll = () => runGit(['add', '-A']);

const gitHasChanges = async () => {
    const res = await runGit(['status', '--porcelain']);
    return Boolean(res.stdout && res.stdout.trim().length > 0);
};

module.exports = { gitStatus, gitPull, gitPush, gitCommit, gitAddAll, gitHasChanges };
