import { DataGrid } from "@mui/x-data-grid";
import { Grid, Stack, Button, Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AllExpensesTable = () => {
  const groupId = useParams();
  const [selections, setSelections] = useState([]);
  const dispatch = useDispatch();

  const currentGroup = useSelector((store) => store.currentGroup);
  const allExpenses = useSelector((store) => store.expenses);
  const categories = useSelector(store => store.categories);

  let totalBudgetAmount = 0;
  let totalMoneySpent = 0;
  let monthlyIncome = Math.round(currentGroup.totalBudget / 12);

  if (categories[0]) {
    categories.map((category) => (totalBudgetAmount += category.budgetAmount));
  }

  allExpenses.map((expense) => (totalMoneySpent += expense.amount));

  useEffect(() => {
    currentGroup.id &&
      dispatch({ type: "FETCH_ALL_GROUP_EXPENSES", payload: currentGroup.id });
    dispatch({ type: "FETCH_CURRENT_GROUP", payload: groupId });
  }, [currentGroup.id]);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const columns = [
    {
      field: "expenseName",
      headerName: "Expense",
      width: 200,
      editable: true,
    },
    {
      field: "amount",
      type: "number",
      headerName: "Amount",
      width: 200,
      editable: true,
      valueFormatter: ({ value }) => currencyFormatter.format(value),
    },
    {
      field: "categoryName",
      headerName: "Category",
      width: 200,
      editable: false,
    },
    {
      field: "username",
      headerName: "User",
      width: 200,
      editable: false,
    },
  ];

  const rows = allExpenses;

  const handleDelete = () => {
    dispatch({
      type: "DELETE_EXPENSE",
      payload: { expenseIds: selections, budgetId: currentGroup.id },
    });
    dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: currentGroup.id });
  };

  const handleCellEditCommit = (params) => {
    let updatedExpenseObj = {};
    if (params.field === "amount") {
      updatedExpenseObj.value = Number(params.value);
      updatedExpenseObj.columnToUpdate = "amount";
    } else if (params.field === "expenseName") {
      updatedExpenseObj.value = params.value;
      updatedExpenseObj.columnToUpdate = "name";
    }
    updatedExpenseObj.budgetId = currentGroup.id;
    updatedExpenseObj.id = params.id;
    // console.log(updatedExpenseObj);

    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpenseObj });
    dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: currentGroup.id });
  };

  return (
    <div>
      <Grid item xs={6}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mb: "20px" }}
        >
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
        </Stack>
        <Paper
          sx={{
            height: "700px",
            width: "100%",
            marginBottom: "20px",
            "& .font-tabular-nums": {
              fontVariantNumeric: "tabular-nums",
            },
          }}

          elevation={6}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       pageSize: 5,
            //     },
            //   },
            // }}
            // pageSizeOptions={[5]}
            autoPageSize
            checkboxSelection
            disableRowSelectionOnClick
            onSelectionModelChange={(newSelection) => {
              setSelections(newSelection);
            }}
            onCellEditCommit={(params) => handleCellEditCommit(params)}
          />
        </Paper>
        <Stack direction="row" justifyContent="space-between">
          {selections[0] && (
            <Button variant="contained" onClick={handleDelete} color="error">
              Delete
            </Button>
          )}
        </Stack>
      </Grid>
    </div>
  );
};

export default AllExpensesTable;
