import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState, Fragment } from "react";
import LineGraph from "../components/LineGraph";
import BarGraph from "../components/BarGraph";

import "./Events.css";

function Events() {
	const [hourlyEvents, setHourlyEvents] = useState([]);
	const [dailyEvents, setDailyEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (sessionStorage.getItem("hourlyEvents")) {
				setHourlyEvents(JSON.parse(sessionStorage.getItem("hourlyEvents")));
				setDailyEvents(JSON.parse(sessionStorage.getItem("dailyEvents")));
			} else {
				await fetch(process.env.REACT_APP_BACKEND_URL + "api/events/hourly")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						setHourlyEvents(data);
						sessionStorage.setItem("hourlyEvents", JSON.stringify(data));
					});

				await fetch(process.env.REACT_APP_BACKEND_URL + "api/events/daily")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						//console.log(data);
						setDailyEvents(data);
						sessionStorage.setItem("dailyEvents", JSON.stringify(data));
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
			className="EventsPage"
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
					Daily Events
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
							rawData={dailyEvents}
							xAxis={"date"}
							yAxis={"events"}
							title="Number Of Events"
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
							Hourly Events
						</Typography>
					</Grid>
					<div className="graphContainer">
						<BarGraph
							rawData={hourlyEvents}
							title="Hourly Events In Each Day"
							initialChartType="events"
							showOneDate
						/>
					</div>
					<div className="graphContainer">
						<BarGraph
							rawData={hourlyEvents}
							title="Overall Hourly Events"
							initialChartType="events"
						/>
					</div>
				</>
			)}
		</Grid>
	);
}

export default Events;
