const path = require('path');

const file = '/users/wesam/projects/app/index.js';

console.log(path.basename(file)); // index.js
console.log(path.dirname(file)); // /users/wesam/projects/app
console.log(path.extname(file)); // .js
console.log(path.join("src", "util", "helper.js")); // src/utils/helper.js

console.log(__dirname); // /Users/wesam/Workspace/nodejs/day02

