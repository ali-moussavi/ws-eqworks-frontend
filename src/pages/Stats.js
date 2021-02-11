import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";

import "./Stats.css";

function Stats() {
	const [hourlyStats, setHourlyStats] = useState([]);
	const [dailyStats, setDailyStats] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (sessionStorage.getItem("hourlyStats")) {
				setHourlyStats(JSON.parse(sessionStorage.getItem("hourlyStats")));
				setDailyStats(JSON.parse(sessionStorage.getItem("dailyStats")));
			} else {
				await fetch(process.env.REACT_APP_BACKEND_URL + "api/stats/hourly")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						setHourlyStats(data);
						sessionStorage.setItem("hourlyStats", JSON.stringify(data));
					});

				await fetch(process.env.REACT_APP_BACKEND_URL + "api/stats/daily")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						setDailyStats(data);
						sessionStorage.setItem("dailyStats", JSON.stringify(data));
					});
			}
		};

		fetchData()
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			direction="column"
			className="statsPage"
		>
			<Grid container direction="row" justify="flex-start" alignItems="center">
				<Typography
					variant="h3"
					style={{
						fontWeight: "200",
						borderBottom: "2px solid rgb(80 138 221)",
						marginLeft: "3rem",
						paddingBottom: ".5rem",
						marginBottom: "1rem",
						marginTop: "1rem",
					}}
				>
					Daily Stats
				</Typography>
			</Grid>
			{loading ? (
				<Grid
					container
					alignItems="center"
					justify="center"
					style={{ height: "90vh" }}
				>
					<CircularProgress style={{ marginBottom: "10rem" }} />
				</Grid>
			) : (
				<>
					<div className="graphContainer">
						<LineGraph
							rawData={dailyStats}
							xAxis={"date"}
							yAxis={"revenue"}
							title="Revenue"
							stepSize={5}
						></LineGraph>
						<LineGraph
							rawData={dailyStats}
							xAxis={"date"}
							yAxis={"impressions"}
							title="Impressions"
							stepSize={5}
						></LineGraph>
						<LineGraph
							rawData={dailyStats}
							xAxis={"date"}
							yAxis={"clicks"}
							title="Clicks"
							stepSize={5}
						></LineGraph>
						<LineGraph
							rawData={dailyStats}
							xAxis={"date"}
							yAxis={"clicksPerImpressions"}
							title="Click Per Impression Percentage"
							stepSize={5}
						></LineGraph>
						<LineGraph
							rawData={dailyStats}
							xAxis={"date"}
							yAxis={"revenuePerClick"}
							title="Revenue Per Click"
							stepSize={5}
						></LineGraph>
					</div>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="center"
					>
						<Typography
							variant="h3"
							style={{
								fontWeight: "200",
								borderBottom: "2px solid rgb(80 138 221)",
								marginLeft: "3rem",
								paddingBottom: ".5rem",
								marginBottom: "1rem",
								marginTop: "2.5rem",
							}}
						>
							Hourly Stats
						</Typography>
					</Grid>
					<div className="graphContainer">
						<BarGraph
							rawData={hourlyStats}
							title="Hourly Stats In Each Day"
							showChartType
							showOneDate
						/>
					</div>
					<div className="graphContainer">
						<BarGraph
							rawData={hourlyStats}
							title="Overall Hourly Stats"
							showChartType
						/>
					</div>
				</>
			)}
		</Grid>
	);
}

export default Stats;
