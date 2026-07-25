const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'login_url.log');
fs.writeFileSync(logFile, '--- START ---\n');

const cliBin = path.join(__dirname, 'node_modules', 'zcatalyst-cli', 'lib', 'bin', 'catalyst.js');

const child = spawn(process.execPath, [cliBin, 'login'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
    const str = data.toString();
    fs.appendFileSync(logFile, 'STDOUT: ' + str + '\n');
    if (str.includes('CLI usage metadata')) {
        child.stdin.write('Y\n');
    }
    if (str.includes('CLI error reporting')) {
        child.stdin.write('Y\n');
    }
    if (str.includes('datacenter')) {
        setTimeout(() => {
            child.stdin.write('\u001b[B');
            setTimeout(() => {
                child.stdin.write('\u001b[B');
                setTimeout(() => {
                    child.stdin.write('\n');
                }, 300);
            }, 300);
        }, 500);
    }
});

child.stderr.on('data', (data) => {
    fs.appendFileSync(logFile, 'STDERR: ' + data.toString() + '\n');
});

child.on('exit', (code) => {
    fs.appendFileSync(logFile, 'EXIT: ' + code + '\n');
});
