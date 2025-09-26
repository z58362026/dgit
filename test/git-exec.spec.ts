import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Git Execution', () => {
    it('should execute git commit command', async () => {
        const message = 'Test commit';
        const { stdout, stderr } = await execAsync(`git commit -m "${message}"`);
        expect(stderr).toBe('');
        expect(stdout).toContain('[master (root-commit)]');
    });

    it('should execute git status command', async () => {
        const { stdout, stderr } = await execAsync('git status');
        expect(stderr).toBe('');
        expect(stdout).toContain('On branch');
    });

    it('should execute git pull command', async () => {
        const { stdout, stderr } = await execAsync('git pull');
        expect(stderr).toBe('');
        expect(stdout).toContain('Already up to date.');
    });

    it('should execute git push command', async () => {
        const { stdout, stderr } = await execAsync('git push');
        expect(stderr).toBe('');
        expect(stdout).toContain('Everything up-to-date');
    });
});