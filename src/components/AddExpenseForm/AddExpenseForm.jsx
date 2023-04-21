import * as React from "react";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Stack,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddExpenseForm = ({ categories, groupId }) => {
  const [newExpense, setNewExpense] = useState({
    name: "",
    categoryName: "",
    amount: "",
  });
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (category) => {
    setNewExpense({
      ...newExpense,
      categoryName: category.name,
      categoryId: category.id,
    });
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.categoryName && newExpense.amount) {
      let expensePayload = { ...newExpense, budgetId: groupId };
      dispatch({ type: "ADD_NEW_EXPENSE", payload: expensePayload });
      setNewExpense({ name: "", categoryName: "", amount: "" });
      setSuccessSnackOpen(true);
    } else {
      setErrorSnackOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessSnackOpen(false);
    setErrorSnackOpen(false);
  };

  return (
    <div>
      <h3>Add Category</h3>
      <Stack direction="row" spacing={2} sx={{ marginBottom: "40px" }}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            variant="outlined"
            labelId="demo-simple-select-label"
            value={newExpense.categoryName}
            label="Category"
            sx={{
              width: "194px",
            }}
          >
            {categories[0] ? (
              categories.map((category) => (
                <MenuItem
                  value={category.name}
                  key={category.name}
                  onClick={() => handleChange(category)}
                >
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <div></div>
            )}
          </Select>
        </FormControl>
        <TextField
          type="text"
          label="Expense"
          variant="outlined"
          value={newExpense.name}
          onChange={(e) =>
            setNewExpense({ ...newExpense, name: e.target.value })
          }
        />
        <TextField
          type="number"
          label="Expense Amount"
          variant="outlined"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: Number(e.target.value) })
          }
        />
        <Button variant="contained" onClick={addExpense}>
          Add Expense
        </Button>
      </Stack>

      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={() => setErrorSnackOpen(false)} severity="error" sx={{ width: "100%" }}>
          Must provide category, name of expense and amount.
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Expense added!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddExpenseForm;
