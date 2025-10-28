// app.js
import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// database file
const USERS_PATH = "./users.json";
if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, "[]");

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
}

function writeUsers(arr) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(arr, null, 2));
}

// signup route
app.post("/api/signup", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = (req.body?.password || "").trim();

  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  const users = readUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: "username already exists" });
  }

  users.push({ username, password });
  writeUsers(users);
  res.json({ ok: true, username });
});

// login route
app.post("/api/login", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = (req.body?.password || "").trim();

  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  const users = readUsers();
  const match = users.find(u => u.username === username && u.password === password);
  if (!match) return res.status(401).json({ error: "invalid credentials" });

  res.json({ ok: true, username });
});

export default app;
export { USERS_PATH };