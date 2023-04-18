const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

// GET route
router.get("/user/:username", (req, res) => {
  const username = req.params.username
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

router.post('/createCategories', (req, res) => {
  let category = req.body.category;
  let budgetId = req.body.id;
  const queryText = `INSERT INTO "categories" ("name", "budgetAmount", "budgetId")
  VALUES ($1, $2, $3);`;

  // first try

  // categories.map(category => {
  //   pool
  //   .query(queryText, [category.name, category.budgetAmount, budgetId])
  //   .then((result) => {
  //     res.sendStatus(201);
  //   })
  //   .catch((err) => {
  //     console.log("Category creation failed: ", err);
  //     res.sendStatus(500);
  //   });
  // })

  
    pool
    .query(queryText, [category.name, category.budgetAmount, budgetId])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Category creation failed: ", err);
      res.sendStatus(500);
    });
})

module.exports = router;
