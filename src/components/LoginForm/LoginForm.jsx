import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, TextField, Typography, Paper, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
    history.push('/homeDashboard');
  }; // end login

  return (
    <Stack direction="row" justifyContent="center">
      <Paper sx={{ padding: "60px", marginBottom: "20px" }} elevation={6}>
        <form onSubmit={login}>
          <Typography variant="h4" sx={{ marginBottom: "20px" }}>
            Login
          </Typography>
          {errors.loginMessage && (
            <h3 className="alert" role="alert">
              {errors.loginMessage}
            </h3>
          )}
          <div className="form-inputs">
            <div>
              <TextField
                type="text"
                name="username"
                label="Username"
                variant="outlined"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div>
              <TextField
                type="password"
                name="password"
                label="Password"
                variant="outlined"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <Button
                type="submit"
                variant="contained"
                name="submit"
                style={{ backgroundColor: "#5B4570" }}
              >
                Log In
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Stack>
  );
}

export default LoginForm;
