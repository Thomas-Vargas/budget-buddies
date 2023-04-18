import { TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NewGroupPage.css";

// TODO
// some info letting user know that budget line items are per month
// check if username is exists in database, only let them add the person if it does

const NewGroupPage = () => {
  const [newBudget, setNewBudget] = useState({ name: "", totalBudget: 0 });
  const [income1, setIncome1] = useState(0);
  const [income2, setIncome2] = useState(0);
  const [username, setUsername] = useState("");
  const [addedUser, setAddedUser] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    budgetAmount: "",
  });
  const [categories, setCategories] = useState([
    { name: "Rent", budgetAmount: "" },
    { name: "Travel", budgetAmount: "" },
  ]);

  const dispatch = useDispatch();
  const history = useHistory();

  // console.log(newBudget);
  // console.log(categories);
  // console.log(newCategory);

  //update budgetAmount on change
  const handleCategoryChange = (e, category, i) => {
    let newState = [...categories];
    newState[i].budgetAmount = Number(e.target.value);
    setCategories(newState);
  };

  const addCategory = () => {
    setCategories([...categories, newCategory]);
    setNewCategory({ name: "", budgetAmount: "" });
  };

  const removeCategory = (i) => {
    let newState = [...categories];
    newState.splice(i, 1);
    setCategories(newState);
    console.log("New state with removed obj:", newState);
  };

  const saveUserInState = () => {
    setAddedUser(username);
    setUsername("");
  };

  const createNewGroup = () => {
    let newGroupObj = {budget: {...newBudget, totalBudget: Number(income1) + Number(income2)}, username: addedUser, categories: categories}
    console.log('Payload:', newGroupObj);

    //Dispatch to create new group
    dispatch({ type: 'CREATE_GROUP', payload: newGroupObj })
    // send to new group dashboard
    history.push('/groupDashboard');
  }

  return (
    <div className="main-wrapper">
      <div className="new-group-page">
        <div className="create-group-form">
          <h1>Create New Group</h1>
          <div className="form-inputs">
            <TextField
              type="text"
              id="outlined-basic"
              label="Group Name"
              variant="outlined"
              required
              onChange={(e) =>
                setNewBudget({ ...newBudget, name: e.target.value })
              }
            />
            <TextField
              type="Number"
              id="outlined-basic"
              label="Income"
              variant="outlined"
              required
              onChange={(e) =>
                setIncome1(e.target.value)
              }
            />
            <TextField
              type="Number"
              id="outlined-basic"
              label="Income"
              variant="outlined"
              onChange={(e) =>
                setIncome2(e.target.value)
              }
            />
          </div>

          <div className="category-btn-group">
            <div className="category-header">
              <h2>Categories</h2>
            </div>

            <div className="category-form">
              <TextField
                type="text"
                id="outlined-basic"
                label="Name"
                variant="outlined"
                required
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <TextField
                type="Number"
                id="outlined-basic"
                label="Amount"
                variant="outlined"
                required
                value={newCategory.budgetAmount}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    budgetAmount: Number(e.target.value),
                  })
                }
              />
              <Button variant="contained" onClick={addCategory} size="small">
                Add Category
              </Button>
            </div>

            {categories.map((category, i) => (
              <div className="category" key={category.name}>
                <h3>{category.name}</h3>
                <TextField
                  type="Number"
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  required
                  value={category.budgetAmount}
                  onChange={(e) => handleCategoryChange(e, category, i)}
                />
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => removeCategory(i)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
        <div className="add-user">
          <h1 className="add-user-header">Add User to Group</h1>
          <div className="add-user-form">
            <TextField
              type="text"
              id="outlined-basic"
              label="Username"
              variant="outlined"
              className="add-user-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                marginLeft: "20px",
              }}
              onClick={saveUserInState}
            >
              Add User
            </Button>
          </div>
          <p>{addedUser}</p>
        </div>
      </div>
      <center>
        <Button variant="contained" onClick={createNewGroup}>Create Group</Button>
      </center>
    </div>
  );
};

export default NewGroupPage;