import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import {
	Card,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TableRow,
	TextField,
} from "@material-ui/core";
import { format, subDays } from "date-fns";
import numeral from "numeral";
import LocationButton from "../components/LocationButton";

const useStyles = makeStyles((theme) => ({
	card: {
		display: "flex",
		flexGrow: "1",
		padding: "1.5rem",
		borderRadius: "10px 10px 0px 0px",
		boxShadow: "none",
		flexWrap: "wrap",
	},

	tableContainer: {
		width: "100%",
		maxWidth: "800px",
	},

	formControl: {
		margin: "1rem",
		minWidth: "132px",
	},

	form: {
		display: "flex",
		flexGrow: "1",
		margin: "1rem",
		minWidth: "150px",
	},
	pageGrid: {
		margin: "1rem 0rem",
		maxWidth: "800px",
		boxShadow: "0 0 25px rgb(0 0 0 / 18%)",
		borderRadius: "10px",
		[theme.breakpoints.down("sm")]: {
			maxWidth: "90vw",
		},
	},
}));

function CustomTable({
	rawData,
	tableData,
	regenerateTableData,
	setTableData,
	poiNames,
	setMapCenter,
	setMapZoom,
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [dateOne, setDateOne] = useState("");
	const [dateTwo, setDateTwo] = useState("");
	const [dates, setDates] = useState([]);
	const [errorFirstDate, setErrorFirstDate] = useState(false);
	const [errorSecondDate, setErrorSecondDate] = useState(false);

	const classes = useStyles();

	const onDateOneChange = (event) => {
		if (event.target.value < dateTwo) {
			setErrorFirstDate(false);
			setDateOne(event.target.value);
			setTableData(
				regenerateTableData(rawData, event.target.value, dateTwo, poiNames)
			);
		} else {
			setErrorFirstDate(true);
		}
	};

	const onDateTwoChange = (event) => {
		if (event.target.value > dateOne) {
			setErrorSecondDate(false);
			setDateTwo(event.target.value);
			setTableData(
				regenerateTableData(rawData, dateOne, event.target.value, poiNames)
			);
		} else {
			setErrorSecondDate(true);
		}
	};

	const onSearchTermChange = (event) => {
		setSearchTerm(event.target.value.toLowerCase());
	};

	const renderDates = (rawData_) => {
		let dates = [];
		dates[0] = rawData_[0].date;
		rawData_.forEach((data) => {
			if (dates[dates.length - 1] !== data.date) {
				dates.push(data.date);
			}
		});

		return dates;
	};

	const generateTableCells = (rowData) => {
		let tableCells = [];
		for (const data in rowData) {
			if (data !== "lat" && data !== "lon") {
				const tableCell = (
					<TableCell key={data}>
						{data === "revenue"
							? numeral(rowData[data]).format("$0.0a")
							: data === "name"
							? rowData[data]
							: numeral(rowData[data]).format("0,0")}
					</TableCell>
				);
				tableCells.push(tableCell);
			}
		}

		return tableCells;
	};

	useEffect(() => {
		if (rawData[0]) {
			setDateOne(rawData[0].date);
			setDateTwo(rawData[rawData.length - 1].date);
			setDates(renderDates(rawData));
		}
	}, [rawData]);

	return (
		<Grid container justify="center" className={classes.pageGrid}>
			<Card className={classes.card}>
				<form noValidate autoComplete="off" className={classes.form}>
					<TextField
						label="Search POI Name"
						variant="outlined"
						value={searchTerm}
						onChange={onSearchTermChange}
					/>
				</form>
				<FormControl
					className={classes.formControl}
					variant="outlined"
					error={errorFirstDate}
				>
					<InputLabel id="demo-simple-select-filled-label">From</InputLabel>
					<Select value={dateOne} onChange={onDateOneChange} label="From">
						{dates ? (
							dates.map((date, i) => {
								return (
									<MenuItem value={date} key={i + 1}>
										{" "}
										{format(
											subDays(new Date(date), 1),
											"dd MMM yyyy"
										)}{" "}
									</MenuItem>
								);
							})
						) : (
							<MenuItem value={dateOne} key={1}>
								{format(subDays(new Date(dateOne), 1), "dd MMM yyyy")}
							</MenuItem>
						)}
					</Select>
					{errorFirstDate && (
						<FormHelperText>
							First date should be before second date
						</FormHelperText>
					)}
				</FormControl>
				<FormControl
					className={classes.formControl}
					variant="outlined"
					error={errorSecondDate}
				>
					<InputLabel id="demo-simple-select-filled-label">To</InputLabel>
					<Select value={dateTwo} onChange={onDateTwoChange} label="To">
						{dates ? (
							dates.map((date, i) => {
								return (
									<MenuItem value={date} key={i + 1}>
										{" "}
										{format(
											subDays(new Date(date), 1),
											"dd MMM yyyy"
										)}{" "}
									</MenuItem>
								);
							})
						) : (
							<MenuItem value={dateTwo} key={1}>
								{format(subDays(new Date(dateTwo), 1), "dd MMM yyyy")}
							</MenuItem>
						)}
					</Select>
					{errorSecondDate && (
						<FormHelperText>
							Second date should be after first date
						</FormHelperText>
					)}
				</FormControl>
			</Card>
			<TableContainer className={classes.tableContainer}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<TableCell
								key={1}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								POI Name
							</TableCell>
							<TableCell
								key={2}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								Revenue
							</TableCell>
							<TableCell
								key={3}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								Impressions
							</TableCell>
							<TableCell
								key={4}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								Clicks
							</TableCell>
							<TableCell
								key={5}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								Events
							</TableCell>
							<TableCell
								key={6}
								align={"left"}
								style={{ minWidth: "5rem" }}
							>
								{" "}
								Location
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData &&
							tableData.map((row) => {
								if (
									!searchTerm ||
									row.name.toLowerCase().includes(searchTerm)
								) {
									return (
										<TableRow key={row.name}>
											{generateTableCells(row).map((tableCell) => {
												return tableCell;
											})}
											<TableCell key="location">
												<LocationButton
													lat={row.lat}
													lon={row.lon}
													setMapZoom={setMapZoom}
													setMapCenter={setMapCenter}
												></LocationButton>
											</TableCell>
										</TableRow>
									);
								}
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	);
}

export default CustomTable;
