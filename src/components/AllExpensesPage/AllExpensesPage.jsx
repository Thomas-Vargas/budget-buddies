import AllExpensesTable from "../AllExpensesTable/AllExpensesTable";
import {
  Button,
  Stack,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import DonutChart from "../DonutChart/DonutChart";

import "./AllExpensesPage.css";

const AllExpensesPage = () => {
  const [loading, setLoading] = useState(true);
  const groupId = useParams();
  const currentGroup = useSelector((store) => store.currentGroup);
  const history = useHistory();

  const categoryTotals = useSelector((store) => store.categoryTotals);
  const allExpenses = useSelector((store) => store.expenses);
  const categories = useSelector(store => store.categories);

  let date = new Date();
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let todaysDate = date.toLocaleDateString("en-US", options);

  let totalBudgetAmount = 0;
  let totalMoneySpent = 0;
  let monthlyIncome = Math.round(currentGroup.totalBudget / 12);

  if (categories[0]) {
    categories.map((category) => (totalBudgetAmount += category.budgetAmount));
  }

  allExpenses.map((expense) => (totalMoneySpent += expense.amount));

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
          <CircularProgress />
        </Stack>
      ) : (
        <div>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            gap="20px"
          >
            <Button
              variant="contained"
              onClick={() => history.push(`/groupDashboard/${groupId.id}`)}
              style={{ backgroundColor: "#5B4570" }}
            >
              Back
            </Button>
            <Typography variant="h3">{currentGroup.name}</Typography>
          </Stack>
          <Typography variant="h6" mb="20px">
            {todaysDate}
          </Typography>

          <Stack direction="column" gap="10px">
            <Typography variant="h5">
              Monthly Income: {currencyFormatter.format(monthlyIncome)}
            </Typography>
            <Typography variant="h5">
              Projected Budget:{" "}
              {totalBudgetAmount > Math.round(currentGroup.totalBudget / 12) ? (
                <span style={{ color: "red" }}>
                  {currencyFormatter.format(totalBudgetAmount)}
                </span>
              ) : (
                <span>{currencyFormatter.format(totalBudgetAmount)}</span>
              )}
            </Typography>
            <Typography variant="h5">
              Money Left:{" "}
              {totalMoneySpent > totalBudgetAmount ? (
                <span style={{ color: "red" }}>
                  {currencyFormatter.format(
                    totalMoneySpent - totalBudgetAmount
                  )}{" "}
                  Over Projected Budget
                </span>
              ) : (
                <span>
                  {currencyFormatter.format(
                    totalBudgetAmount - totalMoneySpent
                  )}{" "}
                  left
                </span>
              )}
            </Typography>
          </Stack>

          <Stack direction="row" gap="40px">
            <Stack direction="column" sx={{ width: "70%" }}>
              <AllExpensesTable />
            </Stack>
            <Stack sx={{ width: "30%" }}>
              <DonutChart categoryTotals={categoryTotals} />
            </Stack>
          </Stack>
        </div>
      )}
    </div>
  );
};

export default AllExpensesPage;
