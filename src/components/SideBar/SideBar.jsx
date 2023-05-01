import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SideBar = ({ component, darkModeController }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const user = useSelector((store) => store.user);
  const groups = useSelector((store) => store.groups);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAllExpensesClick = (group) => {
    // dispatch({ type: "UNSET_CATEGORY_TOTALS" })
    // dispatch({ type: "FETCH_CATEGORY_TOTALS", payload: group.id });
    console.log("group from sidebar click", group);
    dispatch({ type: "SET_CURRENT_GROUP", payload: group });
    dispatch( {type: "FETCH_GROUP_CATEGORIES", payload: group.id} )
    history.push(`/allExpenses/${group.groupId}`);
  };

  const handleNewGroupClick = () => {
    dispatch({ type: "UNSET_CURRENT_GROUP" })
    history.push("/newGroup")
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar style={{backgroundColor:"#32174D"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
              <Typography variant="h5" noWrap component="div">
                Budget Buddies
              </Typography>
            </Link>
            {darkModeController}
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* If a user is logged in, show these links */}
          {user.id && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => history.push("/homeDashboard")}>
                  <ListItemText primary={"Home"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNewGroupClick()}>
                  <ListItemText primary={"Create New Group"} />
                </ListItemButton>
              </ListItem>

              <Divider />

              {groups[0] &&
                groups.map((group) => (
                  <Accordion
                    key={group.id}
                    disableGutters={true}
                    square={true}
                    style={{ boxShadow: "none" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{group.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{ padding: "0px", }}
                    >
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() =>
                            history.push(`/groupDashboard/${group.groupId}`)
                          }
                        >
                          <ListItemText primary={"Group Dashboard"} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => handleAllExpensesClick(group)}
                        >
                          <ListItemText primary={"All Expenses"} />
                        </ListItemButton>
                      </ListItem>
                    </AccordionDetails>
                  </Accordion>
                ))}
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => history.push("/profile")}>
                  <ListItemText primary={user.username} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => dispatch({ type: "LOGOUT" })}>
                  <ListItemText primary={"Logout"} />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={() => history.push("/about")}>
                  <ListItemText primary={"About"} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {component}
      </Main>
    </Box>
  );
};

export default SideBar;
