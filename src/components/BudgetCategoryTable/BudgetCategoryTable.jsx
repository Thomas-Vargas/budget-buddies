import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Stack, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./BudgetCategoryTable.css";
import categoryTotals from "../../redux/reducers/categoryTotals.reducer";
import expenses from "../../redux/reducers/expenses.reducer";

const BudgetCategoryTable = ({ category }) => {
  const [selections, setSelections] = useState([]);
  const dispatch = useDispatch();
  const currentGroup = useSelector((store) => store.currentGroup);

  let categoryTotal = 0;
  category.expenses.map((expense) => (categoryTotal += expense.expenseAmount));

  const columns = [
    {
      field: "expenseName",
      headerName: "Expense",
      width: 150,
      editable: true,
    },
    {
      field: "expenseAmount",
      headerName: "Amount",
      width: 150,
      editable: true,
    },
    {
      field: "username",
      headerName: "User",
      type: "number",
      width: 110,
      editable: false,
    },
  ];

  const rows = category.expenses;

  const handleDelete = () => {
    dispatch({
      type: "DELETE_EXPENSE",
      payload: { expenseIds: selections, budgetId: currentGroup.id },
    });
  };

  const handleCellEditCommit = (params) => {
    let updatedExpenseObj = {};
    if (params.field === "expenseAmount") {
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
  };

  const deleteCategory = () => {
    const deleteCategoryObj = {
      budgetId: currentGroup.id,
      categoryId: category.id,
    };
    dispatch({ type: "DELETE_CATEGORY", payload: deleteCategoryObj });
  };

  // console.log("newSelections:", selections);

  return (
    <Grid item xs={6}>
      <Stack direction="column" gap="10px">
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">{category.name}</Typography>
          <Typography variant="h5">
            Target Budget Amount: {category.budgetAmount}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          marginBottom="20px"
        >
          {categoryTotal > category.budgetAmount ? (
            <Typography variant="h5" color="red">
              Total Spent: {categoryTotal}
            </Typography>
          ) : (
            <Typography variant="h5">Total Spent: {categoryTotal}</Typography>
          )}
        </Stack>
      </Stack>

      <Box sx={{ height: 400, width: "100%", marginBottom: "20px" }}>
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
      </Box>
      <Stack direction="row" justifyContent="space-between">
        {selections[0] && (
          <Button variant="contained" onClick={handleDelete} color="error">
            Delete
          </Button>
        )}

        <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }}>
          <Button variant="contained" onClick={deleteCategory} color="error">
            Delete Category
          </Button>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default BudgetCategoryTable;
