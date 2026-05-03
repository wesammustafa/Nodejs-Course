const lodash = require('lodash');
const pretty = require('pretty');

const arr = [1, 2, 3, 4];
const str = "hello world";

console.log(lodash.isArray(str));
console.log(lodash.isArray(arr));

const html = `<!DOCTYPE html> <html lang="en"> <head> 
<meta charset="UTF-8"> <title>Home</title> 
</head> <body> This is content. </body> </html>
`

console.log(pretty(html));