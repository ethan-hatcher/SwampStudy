// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;
const USERS_PATH = "./users.json";

// Ensure users.json exists
if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, "[]");

app.use(express.json());
app.use(express.static("public")); // serves index.html, home.html

// Helpers to read/write the "database"
function readUsers() {
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  return JSON.parse(raw);
}
function writeUsers(arr) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(arr, null, 2));
}

// --- API: Sign up ---
app.post("/api/signup", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = (req.body?.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  const users = readUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: "username already exists" });
  }

  users.push({ username, password }); // demo only (plain text)
  writeUsers(users);
  res.json({ ok: true, username });
});

// --- API: Log in ---
app.post("/api/login", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = (req.body?.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }

  const users = readUsers();
  const match = users.find(u => u.username === username && u.password === password);
  if (!match) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  // For demo: we don't create a real session—front end will store the username
  res.json({ ok: true, username });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
