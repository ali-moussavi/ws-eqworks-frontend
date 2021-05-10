import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import logo from "../static/Logo.png";
import { Link as routerLink, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	button: {
		margin: "1rem",
		color: "white",
	},
	buttonActive: { margin: "1rem", color: "white", borderBottom: "1px solid white" },
}));

function Header() {
	const classes = useStyles();
	const location = useLocation();

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Box
						display="flex"
						style={{ height: "100%", flexGrow: "1" }}
						alignItems="center"
					>
						<img src={logo} alt="mockup" style={{ height: "42px" }} />
					</Box>
					<Button
						component={routerLink}
						to="/stats"
						className={
							location.pathname === "/stats"
								? classes.buttonActive
								: classes.button
						}
					>
						STATS
					</Button>
					<Button
						component={routerLink}
						to="/events"
						className={
							location.pathname === "/events"
								? classes.buttonActive
								: classes.button
						}
					>
						EVENTS
					</Button>
					<Button
						component={routerLink}
						to="/poi"
						className={
							location.pathname === "/poi"
								? classes.buttonActive
								: classes.button
						}
					>
						POI
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default Header;
