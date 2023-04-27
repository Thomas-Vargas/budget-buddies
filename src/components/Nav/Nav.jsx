import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, Typography, Stack } from "@mui/material";

function Nav({ darkModeController }) {
  const user = useSelector((store) => store.user);

  return (
    <AppBar position="fixed">
      <Toolbar style={{backgroundColor: "#32174D"}}>
        <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h5" noWrap component="div">
            Budget Buddies
          </Typography>
        </Link>

        <Stack direction="row" justifyContent="flex-end" sx={{ width: "100%" }} alignItems="center" gap="30px">
          <Link to="/about" style={{ textDecoration: "none", color: "white" }} className="navLink">
            <Typography variant="h6" noWrap component="div">
              About
            </Typography>
          </Link>
          <Link to="/login" style={{ textDecoration: "none", color: "white" }} className="navLink">
            <Typography variant="h6" noWrap component="div">
              Login / Register
            </Typography>
          </Link>
          {darkModeController}
        </Stack>
      </Toolbar>
    </AppBar>
    // </div>
  );
}

export default Nav;
