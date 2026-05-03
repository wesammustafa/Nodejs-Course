const fs = require("fs");

console.log("Before read");

const data = fs.readFileSync("users", "utf8");
// BLOCKS here until file is fully read
console.log(data);

console.log("After read");
