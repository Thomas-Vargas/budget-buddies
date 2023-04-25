import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import BudgetCategoryTable from "../BudgetCategoryTable/BudgetCategoryTable";
import AddExpenseForm from "../AddExpenseForm/AddExpenseForm";
import AddCategoryForm from "../AddCategoryForm/AddCategoryForm";
import ActivityFeed from "../ActivityFeed/ActivtyFeed";

import "./GroupDashboard.css";

const GroupDashboard = () => {
  const groupId = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [expenseFormToggle, setExpenseFormToggle] = useState(false);
  const [categoryFormToggle, setCategoryFormToggle] = useState(false);

  const categories = useSelector((store) => store.categories);
  const currentGroup = useSelector((store) => store.currentGroup);
  const allExpenses = useSelector((store) => store.expenses);

  let totalBudgetAmount = 0;
  let totalMoneySpent = 0;
  let monthlyIncome = Math.round(currentGroup.totalBudget / 12);

  if (categories[0]) {
    categories.map((category) => (totalBudgetAmount += category.budgetAmount));
  }

  allExpenses.map((expense) => (totalMoneySpent += expense.amount));

  // store specific budget and categories in global state based on groupId from url params
  useEffect(() => {
    currentGroup.id &&
      dispatch({ type: "FETCH_GROUP_CATEGORIES", payload: currentGroup.id });
    currentGroup.id &&
      dispatch({ type: "FETCH_ALL_GROUP_EXPENSES", payload: currentGroup.id });
    currentGroup.id &&
      dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: currentGroup.id });
    dispatch({ type: "FETCH_CURRENT_GROUP", payload: groupId });
  }, [currentGroup.id]);

  // console.log("New category:", newCategory);
  // console.log("New expense:", newExpense);

  const deleteAllExpenses = () => {
    dispatch({ type: "DELETE_ALL_EXPENSES", payload: currentGroup.id });
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div className="main-wrapper">
      {loading ? (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "25%" }}
        >
          <Box>
            <CircularProgress />
          </Box>
        </Stack>
      ) : (
        <div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "40px" }}
          >
            <Typography variant="h4">{currentGroup.name}</Typography>
            <Button
              variant="contained"
              onClick={() => history.push(`/allExpenses/${groupId.id}`)}
            >
              All Expenses
            </Button>
          </Stack>
          <Stack direction="row" gap="40px">
            <Stack direction="column" width="80%">
              {/* Display monthly income before tax */}
              {/* stretch: implement monthly take home based on taxes by state */}

              <Stack
                direction="column"
                gap="10px"
                alignItems="flex-start"
                width="100%"
                sx={{ margin: "40px 0px" }}
              >
                {expenseFormToggle ? (
                  <div>
                    <AddExpenseForm
                      groupId={currentGroup.id}
                      categories={categories}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setExpenseFormToggle(false)}
                    >
                      Close Form
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setExpenseFormToggle(true)}
                  >
                    Add Expenses
                  </Button>
                )}

                {categoryFormToggle ? (
                  <div>
                    <AddCategoryForm
                      budgetId={currentGroup.id}
                      groupId={groupId}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setCategoryFormToggle(false)}
                    >
                      Close Form
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => setCategoryFormToggle(true)}
                  >
                    Add Category
                  </Button>
                )}
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: "40px" }}
              >
                <Stack direction="column" gap="10px">
                  <Typography variant="h5">
                    Monthly Income: {currencyFormatter.format(monthlyIncome)}
                  </Typography>
                  <Typography variant="h5">
                    Projected Budget:{" "}
                    {totalBudgetAmount >
                    Math.round(currentGroup.totalBudget / 12) ? (
                      <span style={{ color: "red" }}>{currencyFormatter.format(totalBudgetAmount)}</span>
                    ) : (
                       <span>{ currencyFormatter.format(totalBudgetAmount) }</span>
                    )}
                  </Typography>
                  <Typography variant="h5">
                    Money Left:{" "}
                    {totalMoneySpent > totalBudgetAmount ? (
                      <span style={{ color: "red" }}>
                        {currencyFormatter.format(totalMoneySpent - totalBudgetAmount)} Over Projected Budget
                      </span>
                    ) : (
                      <span>{currencyFormatter.format(totalBudgetAmount - totalMoneySpent)} left</span>
                    )}
                  </Typography>
                </Stack>

                <Button variant="contained" onClick={deleteAllExpenses}>
                  Reset All Expenses
                </Button>
              </Stack>

              <Box>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  {categories[0] ? (
                    categories.map((category) => (
                      <BudgetCategoryTable
                        key={category.id}
                        category={category}
                      />
                    ))
                  ) : (
                    <></>
                  )}
                </Grid>
              </Box>
            </Stack>
            <ActivityFeed allExpenses={allExpenses} />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default GroupDashboard;
