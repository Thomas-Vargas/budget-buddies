import * as React from "react";
import { TextField, Button, Stack, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useDispatch } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddCategoryForm = ({ groupId, budgetId }) => {
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });
  const [errorSnackOpen, setErrorSnackOpen] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);

  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessSnackOpen(false);
    setErrorSnackOpen(false);
  };

  const addNewCategory = () => {
    if (newCategory.name && newCategory.amount) {
      setSuccessSnackOpen(true);
      dispatch({
        type: "ADD_NEW_CATEGORY",
        payload: {
          ...newCategory,
          budgetId: budgetId,
          groupId: Number(groupId.id),
        },
      });
      setNewCategory({ name: "", amount: "" });
    } else {
      setErrorSnackOpen(true);
    }
  };

  return (
    <div>
      <Typography variant="h5">Add New Category</Typography>
      <Stack direction="row" spacing={2} sx={{ margin: "20px 0px 20px 0px" }}>
        <TextField
          type="text"
          label="Category"
          variant="outlined"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <TextField
          type="number"
          label="Amount"
          variant="outlined"
          value={newCategory.amount}
          onChange={(e) =>
            setNewCategory({ ...newCategory, amount: e.target.value })
          }
        />
        <Button
          variant="contained"
          onClick={addNewCategory}
          style={{ backgroundColor: "#5B4570" }}
        >
          Add Category
        </Button>
      </Stack>

      <Snackbar
        open={errorSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setErrorSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Must provide category name and budget amount.
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Category Created!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddCategoryForm;
