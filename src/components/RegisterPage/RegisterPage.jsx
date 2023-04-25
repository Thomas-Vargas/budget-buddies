import React from "react";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

function RegisterPage() {
  const history = useHistory();

  return (
    <div className="wrapper-top-margin">
      <RegisterForm />

      <center>
        <Button
          onClick={() => {
            history.push("/login");
          }}
          variant="contained"
          style={{ backgroundColor: "#5B4570" }}
        >
          Login
        </Button>
      </center>
    </div>
  );
}

export default RegisterPage;
