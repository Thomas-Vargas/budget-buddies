import * as React from "react";
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
  Modal,
  Fade,
  Backdrop,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./BudgetCategoryTable.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BudgetCategoryTable = ({ category }) => {
  const [selections, setSelections] = useState([]);
  const [editedCategory, setEditedCategory] = useState({ name: "", value: "" });
  const [editToggle, setEditToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [cellDeleteSuccessSnackOpen, setCellDeleteSuccessSnackOpen] =
    useState(false);
  const [categoryDeleteSnackOpen, setCategoryDeleteSnackOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const currentGroup = useSelector((store) => store.currentGroup);

  let categoryTotal = 0;
  category.expenses.map((expense) => (categoryTotal += expense.expenseAmount));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  const columns = [
    {
      field: "expenseName",
      headerName: "Expense",
      width: 120,
      editable: true,
    },
    {
      field: "expenseAmount",
      type: "number",
      headerName: "Amount",
      editable: true,
      valueFormatter: ({ value }) => currencyFormatter.format(value),
    },
    {
      field: "username",
      headerName: "User",
      type: "number",
      editable: false,
    },
  ];

  const rows = category.expenses;

  const handleDelete = () => {
    dispatch({
      type: "DELETE_EXPENSE",
      payload: { expenseIds: selections, budgetId: currentGroup.id },
    });
    setCellDeleteSuccessSnackOpen(true);
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
    handleClose();
    const deleteCategoryObj = {
      budgetId: currentGroup.id,
      categoryId: category.id,
    };
    dispatch({ type: "DELETE_CATEGORY", payload: deleteCategoryObj });
    setCategoryDeleteSnackOpen(true);
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
    minimumFractionDigits: 0,
    currency: "USD",
  });

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCategoryDeleteSnackOpen(false);
    setCellDeleteSuccessSnackOpen(false);
  };

  return (
    <Grid item xs={6}>
      <Paper elevation={6} sx={{ padding: "20px" }}>
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
              <Button
                variant="contained"
                style={{ backgroundColor: "#5B4570" }}
                onClick={() => handleEditSave()}
              >
                Save
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">{category.name}</Typography>
              <IconButton onClick={() => handleEditClick()}>
                <EditIcon></EditIcon>
              </IconButton>
            </Stack>
          )}

          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            marginBottom="10px"
          >
            {" "}
            <Typography variant="h6">
              Target Budget:{" "}
              {currencyFormatter.format(category.budgetAmount)}
            </Typography>
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

        <Box sx={{ height: 319, width: "100%", marginBottom: "20px" }}>
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

          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: "100%" }}
          >
            <IconButton onClick={handleOpen}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Paper sx={{ ...style, border: "none" }}>
            <Typography id="transition-modal-title" variant="h5">
              Are you sure?
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              This will remove the entire budget category, including all
              expenses in the category.
            </Typography>
            <Stack
              direction="row"
              sx={{ mt: "20px" }}
              justifyContent="flex-end"
              gap="20px"
            >
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#5B4570" }}
                onClick={deleteCategory}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Modal>

      <Snackbar
        open={cellDeleteSuccessSnackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={() => setCellDeleteSuccessSnackOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Expenses deleted.
        </Alert>
      </Snackbar>
      <Snackbar
        open={categoryDeleteSnackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={() => setCategoryDeleteSnackOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Category Deleted!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default BudgetCategoryTable;
