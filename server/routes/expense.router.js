const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * POST route template
 */
router.post("/", rejectUnauthenticated, (req, res) => {
  const newExpense = req.body;
  const userId = req.user.id;
  const sqlText = `
    INSERT INTO "expenses" ("categoryId", "userId", "budget_id", "amount", "name")
    VALUES ($1, $2, $3, $4, $5)
  `;
  // console.log("in expense post request");

  pool
    .query(sqlText, [
      newExpense.categoryId,
      userId,
      newExpense.budgetId,
      newExpense.amount,
      newExpense.name,
    ])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("Post request for new expense failed: ", err);
      res.sendStatus(500);
    });
});

router.delete("/deleteAll/:id", rejectUnauthenticated, (req, res) => {
  const budgetId = req.params.id;

  const sqlText = `
    DELETE FROM "expenses" WHERE "budget_id" = $1;
  `;

  pool
    .query(sqlText, [budgetId])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Delete request for all expenses failed:", error);
      res.sendStatus(500);
    });
});

// delete request using post to have access to req.body
router.post("/delete", rejectUnauthenticated, (req, res) => {
  // console.log('req.body:',req.body);

  // dynamically generate sql text depending on number of ids in req.body
  const sqlText = `
    DELETE FROM "expenses" WHERE "id" IN (${req.body.map((id, i) => {
      return `$${i + 1}`;
    })});
  `;

  pool
    .query(sqlText, req.body)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Delete request for expense failed:", error);
      res.sendStatus(500);
    });
});

router.delete("/deleteByCategory/:id", rejectUnauthenticated, (req, res) => {
  const idToDelete = req.params.id;

  const sqlText = `
    DELETE FROM "expenses" WHERE "categoryId" = $1;
  `;

  pool
    .query(sqlText, [idToDelete])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Delete request for expense by category failed:", error);
      res.sendStatus(500);
    });
});

router.put("/update/:id", rejectUnauthenticated, (req, res) => {
  const expenseToUpdate = req.body;
  console.log("Req.body as expenseToUpdate", expenseToUpdate);
  let sqlText = ``;

  if (expenseToUpdate.columnToUpdate === "amount") {
    sqlText = `    
      UPDATE "expenses" 
      SET "amount" = ($1)
      WHERE "id" = ($2)
      ;`;
  } else {
    sqlText = `    
      UPDATE "expenses" 
      SET "name" = ($1)
      WHERE "id" = ($2)
    ;`;
  }
  console.log("Sqltext after alteration", sqlText);
  pool
    .query(sqlText, [expenseToUpdate.value, expenseToUpdate.id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Update request for expense failed:", error);
      res.sendStatus(500);
    });
});

router.get("/allGroupExpenses/:id", rejectUnauthenticated, (req, res) => {
  const budgetId = req.params.id;
  const sqlText = ` 
    SELECT "expenses".id, "expenses".name AS "expenseName", "expenses".amount, "categories".name AS "categoryName", 
    "user".username FROM "expenses"
    JOIN "categories" ON "categories".id = "expenses"."categoryId"
    JOIN "user" ON "user".id = "expenses"."userId"
    WHERE "budget_id" = $1
    ORDER BY "expenses".id DESC;
  ;`;

  pool
    .query(sqlText, [budgetId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("get request for /allGroupexpenses failed:", error);
      res.sendStatus(500);
    });
});

module.exports = router;
