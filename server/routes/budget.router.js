const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET route template
 */
router.get("/:id", rejectUnauthenticated, (req, res) => {
  const groupId = req.params.id;
  const sqlText = `
    SELECT "categories".name AS "categoryName", "categories"."budgetAmount" FROM "budget"
    JOIN "categories" ON "categories"."budgetId" = "budget".id
    JOIN "groups" ON "groups"."budgetId" = "budget".id
    WHERE "groups".id = $1;
  `;

  pool
    .query(sqlText, [groupId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("Get request for user budget failed: ", err);
      res.sendStatus(500);
    });
});

router.put("/update/:id", rejectUnauthenticated, (req, res) => {
  const updatedBudget = req.body
  const budgetId = req.params.id;
  const sqlText = `
    UPDATE "budget"
    SET "totalBudget" = $1
    WHERE "id" = $2;
  `;

  pool
    .query(sqlText, [updatedBudget.totalBudget, budgetId])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log("Failed to updated totalBudget:", err);
      res.sendStatus(500);
    });
});

module.exports = router;
