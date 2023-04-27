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
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NewGroupPage.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NewGroupPage = () => {
  const [newBudget, setNewBudget] = useState({ name: "", totalBudget: 0 });
  const [income1, setIncome1] = useState(0);
  const [income2, setIncome2] = useState(0);
  const [username, setUsername] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
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
    setAddedUsers([]);
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
  // get the newly created groupId from the store
  const groupId = useSelector((store) => store.currentGroup.groupId);

  useEffect(() => {
    if (groupId) {
      // update route and send user to new group dashboard
      history.push(`/groupDashboard/${groupId}`);
    }
  }, [groupId, history]);

  // console.log(addedUsers);
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
      let newObj = {
        ...newCategory,
        budgetAmount: Number(newCategory.budgetAmount),
      };
      setCategories([...categories, newObj]);
      setNewCategory({ name: "", budgetAmount: "" });
      setCategorySuccessSnackOpen(true);
    } else {
      setCategoryErrorSnackOpen(true);
    }
  };

  // console.log(categories);

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
      for (let user of allUsers) {
        if (user.username === username) {
          setAddedUsers([...addedUsers, { id: user.id, username: username }]);
        }
      }
      setUsername("");
      setUserSuccessSnackOpen(true);
    } else {
      setUserErrorSnackOpen(true);
    }
  };

  const createNewGroup = () => {
    if (income1 && newBudget.name && addedUsers) {
      let newGroupObj = {
        budget: {
          ...newBudget,
          totalBudget: Number(income1) + Number(income2),
        },
        members: [
          ...addedUsers,
          { id: currentUser.id, username: currentUser.username },
        ],
        categories: categories,
      };
      console.log("Payload:", newGroupObj);

      //Dispatch to create new group
      dispatch({ type: "CREATE_GROUP", payload: newGroupObj });
      setSuccessSnackOpen(true);
      clearAllState();
    } else {
      setErrorSnackOpen(true);
    }
  };

  const removeUserFromGroup = (userToRemove) => {
    let newState = [...addedUsers];
    newState = newState.filter(
      (user) => user.username != userToRemove.username
    );
    setAddedUsers(newState);
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
              <Typography variant="h4">Monthly Takehome</Typography>
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
              <Typography variant="h4" sx={{ margin: "40px 0px" }}>
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
                      budgetAmount: e.target.value,
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
                  <Typography variant="h5" margin="20px 0px">
                    {category.name}
                  </Typography>
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
            <Typography variant="h3" margin="0px 0px 40px 0px">
              Add User to Group
            </Typography>
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
                  .filter(
                    (user) =>
                      user.username !== currentUser.username &&
                      !addedUsers.some(
                        (addedUser) => addedUser.username === user.username
                      )
                  )
                  .map((user) => user.username)}
                sx={{ width: "60%" }}
                onSelect={(e) => setUsername(e.target.value)}
                value={username}
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
            {addedUsers[0] &&
              addedUsers.map((user) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  mt="20px"
                  key={user.id}
                >
                  <CheckIcon />
                  <Typography>{user.username}</Typography>
                  <IconButton onClick={() => removeUserFromGroup(user)}>
                    <ClearIcon></ClearIcon>
                  </IconButton>
                </Stack>
              ))}
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
