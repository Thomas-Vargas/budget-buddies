import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, Typography, Stack } from "@mui/material";

function Nav({ darkModeController }) {
  const user = useSelector((store) => store.user);

  return (
    // <div className="nav">
    //   <Link to="/home">
    //     <h2 className="nav-title">Budget App</h2>
    //   </Link>
    //   <div>
    //     {/* If no user is logged in, show these links */}
    //     {/* {!user.id && ( */}
    //       {/* // If there's no user, show login/registration links */}
    //       <Link className="navLink" to="/login">
    //         Login / Register
    //       </Link>
    //     {/* )} */}

    //     {/* If a user is logged in, show these links
    //     {user.id && (
    //       <>
    //         <Link className="navLink" to="/user">
    //           Home
    //         </Link>

    //         <Link className="navLink" to="/info">
    //           Info Page
    //         </Link>

    //         <LogOutButton className="navLink" />
    //       </>
    //     )} */}
    //   </div>
    <AppBar position="fixed">
      <Toolbar style={{backgroundColor: "#32174D"}}>
        <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h5" noWrap component="div">
            Budget App
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
