const fs = require("fs");

fs.appendFile("logs.txt", "bad input from user 2\n", "utf8", (err) => {
  if (err) console.error(err.message);
});
