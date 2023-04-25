import { useSelector } from "react-redux";
import { Stack } from "@mui/material";

const ActivityFeed = ({ allExpenses }) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div>
      <h1>Group Activity</h1>
      <Stack direction="column" gap="10px">
        {allExpenses.map(expense => <p key={expense.id}>{expense.username} spent {currencyFormatter.format(expense.amount)} on {expense.expenseName} in the {expense.categoryName} category.</p>)}
      </Stack>
    </div>
  );
};

export default ActivityFeed;
