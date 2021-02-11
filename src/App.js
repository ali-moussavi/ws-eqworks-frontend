import "./App.css";
import Header from "./components/Header";
import Stats from "./pages/Stats";
import Events from "./pages/Events";
import Poi from "./pages/Poi";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

let theme = createMuiTheme({
	typography: {
		fontFamily: [
			'"Poppins"',
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(","),
		button: {
			textTransform: "none",
		},
	},
});

theme = responsiveFontSizes(theme);

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<BrowserRouter>
					<Header className="App__Header"></Header>
					<Route path="/" exact>
						<Redirect to="/stats" />
					</Route>
					<Route path="/poi" exact component={Poi} />
					<Route path="/stats" exact component={Stats} />
					<Route path="/events" exact component={Events} />
				</BrowserRouter>
			</div>
		</ThemeProvider>
	);
}

export default App;
