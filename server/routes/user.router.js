const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

router.get("/allUsers", rejectUnauthenticated, (req, res) => {
  const sqlText = `SELECT "user".username, "user".id FROM "user"`;

  pool
    .query(sqlText)
    .then((response) => {
      res.send(response.rows);
    })
    .catch((error) => {
      console.log("Error in /allUsers route", error);
      res.sendStatus(500);
    });
});

router.put("/updateUser", rejectUnauthenticated, (req, res) => {
  const userInfo = req.body;
  const userId = req.user.id;
  const password = encryptLib.encryptPassword(userInfo.password);
  const sqlText = `
    UPDATE "user"
    SET "username" = $1,
    "password" = $2
    WHERE "id" = $3
  ;`;

  pool
    .query(sqlText, [userInfo.username, password, userId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log("Error in /updateUser route", error);
      res.sendStatus(500);
    });
});

module.exports = router;
