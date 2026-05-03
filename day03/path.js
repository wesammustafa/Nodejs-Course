const fs = require("fs");
const path = require("path");

// Always use path.join for safe file paths
const filePath = path.join(__dirname, "data.txt");
// __dirname "/users/wesam/..." + "data.txt"

console.log (filePath);

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    if (err.code === "ENOENT") {
      console.log("File does not exist yet");
    } else {
      console.error("Unexpected error:", err.message);
    }
    return;
  }
  console.log(data);
});
