import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Stack,
  Button,
  Typography,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./BudgetCategoryTable.css";

const BudgetCategoryTable = ({ category }) => {
  const [selections, setSelections] = useState([]);
  const [editedCategory, setEditedCategory] = useState({ name: "", value: "" });
  const [editToggle, setEditToggle] = useState(false);

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
      type: "number",
      headerName: "Amount",
      width: 150,
      editable: true,
      valueFormatter: ({ value }) => currencyFormatter.format(value),
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

    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpenseObj });
  };

  const deleteCategory = () => {
    const deleteCategoryObj = {
      budgetId: currentGroup.id,
      categoryId: category.id,
    };
    dispatch({ type: "DELETE_CATEGORY", payload: deleteCategoryObj });
  };

  const handleEditSave = () => {
    if (editedCategory.name && editedCategory.value) {
      const editedCategoryObj = {
        name: editedCategory.name,
        value: Number(editedCategory.value),
        id: category.id,
        budgetId: currentGroup.id,
      };
      dispatch({ type: "UPDATE_CATEGORY", payload: editedCategoryObj });
      setTimeout(() => {
        setEditToggle(false);
        setEditedCategory({ name: "", value: "" });
      }, 200);
    }
  };

  const handleEditClick = () => {
    setEditToggle(!editToggle);
    setEditedCategory({ name: category.name, value: category.budgetAmount });
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // console.log(editedCategory);

  return (
    <Grid item xs={6}>
      <Paper elevation={6} sx={{padding: "20px"}}>
        <Stack direction="column" gap="10px">
          {editToggle ? (
            <Stack direction="row" justifyContent="space-between">
              <TextField
                type="text"
                label="Category Name"
                variant="outlined"
                value={editedCategory.name}
                onChange={(e) =>
                  setEditedCategory({ ...editedCategory, name: e.target.value })
                }
              />
              <TextField
                type="number"
                label="Category Value"
                variant="outlined"
                value={editedCategory.value}
                onChange={(e) =>
                  setEditedCategory({
                    ...editedCategory,
                    value: e.target.value,
                  })
                }
              />
              <Button variant="contained" onClick={() => handleEditSave()}>
                Save
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" justifyContent="space-between">
              <IconButton onClick={() => handleEditClick()}>
                <EditIcon></EditIcon>
              </IconButton>
              <Typography variant="h6">
                Target Budget Amount:{" "}
                {currencyFormatter.format(category.budgetAmount)}
              </Typography>
            </Stack>
          )}

          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            marginBottom="10px"
          >
            <Typography variant="h5">{category.name}</Typography>
            {categoryTotal > category.budgetAmount ? (
              <Typography variant="h6" color="red">
                Total Spent: {currencyFormatter.format(categoryTotal)}
              </Typography>
            ) : (
              <Typography variant="h6">
                Total Spent: {currencyFormatter.format(categoryTotal)}
              </Typography>
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
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ marginBottom: "20px" }}
        >
          {selections[0] && (
            <Button variant="contained" onClick={handleDelete} color="error">
              Delete
            </Button>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: "100%" }}
          >
            <Button variant="contained" onClick={deleteCategory} color="error">
              Delete Category
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default BudgetCategoryTable;
