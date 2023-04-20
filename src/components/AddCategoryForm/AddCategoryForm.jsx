import { TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AddCategoryForm = ({ groupId, budgetId }) => {
  const [newCategory, setNewCategory] = useState({ name: "", amount: "" });

  const dispatch = useDispatch();

  const addNewCategory = () => {
    dispatch({
      type: "ADD_NEW_CATEGORY",
      payload: {
        ...newCategory,
        budgetId: budgetId,
        groupId: Number(groupId.id),
      },
    });
    setNewCategory({ name: "", amount: "" });
  };

  return (
    <div>
      <h3>Add Expense</h3>
      <Stack direction="row" spacing={2} sx={{ marginBottom: "40px" }}>
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
        <Button variant="contained" onClick={addNewCategory}>
          Add Category
        </Button>
      </Stack>
    </div>
  );
};

export default AddCategoryForm;