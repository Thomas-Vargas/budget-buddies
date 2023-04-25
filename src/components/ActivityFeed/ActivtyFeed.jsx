import { useSelector } from "react-redux";
import { Stack, Paper, Typography } from "@mui/material";

const ActivityFeed = ({ allExpenses }) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div>
      <Paper elevation={6} sx={{ padding: "40px" }}>
        <Stack direction="column" gap="10px">
          <Typography variant="h4">Group Activity</Typography>
          {allExpenses.map((expense) => (
            <p key={expense.id}>
              {expense.username} spent{" "}
              {currencyFormatter.format(expense.amount)} on{" "}
              {expense.expenseName} in the {expense.categoryName} category.
            </p>
          ))}
        </Stack>
      </Paper>
    </div>
  );
};

export default ActivityFeed;
