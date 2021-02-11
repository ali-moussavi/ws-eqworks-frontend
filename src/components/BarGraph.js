import {
	Card,
	FormControl,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { format, subDays } from "date-fns";
import numeral from "numeral";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "1rem 1.5rem 1rem 1.5rem",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		margin: "1.5rem",
		borderRadius: "10px",
		boxShadow: "0 0 25px rgb(0 0 0 / 18%)",
		[theme.breakpoints.down("l")]: {
			width: "100%",
		},
		width: "80%",
	},

	chartContainer: {
		width: "100%",
		height: "50vh",
	},

	title: {
		fontSize: 14,
	},

	formControl: {
		margin: "1rem",
	},
}));

function BarGraph({
	rawData,
	title,
	initialChartType,
	showChartType,
	showOneDate,
	showTwoDates,
}) {
	const [date, setDate] = useState("");
	const [chartData, setChartData] = useState([]);
	const [chartLabels, setChartLabels] = useState([]);
	const [chartType, setChartType] = useState("revenue");
	const [dates, setDates] = useState([]);
	const [poiName, setPoiName] = useState("All");
	const [poiNames, setPoiNames] = useState([]);

	const classes = useStyles();

	const onDateChange = (event) => {
		setDate(event.target.value);
	};

	const onTypeChange = (event) => {
		setChartType(event.target.value);
	};

	const onPoiChange = (event) => {
		setPoiName(event.target.value);
	};

	useEffect(() => {
		const generatePoiNames = (rawData_) => {
			let poiNames = [];
			rawData_.forEach((data) => {
				if (!poiNames.includes(data.name)) {
					poiNames.push(data.name);
				}
			});
			return poiNames;
		};

		setPoiNames(generatePoiNames(rawData));

		let labels = [];

		for (let i = 0; i < 24; i++) {
			labels[i] = i;
		}

		setChartLabels(labels);
		if (rawData[0]) {
			setDate(rawData[0].date);
			setDates(renderDates(rawData));
		}
		if (initialChartType) {
			setChartType(initialChartType);
		}
	}, [rawData, initialChartType]);

	useEffect(() => {
		const generateChartData = (rawData_, chartType_, poi_) => {
			let newChartData = [];
			for (let i = 0; i < 24; i++) {
				newChartData[i] = 0;
			}

			rawData_.forEach((data) => {
				if (data.date === date || title.includes("Overall")) {
					if (poi_ === "All" || data.name === poi_) {
						newChartData[data.hour] += parseFloat(data[chartType_]);
					}
				}
			});
			return newChartData;
		};

		setChartData(generateChartData(rawData, chartType, poiName));
	}, [chartType, date, rawData, title, poiName]);

	//creating gradiant background for chart
	const data = (canvas) => {
		const ctx = canvas.getContext("2d");
		const gradient = ctx.createLinearGradient(0, 80, 0, 600);
		gradient.addColorStop(1, "rgba(34,193,195,0)");
		gradient.addColorStop(0, "rgba(63,81,181,0.9308765742625175)");

		return {
			labels: chartLabels,
			datasets: [
				{
					label: "Hour",
					backgroundColor: gradient,
					borderColor: "#3F51B5",
					data: chartData,
				},
			],
		};
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

	//options for chart
	const options = {
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false,
		},
		tooltips: {
			mode: "index",
			intersect: false,
			callbacks: {
				label: function (tooltipItem, data) {
					if (chartType === "revenue") {
						return numeral(tooltipItem.value).format("$0,0");
					} else {
						return numeral(tooltipItem.value).format("0a");
					}
				},
				title: function (t, d) {
					return "Hour: " + d.labels[t[0].index];
				},
			},
		},
		scales: {
			xAxes: [
				{
					gridLines: {
						display: false,
					},
					scaleLabel: {
						display: true,
						labelString: "Hour",
					},
				},
			],
			yAxes: [
				{
					scaleLabel: {
						display: true,
						labelString: chartType.toUpperCase(),
					},
					gridLines: {
						display: true,
					},
					ticks: {
						callback: function (value, index, values) {
							if (chartType === "revenue") {
								return numeral(value).format("$0,0");
							} else {
								return numeral(value).format("0a");
							}
						},
					},
				},
			],
		},
	};

	return (
		<Card className={classes.root}>
			<Grid container direction="row" justify="flex-start" alignItems="center">
				<Typography
					variant="h5"
					style={{
						margin: "1rem 0 1rem 1rem",
						paddingBottom: "1rem",
						fontWeight: "300",
						flexGrow: "1",
						textAlign: "left",
					}}
				>
					{title}
				</Typography>
				<FormControl className={classes.formControl} variant="outlined">
					<InputLabel id="demo-simple-select-filled-label">POI</InputLabel>
					<Select value={poiName} onChange={onPoiChange} label="POI">
						<MenuItem value="All" key={1}>
							{"All"}
						</MenuItem>

						{poiNames &&
							poiNames.map((name, i) => {
								return (
									<MenuItem value={name} key={i + 2}>
										{name}
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
				{showChartType && (
					<FormControl className={classes.formControl} variant="outlined">
						<InputLabel>Chart Type</InputLabel>
						<Select
							value={chartType}
							onChange={onTypeChange}
							label="Chart Type"
						>
							<MenuItem value="revenue">Revenue</MenuItem>
							<MenuItem value="clicks">Clicks</MenuItem>
							<MenuItem value="impressions">Impressions</MenuItem>
						</Select>
					</FormControl>
				)}
				{showOneDate && (
					<FormControl className={classes.formControl} variant="outlined">
						<InputLabel>Date</InputLabel>
						<Select value={date} onChange={onDateChange} label="Date">
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
								<MenuItem value={date} key={1}>
									{format(subDays(new Date(date), 1), "dd MMM yyyy")}
								</MenuItem>
							)}
						</Select>
					</FormControl>
				)}
			</Grid>

			<div className={classes.chartContainer}>
				{" "}
				<Bar options={options} data={data} />
			</div>
		</Card>
	);
}

export default BarGraph;
