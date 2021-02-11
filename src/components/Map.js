import React from "react";
import { MapContainer, Marker, TileLayer, useMap, Popup } from "react-leaflet";
import numeral from "numeral";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "./Map.css";

import L from "leaflet";
import { Grid } from "@material-ui/core";

export const customMarker = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [10, 41],
	popupAnchor: [2, -40],
});

function ChangeView({ center, zoom }) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

function Map({ center, zoom, locations }) {
	return (
		<div className="map">
			<MapContainer center={center} zoom={zoom} minZoom={2}>
				<ChangeView center={center} zoom={zoom} />
				<TileLayer
					url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
					maxZoom={18}
					id="mapbox/streets-v11"
					tileSize={512}
					zoomOffset={-1}
					accessToken="pk.eyJ1Ijoic21hcG8iLCJhIjoiY2trd3NraGJ5MGp1eDJ4bzRob2F4c3AyNiJ9._QbSCAyV2ilH2KPoBJ7uzA"
				/>
				<MarkerClusterGroup>
					{locations.map((location, i) => {
						return (
							<Marker
								icon={customMarker}
								position={[location.lat, location.lon]}
								key={i + 1}
							>
								<Popup>
									<Grid container direction="column">
										<Grid>
											<strong>{location.name}</strong>
										</Grid>
										<Grid>
											{`Revenue: ${numeral(location.revenue).format(
												"$0.0a"
											)}`}
										</Grid>
										<Grid>
											{`Impressions: ${numeral(
												location.impressions
											).format("0.0a")}`}
										</Grid>
										<Grid>
											{`Clicks: ${numeral(location.clicks).format(
												"0.0a"
											)}`}
										</Grid>
										<Grid>
											{`Events: ${numeral(location.events).format(
												"0a"
											)}`}
										</Grid>
									</Grid>
								</Popup>
							</Marker>
						);
					})}
				</MarkerClusterGroup>
			</MapContainer>
		</div>
	);
}

export default Map;
