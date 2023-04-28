import * as React from "react";
import {
  Avatar,
  Stack,
  Box,
  IconButton,
  TextField,
  Snackbar,
  Button,
  Paper,
  Typography
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProfile = () => {
  const [toggleEditForm, setToggleEditForm] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [allFieldsSnackOpen, setAllFieldsSnackOpen] = useState(false);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);
  const [noSpacesSnackOpen, setNoSpacesSnackOpen] = useState(false);
  const [passwordMatchSnackOpen, setPasswordMatchSnackOpen] = useState(false);
  const [uniqueUsernameSnackOpen, setUniqueUsernameSnackOpen] = useState(false);
  const [allUsersState, setAllUsersState] = useState();

  const currentUser = useSelector((store) => store.user);
  const allUsers = useSelector((store) => store.allUsers);
  const allGroups = useSelector((store) => store.groups);

  useEffect(() => {
    allUsers[0] && setAllUsersState(allUsers);
  }, [allUsers]);

  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSuccessSnackOpen(false);
    setNoSpacesSnackOpen(false);
    setAllFieldsSnackOpen(false);
    setPasswordMatchSnackOpen(false);
    setUniqueUsernameSnackOpen(false);
  };

  const handleEditClick = () => {
    setUpdatedUserInfo({ ...updatedUserInfo, username: currentUser.username });
    setToggleEditForm(!toggleEditForm);
  };

  const handlePasswordChange = (key, e) => {
    e.target.value.includes(" ")
      ? setNoSpacesSnackOpen(true)
      : setUpdatedUserInfo({ ...updatedUserInfo, [key]: e.target.value });
  };

  const handleUserNameChange = (e) => {
    e.target.value.includes(" ")
      ? setNoSpacesSnackOpen(true)
      : setUpdatedUserInfo({ ...updatedUserInfo, username: e.target.value });
  };

  const saveUpdatedUserDetails = () => {
    let uniqueUsername = true; // Set to true by default
    for (let user of allUsersState) {
      console.log("user", user.username);
      if (
        user.username === updatedUserInfo.username &&
        updatedUserInfo.username !== currentUser.username
      ) {
        uniqueUsername = false; // Set to false if the condition is met
        break; // Exit the loop early
      }
    }

    if (
      updatedUserInfo.username &&
      updatedUserInfo.password &&
      updatedUserInfo.verifyPassword
    ) {
      console.log(uniqueUsername);
      if (uniqueUsername === true) {
        if (updatedUserInfo.password === updatedUserInfo.verifyPassword) {
          dispatch({ type: "UPDATE_USER_DETAILS", payload: updatedUserInfo });
          setUpdatedUserInfo({
            username: "",
            password: "",
            verifyPassword: "",
          });
          setSuccessSnackOpen(true);
        } else {
          setPasswordMatchSnackOpen(true);
        }
      } else {
        setUniqueUsernameSnackOpen(true);
      }
    } else {
      setAllFieldsSnackOpen(true);
    }
  };

  return (
    <div className="main-wrapper">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap="40px"
      >
        <Paper elevation={6}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: "100%" }}
          >
            <IconButton onClick={handleEditClick} aria-label="edit">
              <EditIcon />
            </IconButton>
          </Stack>
          <Stack
            direction="column"
            alignItems="center"
            sx={{ width: "100%", padding: "50px" }}
            gap="10px"
          >
            <Avatar sx={{ height: 250, width: 250 }}>
              {currentUser.username[0]}
            </Avatar>
            <Typography variant="h3">{currentUser.username}</Typography>
            <Stack gap="10px">
              <Typography variant="h4">{currentUser.username}'s Groups</Typography>
              {allGroups[0] &&
                allGroups.map((group) => <Typography key={group.name}>{group.name}</Typography>)}
            </Stack>
          </Stack>
        </Paper>

        {toggleEditForm ? (
          <Paper elevation={6}>
            <Stack
              direction="column"
              alignItems="center"
              sx={{ width: "250px" }}
              gap="20px"
              padding="50px"
            >
              <Typography variant="h5">Edit Profile</Typography>
              <TextField
                type="text"
                label="New Username"
                variant="outlined"
                value={updatedUserInfo.username}
                onChange={(e) => handleUserNameChange(e)}
              />
              <TextField
                type="text"
                label="New Password"
                variant="outlined"
                value={updatedUserInfo.password}
                onChange={(e) => handlePasswordChange("password", e)}
              />
              <TextField
                type="text"
                label="Verify Password"
                variant="outlined"
                value={updatedUserInfo.verifyPassword}
                onChange={(e) => handlePasswordChange("verifyPassword", e)}
              />
              <Button
                variant="contained"
                onClick={saveUpdatedUserDetails}
                style={{ backgroundColor: "#5B4570" }}
              >
                Save
              </Button>
            </Stack>
          </Paper>
        ) : (
          <></>
        )}
      </Stack>

      <Snackbar
        open={noSpacesSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setNoSpacesSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          No Spaces!
        </Alert>
      </Snackbar>
      <Snackbar
        open={uniqueUsernameSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setUniqueUsernameSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Username taken.
        </Alert>
      </Snackbar>
      <Snackbar
        open={allFieldsSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setAllFieldsSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Please fill out all fields.
        </Alert>
      </Snackbar>
      <Snackbar
        open={passwordMatchSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={() => setPasswordMatchSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Passwords do not match.
        </Alert>
      </Snackbar>
      <Snackbar
        open={successSnackOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Updated username and password!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProfile;
