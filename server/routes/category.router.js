const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

/**
 * GET route template
 */
router.get("/:id", (req, res) => {
  const budgetId = req.params.id;
  console.log("budgetId in category get request:", budgetId);
  // console.log("in expenses get request, budgetid:", budgetId);

  const sqlText = `
    SELECT "categories".id, "categories".name, "categories"."budgetAmount",
      CASE 
        WHEN COUNT("expenses".id) > 0 
        THEN JSON_AGG(JSON_BUILD_OBJECT(
              'expenseCategoryId', "expenses"."categoryId",
              'expenseName',"expenses".name, 
              'expenseAmount',"expenses".amount,
              'userId', "user".id,
              'username', "user".username,
              'id', "expenses".id
            )) 
        ELSE '[]'::json
      END AS "expenses"
    FROM "categories"
    LEFT JOIN "expenses" ON "expenses"."categoryId" = "categories".id
    LEFT JOIN "user" ON "user".id = "expenses"."userId"
    WHERE "categories"."budgetId" = $1
    GROUP BY "categories".id, "categoryId", "categories".name, "categories"."budgetAmount"
    ORDER BY "categories".id;
  `;

  pool
    .query(sqlText, [budgetId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Post request for new expense failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * POST route template
 */
router.post("/", (req, res) => {
  const newCategory = req.body;
  console.log(newCategory);
  const sqlText = `INSERT INTO "categories" ("name", "budgetAmount", "budgetId")
  VALUES ($1, $2, $3);`;

  pool
    .query(sqlText, [
      newCategory.name,
      newCategory.amount,
      newCategory.budgetId,
    ])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Get request for user budget failed: ", err);
      res.sendStatus(500);
    });
});

router.delete("/delete/:id", (req, res) => {
  const idToDelete = req.params.id;

  const sqlText = `
    DELETE FROM "categories" WHERE "id" = $1;
  ;`;

  pool
    .query(sqlText, [idToDelete])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Delete category request failed:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
