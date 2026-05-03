const os = require('os');

console.log(os.platform()); // linux, 'darwin', 'win32'
console.log(os.arch()); // 'x64', 'arm64'
console.log(os.cpus().length); // number of CPU cores
console.log(os.freemem()); // free memory in bytes
console.log(os.homedir()); // /home/wesam

