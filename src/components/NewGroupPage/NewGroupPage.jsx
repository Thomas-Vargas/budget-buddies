import * as React from "react";
import {
  TextField,
  IconButton,
  Button,
  Stack,
  Snackbar,
  Autocomplete,
  Paper,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NewGroupPage.css";

// TODO
// some info letting user know that budget line items are per month
// check if username is exists in database, only let them add the person if it does

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [errorSnackOpen, setErrorSnackOpen] = React.useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = React.useState(false);
  const [userErrorSnackOpen, setUserErrorSnackOpen] = React.useState(false);
  const [userSuccessSnackOpen, setUserSuccessSnackOpen] = React.useState(false);
  const [categorySuccessSnackOpen, setCategorySuccessSnackOpen] =
    React.useState(false);
  const [categoryErrorSnackOpen, setCategoryErrorSnackOpen] =
    React.useState(false);

  const clearAllState = () => {
    setNewBudget({ name: "", totalBudget: 0 });
    setIncome1(0);
    setIncome1(0);
    setUsername("");
    setAddedUser("");
    setNewCategory({ name: "", budgetAmount: "" });
    setCategories([
      { name: "Rent", budgetAmount: "" },
      { name: "Travel", budgetAmount: "" },
    ]);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessSnackOpen(false);
    setErrorSnackOpen(false);
    setUserErrorSnackOpen(false);
    setUserSuccessSnackOpen(false);
    setCategoryErrorSnackOpen(false);
    setCategorySuccessSnackOpen(false);
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);

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
    if (newCategory.name && newCategory.budgetAmount) {
      setCategories([...categories, newCategory]);
      setNewCategory({ name: "", budgetAmount: "" });
      setCategorySuccessSnackOpen(true);
    } else {
      setCategoryErrorSnackOpen(true);
    }
  };

  const removeCategory = (i) => {
    let newState = [...categories];
    newState.splice(i, 1);
    setCategories(newState);
    console.log("New state with removed obj:", newState);
  };

  const saveUserInState = () => {
    let validated = false;
    for (let user of allUsers) {
      console.log("user in state:", user.username);
      console.log("username to add:", username);
      if (user.username === username && user.username != currentUser.username) {
        validated = true;
      }
    }

    if (validated) {
      setAddedUser(username);
      setUsername("");
      setUserSuccessSnackOpen(true);
    } else {
      setUserErrorSnackOpen(true);
    }
  };

  const createNewGroup = () => {
    if (income1 && newBudget.name && addedUser) {
      let newGroupObj = {
        budget: {
          ...newBudget,
          totalBudget: Number(income1) + Number(income2),
        },
        username: addedUser,
        categories: categories,
      };
      console.log("Payload:", newGroupObj);

      //Dispatch to create new group
      dispatch({ type: "CREATE_GROUP", payload: newGroupObj });
      // send to new group dashboard
      setSuccessSnackOpen(true);

      // history.push(`groupDashboard/`);
      clearAllState();
    } else {
      setErrorSnackOpen(true);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="new-group-page">
        <div className="create-group-form">
          <Paper elevation={6} sx={{ padding: "40px" }}>
            <Typography variant="h3" sx={{ mb: "40px" }}>
              Create New Group
            </Typography>
            <div className="form-inputs">
              <TextField
                type="text"
                label="Group Name"
                variant="outlined"
                required
                onChange={(e) =>
                  setNewBudget({ ...newBudget, name: e.target.value })
                }
              />
              <TextField
                type="Number"
                label="Income"
                variant="outlined"
                required
                onChange={(e) => setIncome1(e.target.value)}
              />
              <TextField
                type="Number"
                label="Income"
                variant="outlined"
                onChange={(e) => setIncome2(e.target.value)}
              />
            </div>

            <div className="category-btn-group">
              <Typography variant="h3" sx={{ margin: "40px 0px" }}>
                Categories
              </Typography>

              <div className="category-form">
                <TextField
                  type="text"
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
                <Button
                  variant="contained"
                  onClick={addCategory}
                  size="small"
                  style={{ backgroundColor: "#5B4570" }}
                >
                  Add Category
                </Button>
              </div>

              {categories.map((category, i) => (
                <div className="category" key={category.name}>
                  <Typography variant="h4" margin="20px 0px">{category.name}</Typography>
                  <TextField
                    type="Number"
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
          </Paper>
        </div>

        <div className="add-user">
          <Paper elevation={6} sx={{ padding: "40px", height: "100%" }}>
            <Typography variant="h3" margin="0px 0px 40px 0px">Add User to Group</Typography>
            <div className="add-user-form">
              {/* <TextField
              type="text"
              label="Username"
              variant="outlined"
              className="add-user-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            /> */}

              <Autocomplete
                options={allUsers
                  .filter((user) => user.username != currentUser.username)
                  .map((user) => user.username)}
                sx={{ width: "60%" }}
                onSelect={(e) => setUsername(e.target.value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                )}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  marginLeft: "20px",
                }}
                style={{ backgroundColor: "#5B4570" }}
                onClick={saveUserInState}
              >
                Add User
              </Button>
            </div>
            <p>
              {addedUser && (
                <Stack direction="row" alignItems="center" gap="10px">
                  <CheckIcon /> {addedUser}
                </Stack>
              )}
            </p>
          </Paper>
        </div>
      </div>
      <center>
        <Button
          variant="contained"
          onClick={createNewGroup}
          style={{ backgroundColor: "#5B4570" }}
          sx={{ mt: "60px" }}
        >
          Create Group
        </Button>
      </center>

      {/*  */}

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
          Must provide group name, one income and add a user.
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          New Group Created!
        </Alert>
      </Snackbar>
      <Snackbar
        open={userErrorSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setUserErrorSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          User does not exist!
        </Alert>
      </Snackbar>
      <Snackbar
        open={userSuccessSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          User added!
        </Alert>
      </Snackbar>
      <Snackbar
        open={categorySuccessSnackOpen}
        autoHideDuration={6000}
        onClose={() => setCategorySuccessSnackOpen(false)}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Category Added!
        </Alert>
      </Snackbar>
      <Snackbar
        open={categoryErrorSnackOpen}
        autoHideDuration={6000}
        onClose={() => setCategoryErrorSnackOpen(false)}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Please fill out all fields.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewGroupPage;
