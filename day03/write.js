const fs = require("fs");

fs.writeFile("data.txt", "Mohamed Ali", "utf8", (err) => {
  if (err) {
    console.error("Write failed:", err.message);
    return;
  }
  console.log("File written successfully");
});
