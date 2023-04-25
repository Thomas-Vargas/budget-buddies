const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/currentGroup/:id", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const groupId = req.params.id;

  const sqlText = `
    SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "user".id = $1 AND "groups".id = $2;
  `;

  pool
    .query(sqlText, [userId, groupId])
    .then((result) => {
      // console.log(result.rows)
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// GET route
router.get("/user/:username", (req, res) => {
  const username = req.params.username;
  const sqlText = `SELECT * FROM "user" WHERE "username" = $1`;
  // console.log('req.params.username:' , username);

  pool
    .query(sqlText, [username])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

router.get("/userGroups", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const sqlText = `
    SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "user".id = $1;
  `;

  pool
    .query(sqlText, [userId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * POST route template
 */
//create budget
router.post("/createBudget", (req, res) => {
  const newBudget = req.body;
  console.log(req.body);
  const queryText = `INSERT INTO "budget" ("totalBudget")
  VALUES ($1) RETURNING "id"`;

  pool
    .query(queryText, [newBudget.totalBudget])
    .then((result) => {
      // console.log('Post result:', result.rows)
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Budget creation failed: ", err);
      res.sendStatus(500);
    });
});

//create group
router.post("/createGroup", (req, res) => {
  const newGroup = req.body;
  const queryText = `INSERT INTO "groups" ("name", "budgetId")
  VALUES ($1, $2) RETURNING "id"`;

  pool
    .query(queryText, [newGroup.name, newGroup.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Group creation failed: ", err);
      res.sendStatus(500);
    });
});

//create user_group
router.post("/createUserGroup", (req, res) => {
  const queryText = `INSERT INTO "user_groups" ("userId", "groupsId")
  VALUES  ($2, $1), ($3, $1);`;

  // console.log('Req.body:', req.body)

  pool
    .query(queryText, [req.body.groupId, req.body.userId, req.user.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Group creation failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/createCategories", (req, res) => {
  let category = req.body.category;
  let budgetId = req.body.id;
  const queryText = `INSERT INTO "categories" ("name", "budgetAmount", "budgetId")
  VALUES ($1, $2, $3);`;

  pool
    .query(queryText, [category.name, category.budgetAmount, budgetId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Category creation failed: ", err);
      res.sendStatus(500);
    });
});

router.put("/update/:id", (req, res) => {
  console.log(req.body)
  let editedGroup = req.body;
  let groupId = req.body.id;
  const queryText = `
    UPDATE "groups"
    SET "name" = $1
    WHERE "id" = $2;
  `;

  pool
    .query(queryText, [editedGroup.name, groupId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Failed to update group name: ", err);
      res.sendStatus(500);
    });
})

module.exports = router;
