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
    SELECT "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget", 
    (SELECT COUNT(DISTINCT "user".id) FROM "user_groups" JOIN "user" ON "user".id = user_groups."userId"
    WHERE "user_groups"."groupsId" = "groups".id) AS "totalMembers",
    (SELECT array_agg(DISTINCT "user".username) FROM "user_groups" JOIN "user" ON "user".id = user_groups."userId"
    WHERE "user_groups"."groupsId" = "groups".id) AS "members"
    FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "groups".id = $2 AND "user".id = $1
    GROUP BY "groups".id, "budget".id, "budget"."totalBudget";
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
router.get("/user/:username", rejectUnauthenticated, (req, res) => {
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
    SELECT "user_groups"."groupsId" AS "groupId", 
    "groups".name AS "name",
    "budget"."totalBudget" AS "totalBudget",
    "budget".id,
    ARRAY_AGG(DISTINCT "user".username) AS "members",
    sum(expenses.amount / 2) AS "totalSpent"
    FROM "user_groups"
    INNER JOIN "groups" ON "user_groups"."groupsId" = "groups".id
    LEFT JOIN "user" ON "user_groups"."userId" = "user".id
    INNER JOIN "budget" ON "budget".id = "groups"."budgetId"
    LEFT JOIN "expenses" ON "expenses".budget_id = "budget".id
    WHERE "user_groups"."groupsId" IN (
    SELECT "groupsId" FROM "user_groups" WHERE "userId" = $1 -- replace 123 with the desired user id
    )
    GROUP BY "user_groups"."groupsId", "groups".name, "totalBudget", "budget".id;
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
router.post("/createBudget", rejectUnauthenticated, (req, res) => {
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
router.post("/createGroup", rejectUnauthenticated, (req, res) => {
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
router.post("/createUserGroup", rejectUnauthenticated, (req, res) => {
  const queryText = `INSERT INTO "user_groups" ("userId", "groupsId")
  VALUES  ($1, $2)`;

  // console.log('Req.body:', req.body)

  pool
    .query(queryText, [req.body.userId, req.body.groupId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Group creation failed: ", err);
      res.sendStatus(500);
    });
});

router.post("/createCategories", rejectUnauthenticated, (req, res) => {
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

router.put("/update/:id", rejectUnauthenticated, (req, res) => {
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

router.delete("/delete", rejectUnauthenticated, async (req, res) => {
  const groupInfo = req.body;
  console.log(groupInfo)

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `DELETE FROM expenses WHERE "categoryId" IN (
        SELECT id FROM categories WHERE categories."budgetId" IN (
          SELECT groups."budgetId" FROM groups WHERE groups.id = $1
        )
      )`,
      [groupInfo.groupId]
    );

    await client.query(
      `DELETE FROM categories WHERE categories."budgetId" IN (
        SELECT groups."budgetId" FROM groups WHERE groups.id = $1
      )`,
      [groupInfo.groupId]
    );

    await client.query(
      `DELETE FROM "user_groups" WHERE "user_groups"."groupsId" = $1`,
      [groupInfo.groupId]
    );

    await client.query("DELETE FROM groups WHERE groups.id = $1", [
      groupInfo.groupId
    ]);

    await client.query("DELETE FROM budget WHERE budget.id = $1", [
      groupInfo.budgetId
    ]);

    await client.query("COMMIT");
    res.sendStatus(200);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to delete group: ", err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});






module.exports = router;
