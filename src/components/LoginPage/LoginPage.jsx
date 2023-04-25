import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";

function LoginPage() {
  const history = useHistory();

  return (
    <div className="wrapper-top-margin">
      <LoginForm />

      <center>
        <Button
          variant="contained"
          onClick={() => {
            history.push("/registration");
          }}
          style={{ backgroundColor: "#5B4570" }}
        >
          Register
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;
