import React, { useEffect, useMemo } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { Box, IconButton } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import AboutPage from "../AboutPage/AboutPage";
import UserPage from "../UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";

import "./App.css";
import SideBar from "../SideBar/SideBar";
import NewGroupPage from "../NewGroupPage/NewGroupPage";
import GroupDashboard from "../GroupDashboard/GroupDashboard";
import UserProfile from "../UserProfile/UserProfile";
import AllExpensesPage from "../AllExpensesPage/AllExpensesPage";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function Controller() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  
  return (
      <IconButton
        sx={{ ml: 1 }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
  );
}

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#014421",
//     },
//     secondary: {
//       main: "#800000",
//     },
//   },
// });

function App() {
  // move state to reducer to make user choice persistent on page load.
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#32174D",
          },
          secondary: {
            main: "#800000",
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div>
            {user.id ? <></> : <Nav darkModeController={<Controller />}  />}
            <Switch>
              {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
              <Redirect exact from="/" to="/home" />

              {/* Visiting localhost:3000/about will show the about page. */}
              <Route
                // shows AboutPage at all times (logged in or not)
                exact
                path="/about"
              >
                {user.id ? (
                  <SideBar darkModeController={<Controller />}  component={<AboutPage />} />
                ) : (
                  <AboutPage />
                )}
              </Route>

              {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
              <ProtectedRoute
                // logged in shows UserPage else shows LoginPage
                exact
                path="/user"
              >
                <SideBar darkModeController={<Controller />} component={<UserPage />} />
              </ProtectedRoute>

              <ProtectedRoute
                // logged in shows InfoPage else shows LoginPage
                exact
                path="/info"
              >
                <SideBar darkModeController={<Controller />} component={<InfoPage />} />
              </ProtectedRoute>

              <ProtectedRoute exact path="/newGroup">
                <SideBar darkModeController={<Controller />} component={<NewGroupPage />} />
              </ProtectedRoute>

              <ProtectedRoute exact path="/groupDashboard/:id">
                <SideBar darkModeController={<Controller />} component={<GroupDashboard />} />
              </ProtectedRoute>

              <ProtectedRoute exact path="/profile">
                <SideBar darkModeController={<Controller />} component={<UserProfile />} />
              </ProtectedRoute>

              <ProtectedRoute exact path="/allExpenses/:id">
                <SideBar darkModeController={<Controller />} component={<AllExpensesPage />} />
              </ProtectedRoute>

              <Route exact path="/login">
                {user.id ? (
                  // If the user is already logged in,
                  // redirect to the /user page
                  <Redirect to="/user" />
                ) : (
                  // Otherwise, show the login page
                  <LoginPage />
                )}
              </Route>

              <Route exact path="/registration">
                {user.id ? (
                  // If the user is already logged in,
                  // redirect them to the /user page
                  <Redirect to="/user" />
                ) : (
                  // Otherwise, show the registration page
                  <RegisterPage />
                )}
              </Route>

              <Route exact path="/home">
                {user.id ? (
                  // If the user is already logged in,
                  // redirect them to the /user page
                  <Redirect to="/user" />
                ) : (
                  // Otherwise, show the Landing page
                  <LandingPage />
                )}
              </Route>

              {/* If none of the other routes matched, we will show a 404. */}
              <Route>
                <h1>404</h1>
              </Route>
            </Switch>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
