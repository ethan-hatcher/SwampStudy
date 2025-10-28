// tests/basic.test.js
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import fs from "fs";
import app, { USERS_PATH } from "../app.js";

// Reset users.json before running tests
test("setup: clear users.json", () => {
  fs.writeFileSync(USERS_PATH, "[]");
  assert.ok(true);
});

// 1) New user can sign up
test("signup creates a new user", async () => {
  const res = await request(app)
    .post("/api/signup")
    .send({ username: "joel", password: "1234" })
    .expect(200);

  assert.equal(res.body.ok, true);
  assert.equal(res.body.username, "joel");
});

// 2) Duplicate signup is rejected
test("duplicate signup rejected (case-insensitive)", async () => {
  const res = await request(app)
    .post("/api/signup")
    .send({ username: "JOEL", password: "xxxx" })
    .expect(409);

  assert.match(res.body.error, /exists/i);
});

// 3) Login works for correct creds, fails for wrong
test("login success and failure", async () => {
  const ok = await request(app)
    .post("/api/login")
    .send({ username: "joel", password: "1234" })
    .expect(200);
  assert.equal(ok.body.ok, true);

  const bad = await request(app)
    .post("/api/login")
    .send({ username: "joel", password: "nope" })
    .expect(401);
  assert.match(bad.body.error, /invalid/i);
});