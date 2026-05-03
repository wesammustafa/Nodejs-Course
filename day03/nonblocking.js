const fs = require("fs");

console.log("Before read");

fs.readFile("users", "utf8", (err, data) => {
  // Called LATER, when the file is ready
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log(data);
});

console.log("After read"); // Runs BEFORE file is done!
