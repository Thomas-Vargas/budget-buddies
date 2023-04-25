import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Stack, Typography, Paper } from "@mui/material";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Paper elevation={6} sx={{ padding: "40px", marginBottom: "20px" }}>
        <form onSubmit={registerUser}>
          <Typography variant="h5">Register User</Typography>
          {errors.registrationMessage && (
            <h3 className="alert" role="alert">
              {errors.registrationMessage}
            </h3>
          )}
          <Stack
            direction="column"
            gap="40px"
            width="70%"
            sx={{ margin: "20px 0px" }}
          >
            <TextField
              type="text"
              name="username"
              label="username"
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
              type="password"
              name="password"
              value={password}
              label="password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Stack>
          <Button
            type="submit"
            name="submit"
            value="register"
            variant="contained"
            style={{ backgroundColor: "#5B4570" }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Stack>
  );
}

export default RegisterForm;
