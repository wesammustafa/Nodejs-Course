// index.js — In-Memory Task Manager
const args = process.argv.slice(2);
const command = args[0];

// In-memory store (resets on each run)
const tasks = [];

function addTask(title) {
  tasks.push({ id: tasks.length + 1, title, done: false });
  console.log(`Task added: "${title}"`);
}

function listTasks() {
  if (tasks.length === 0) {
    console.log("No tasks yet.");
    return;
  }
  tasks.forEach((t) => {
    const status = t.done ? "✓" : "○";
    console.log(`[${status}] ${t.id}. ${t.title}`);
  });
}

// Route commands
if (command === "add") {
  const title = args.slice(1).join(" ");
  if (!title) {
    console.error("Usage: node index.js add <task title>");
    process.exit(1);
  }
  addTask(title);
} else if (command === "list") {
  listTasks();
} else {
  console.log("Commands: add <title> | list");
}