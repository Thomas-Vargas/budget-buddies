import { Stack, Typography, } from "@mui/material";
import { useSelector } from "react-redux";

const CouplesGroupDataHeader = () => {
  const currentGroup = useSelector(store => store.currentGroup);
  const categories = useSelector(store => store.categories);
  const allExpenses = useSelector(store => store.expenses);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 0,
    currency: "USD",
  });
  
  let totalBudgetAmount = 0;
  let totalMoneySpent = 0;
  let monthlyIncome = currentGroup.totalBudget;

  if (categories[0]) {
    categories.map((category) => (totalBudgetAmount += category.budgetAmount));
  }

  allExpenses.map((expense) => (totalMoneySpent += expense.amount));

  return (
    <div>
      <Stack direction="column" gap="10px">
        <Typography variant="h5">
          Monthly Income: {currencyFormatter.format(monthlyIncome)}
        </Typography>
        <Typography variant="h5">
          Projected Monthly Budget:{" "}
          {totalBudgetAmount > currentGroup.totalBudget ? (
            <span style={{ color: "red" }}>
              {currencyFormatter.format(totalBudgetAmount)}
            </span>
          ) : (
            <span>{currencyFormatter.format(totalBudgetAmount)}</span>
          )}
        </Typography>
        <Typography variant="h5">
          Remaining Budget:{" "}
          {totalMoneySpent > totalBudgetAmount ? (
            <span style={{ color: "red" }}>
              {currencyFormatter.format(totalMoneySpent - totalBudgetAmount)}{" "}
              Over Projected Budget
            </span>
          ) : (
            <span>
              {currencyFormatter.format(totalBudgetAmount - totalMoneySpent)}{" "}
              left
            </span>
          )}
        </Typography>
      </Stack>
    </div>
  );
};

export default CouplesGroupDataHeader;
