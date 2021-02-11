import { Card, CircularProgress, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState, Fragment } from "react";
import CustomTable from "../components/Table";
import Map from "../components/Map";
import "./Poi.css";

const useStyles = makeStyles({
	card: {
		maxWidth: "30rem",
		padding: "1.5rem",
		margin: "1rem",
		boxShadow: "0 0 25px rgb(0 0 0 / 18%)",
		borderRadius: "10px",
	},
});

function Poi() {
	const [poiData, setPoiData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 47.279229, lng: -99.492188 });
	const [mapZoom, setMapZoom] = useState(3);
	const [poiNames, setPoiNames] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [loading, setLoading] = useState(true);

	const classes = useStyles();

	const generatePoiNames = (rawData_) => {
		let poiNames = [];
		rawData_.forEach((data) => {
			if (!poiNames.includes(data.name)) {
				poiNames.push(data.name);
			}
		});
		return poiNames;
	};

	const generateTableData = (poiData_, startDate, endDate, poiNames_) => {
		let tableData = [];
		poiNames_.forEach((name) => {
			let poiEmptyData = {
				name: name,
				revenue: 0,
				impressions: 0,
				clicks: 0,
				events: 0,
			};

			tableData.push(poiEmptyData);
		});

		// console.log(tableData);

		poiData_.forEach((data) => {
			if (data.date >= startDate && data.date <= endDate) {
				tableData.forEach((element) => {
					if (element.name === data.name) {
						if (data.events !== null) {
							element.events += parseFloat(data.events);
						}
						element.revenue += parseFloat(data.revenue);
						element.impressions += parseFloat(data.impressions);
						element.clicks += parseFloat(data.clicks);
						element.lat = data.lat;
						element.lon = data.lon;
					}
				});
			}
		});

		return tableData;
	};

	useEffect(() => {
		const fetchData = async () => {
			if (sessionStorage.getItem("poiData")) {
				let poiDataFromStorage = JSON.parse(sessionStorage.getItem("poiData"));
				setPoiData(poiDataFromStorage);
				setPoiNames(generatePoiNames(poiDataFromStorage));
			} else {
				await fetch("api/poi")
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						setPoiData(data);
						setPoiNames(generatePoiNames(data));
						sessionStorage.setItem("poiData", JSON.stringify(data));
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

	useEffect(() => {
		if (poiData[0]) {
			let initialTableData = generateTableData(
				poiData,
				poiData[0].date,
				poiData[poiData.length - 1].date,
				poiNames
			);

			setTableData(initialTableData);
		}
	}, [poiData, poiNames]);

	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			direction="column"
			className="PoiPage"
		>
			<Grid
				container
				item
				direction="row"
				justify="flex-start"
				alignItems="center"
				style={{ alignSelf: "flex-start" }}
			>
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
					POI Data
				</Typography>
			</Grid>
			<Grid container direction="column" justify="center" alignItems="center">
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
						<Grid item xs={12}>
							<CustomTable
								rawData={poiData}
								tableData={tableData}
								className={classes.card}
								regenerateTableData={generateTableData}
								setTableData={setTableData}
								poiNames={poiNames}
								setMapCenter={setMapCenter}
								setMapZoom={setMapZoom}
							/>
						</Grid>
						<Grid item xs={12}>
							<Card className="mapCard">
								<Map
									center={mapCenter}
									zoom={mapZoom}
									locations={tableData}
								></Map>
							</Card>
						</Grid>
					</>
				)}
			</Grid>
		</Grid>
	);
}

export default Poi;
