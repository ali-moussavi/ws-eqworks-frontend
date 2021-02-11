import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import {
	Card,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { addDays } from "date-fns";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "1.5rem 1rem 1.5rem 1rem",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		margin: "1.5rem",
		boxShadow: "0 0 25px rgb(0 0 0 / 18%)",
		borderRadius: "10px",
		width: "500px",
		[theme.breakpoints.down("l")]: {
			width: "100%",
		},
	},

	chartContainer: {
		height: "18rem",
		width: "100%",
	},

	title: {
		fontSize: 14,
	},
}));

function LineGraph({ rawData, xAxis, yAxis, title, stepSize }) {
	const [chartData, setChartData] = useState([]);
	const [poiName, setPoiName] = useState("All");
	const [poiNames, setPoiNames] = useState([]);
	const classes = useStyles();

	const onPoiChange = (event) => {
		setPoiName(event.target.value);
	};

	const options = {
		legend: {
			display: false,
		},
		responsive: true,
		maintainAspectRatio: false,
		elements: {
			point: {
				radius: 2,
			},
		},
		tooltips: {
			mode: "index",
			intersect: false,
			callbacks: {
				label: function (tooltipItem, data) {
					if (yAxis === "clicksPerImpressions") {
						return numeral(tooltipItem.value).format("0.000%");
					} else if (yAxis === "revenuePerClick") {
						return numeral(tooltipItem.value).format("0.0a");
					} else {
						return numeral(tooltipItem.value).format("0,0");
					}
				},
			},
		},
		scales: {
			xAxes: [
				{
					type: "time",
					time: {
						stepSize: stepSize,
						displayFormats: {
							millisecond: "MMM DD",
							second: "MMM DD",
							minute: "MMM DD",
							hour: "MMM DD ",
							day: "MMM DD",
							week: "MMM DD",
							month: "MMM DD",
							quarter: "MMM DD",
							year: "MMM DD",
						},
						tooltipFormat: "ll",
					},
				},
			],
			yAxes: [
				{
					scaleLabel: {
						display: true,
						labelString: title,
					},
					ticks: {
						callback: function (value, index, values) {
							if (yAxis === "clicksPerImpressions") {
								return numeral(value).format("0.000%");
							} else if (
								yAxis === "revenue" ||
								yAxis === "revenuePerClick"
							) {
								return numeral(value).format("$0.0a");
							} else {
								return numeral(value).format("0.0a");
							}
						},
					},
				},
			],
		},
	};

	useEffect(() => {
		const generateChartData = (rawData_, xAxis_, yAxis_, poi_) => {
			let chartData = [];

			//we need this counter to calculate the average of data in click per impression and revenue per click charts
			let counterForDataInEachDay = 1;

			rawData_.forEach((data, i) => {
				let newPoint = {};
				if (poi_ === "All" || data.name === poi_) {
					if (yAxis === "clicksPerImpressions") {
						let y = data.clicks / data.impressions;
						y = y.toFixed(5);
						newPoint.y = parseFloat(y);
					} else if (yAxis === "revenuePerClick") {
						let y = data.revenue / data.clicks;
						newPoint.y = parseFloat(y);
					} else {
						newPoint.y = parseFloat(data[yAxis_]);
					}

					if (poi_ === "All") {
						if (
							i === 0 ||
							data[xAxis_].substring(0, 10) !==
								rawData[i - 1][xAxis_].substring(0, 10)
						) {
							if (
								i !== 0 &&
								(yAxis === "clicksPerImpressions" ||
									yAxis === "revenuePerClick")
							) {
								chartData[
									chartData.length - 1
								].y /= counterForDataInEachDay;

								counterForDataInEachDay = 1;
							}
							newPoint.x = data[xAxis_].substring(0, 10);
							chartData.push(newPoint);
						} else {
							counterForDataInEachDay++;
							chartData[chartData.length - 1].y += parseFloat(newPoint.y);

							if (
								i === rawData_.length - 1 &&
								(yAxis === "clicksPerImpressions" ||
									yAxis === "revenuePerClick")
							) {
								chartData[
									chartData.length - 1
								].y /= counterForDataInEachDay;
							}
						}
					} else {
						newPoint.x = data[xAxis_].substring(0, 10);
						chartData.push(newPoint);
					}
				}
			});

			// dates with zero events need to be added to chart data
			if (title === "Number Of Events" && poiName !== "All") {
				let newChartData = [];

				chartData.forEach((point, i) => {
					newChartData.push(point);
					if (i !== chartData.length - 1) {
						if (
							addDays(new Date(point.x), 1).toString() !==
							new Date(chartData[i + 1].x).toString()
						) {
							const itemToAdd = { x: addDays(new Date(point.x), 1), y: 0 };
							newChartData.push(itemToAdd);
						}
					}
				});
				chartData = newChartData;
			}

			return chartData;
		};

		setChartData(generateChartData(rawData, xAxis, yAxis, poiName));
	}, [rawData, xAxis, yAxis, poiName, title]);

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
	}, [rawData]);

	//creating gradiant background for chart
	const data = (canvas) => {
		const ctx = canvas.getContext("2d");
		const gradient = ctx.createLinearGradient(0, 0, 0, 360);
		gradient.addColorStop(1, "rgba(34,193,195,0)");
		gradient.addColorStop(0, "rgba(63,81,181,0.9308765742625175)");

		return {
			datasets: [
				{
					backgroundColor: gradient,
					borderColor: "#3F51B5",
					data: chartData,
				},
			],
		};
	};

	return (
		<Card
			className={classes.root}
			style={title.includes("Events") ? { width: "70vw" } : {}}
		>
			<Grid container direction="row" justify="space-between" alignItems="center">
				<Typography
					variant="h5"
					style={{ paddingBottom: "1rem", fontWeight: "300" }}
				>
					{title}
				</Typography>
				<FormControl style={{ margin: "0 1rem 1rem 1rem" }} variant="outlined">
					<InputLabel>POI</InputLabel>
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
			</Grid>

			<div className={classes.chartContainer}>
				<Line options={options} data={data} />
			</div>
		</Card>
	);
}

export default LineGraph;
