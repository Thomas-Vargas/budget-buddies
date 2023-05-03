-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(255) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"avatar" VARCHAR(800)
);

CREATE TABLE "budget" (
	"id" SERIAL PRIMARY KEY,
	"totalBudget" INT
);

CREATE TABLE "groups"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(500),
	"budgetId" INT REFERENCES "budget" NOT NULL
);

CREATE TABLE "user_groups" (
	"id" SERIAL PRIMARY KEY,
	"userId" INT REFERENCES "user" NOT NULL,
	"groupsId" INT REFERENCES "groups" NOT NULL
);


CREATE TABLE "categories" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(255),
	"budgetAmount" INT,
	"budgetId" INT REFERENCES "budget" NOT NULL
);

CREATE TABLE "expenses" (
	"id" SERIAL PRIMARY KEY,
	"categoryId" INT REFERENCES "categories",
	"userId" INT REFERENCES "user",
	"budget_id" INT REFERENCES "budget",
	"amount" INT,
	"name" VARCHAR(255)
);

--everything below is either test data or test queries

INSERT INTO "user" ("username", "password", "avatar")
VALUES ('TESTUSER', 'TESTPW', 'TEST');

INSERT INTO "budget" ("totalBudget")
VALUES ('2000')
RETURNING "id";

INSERT INTO "groups" ("name", "budgetId")
VALUES ('Test group', 1);

INSERT INTO "user_group" ("userId", "groupsId")
VALUES(1, 1), (2, 1);

-- possibly pass this category a reference to the budget to distinguish which budgets have which categories
INSERT INTO "category" ("name", "budgetAmount")
VALUES ('Food', 400), ('Bills', 4000), ('Entertainment', 300);

INSERT INTO "expenses" ("categoryId", "userId", "budget_id", "amount", "name")
VALUES 
(1, 1, 1, 40, 'Chipotle'),
(1, 2, 1, 60, 'Thai'),
(2, 2, 1, 600, 'Car Payment');

--test queries
--select all users in given group
SELECT "user".username FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
WHERE user_groups."groupsId" = 1;

--join all
SELECT * FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
JOIN "budget" ON "budget".id = "groups"."budgetId"
JOIN "expenses" ON "expenses".budget_id = "budget".id
JOIN "categories" ON "categories".id = expenses."categoryId";

-- select users expenses
SELECT "user".username, "expenses".name ,"expenses".amount FROM "user" 
JOIN "expenses" ON "expenses"."userId" = "user".id
JOIN "categories" ON "categories".id = expenses."categoryId"
WHERE "user".id = 2;

SELECT * FROM "user" WHERE "username" = 'Thomas';

INSERT INTO "user_group" ("userId", "groupsId")
VALUES(1, 1), (2, 1);

SELECT "user".username, "user".id, "totalBudget", "categories".name, "categories"."budgetAmount" FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
JOIN "budget" ON "budget".id = "groups"."budgetId"
JOIN "categories" ON "categories"."budgetId" = "budget".id
WHERE user_groups."groupsId" = 33;

--select groups user is in
SELECT * FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
JOIN "budget" ON "budget".id = "groups"."budgetId"
JOIN "categories" ON "categories"."budgetId" = "budget".id
WHERE "user".id = 1;

SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
JOIN "budget" ON "budget".id = "groups"."budgetId"
WHERE "user".id = 1;

SELECT "categories".id, "categories".name AS "categoryName", "categories"."budgetAmount" FROM "budget"
JOIN "categories" ON "categories"."budgetId" = "budget".id
JOIN "groups" ON "groups"."budgetId" = "budget".id
WHERE "groups".id = 33; 

SELECT "categoryId", "expenses".name AS "expenseName", "expenses".amount AS "expenseAmount", "categories".name AS "categoryName", "categories"."budgetAmount" FROM "expenses"
JOIN "categories" ON "categories".id = "expenses"."categoryId"
WHERE "budget_id" = 56;

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
WHERE "categories"."budgetId" = 56
GROUP BY "categories".id, "categoryId", "categories".name, "categories"."budgetAmount"
ORDER BY "categories".id;

DELETE FROM "expenses" WHERE "id" IN (26, 49, 50);

UPDATE "expenses" 
SET "amount" = 1,
"name" = 'this is a test'
WHERE "id" = 70;

    SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "user".id = 1;


    SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "user".id = 1 AND "groups".id = 33;

SELECT "username" FROM "user";

SELECT "expenses".id, "expenses".name AS "expenseName", "expenses".amount, "categories".name AS "categoryName", 
"user".username FROM "expenses"
JOIN "categories" ON "categories".id = "expenses"."categoryId"
JOIN "user" ON "user".id = "expenses"."userId"
WHERE "budget_id" = 70
ORDER BY "expenses".id DESC;

SELECT "categories".name, sum("expenses".amount) AS "expenseTotal" FROM "categories"
JOIN "expenses" ON "expenses"."categoryId" = "categories".id
WHERE "expenses".budget_id = 70
GROUP BY "categories".name;

UPDATE "categories" 
SET "name" = $1,
"budgetAmount" = $2
WHERE "id" = $3;

UPDATE "budget"
SET "totalBudget" = $1
WHERE "id" = $2;

--requires both the groupId and budgetId
BEGIN;

-- Delete expenses related to the group
DELETE FROM expenses WHERE "categoryId" IN (
  SELECT id FROM categories WHERE categories."budgetId" IN (
    SELECT groups."budgetId" FROM groups WHERE groups.id = $1
  )
);

-- Delete categories related to the group
DELETE FROM categories WHERE categories."budgetId" IN (
  SELECT groups."budgetId" FROM groups WHERE groups.id = $1
);

-- Delete the user-group relationship records for the group
DELETE FROM "user_groups" WHERE "user_groups"."groupsId" = $1;

-- Delete the group itself
DELETE FROM groups WHERE groups.id = $1;


-- Delete the budget related to the group
DELETE FROM budget WHERE budget.id = $2;

COMMIT;


SELECT "user".username FROM "user"
JOIN "user_groups";

SELECT "user_groups"."groupsId" AS "groupId", 
       "groups".name AS "name",
       "budget"."totalBudget" AS "totalBudget",
       "budget".id,
       ARRAY_AGG(DISTINCT "user".username) AS "users",
       sum(expenses.amount / 2) AS "totalSpent"
FROM "user_groups"
INNER JOIN "groups" ON "user_groups"."groupsId" = "groups".id
LEFT JOIN "user" ON "user_groups"."userId" = "user".id
INNER JOIN "budget" ON "budget".id = "groups"."budgetId"
LEFT JOIN "expenses" ON "expenses".budget_id = "budget".id
WHERE "user_groups"."groupsId" IN (
  SELECT "groupsId" FROM "user_groups" WHERE "userId" = 1 -- replace 123 with the desired user id
)
GROUP BY "user_groups"."groupsId", "groups".name, "totalBudget", "budget".id;

    SELECT "user".id, "user".username, "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget" FROM "user_groups"
    JOIN "user" ON "user".id = user_groups."userId"
    JOIN "groups" ON "groups".id = user_groups."groupsId"
    JOIN "budget" ON "budget".id = "groups"."budgetId"
    WHERE "user".id = 1 AND "groups".id = 48;
    
SELECT "groups".id AS "groupId", "groups".name, "budget".id, "budget"."totalBudget", 
       (SELECT COUNT(DISTINCT "user".id) FROM "user_groups" JOIN "user" ON "user".id = user_groups."userId"
        WHERE "user_groups"."groupsId" = "groups".id) AS "totalMembers",
       (SELECT array_agg(DISTINCT "user".username) FROM "user_groups" JOIN "user" ON "user".id = user_groups."userId"
        WHERE "user_groups"."groupsId" = "groups".id) AS "members"
FROM "user_groups"
JOIN "user" ON "user".id = user_groups."userId"
JOIN "groups" ON "groups".id = user_groups."groupsId"
JOIN "budget" ON "budget".id = "groups"."budgetId"
WHERE "groups".id = 82 AND "user".id = 1
GROUP BY "groups".id, "budget".id, "budget"."totalBudget";





    
    








