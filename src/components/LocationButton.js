import { Button } from "@material-ui/core";
import React from "react";

function LocationButton({ lat, lon, setMapCenter, setMapZoom, scrollToBottom }) {
	return (
		<Button
			style={{ width: "130px", height: "36px" }}
			variant="contained"
			color="primary"
			onClick={() => {
				setMapCenter({ lat: lat, lng: lon });
				setMapZoom(13);
				scrollToBottom();
			}}
		>
			Show On Map
		</Button>
	);
}

export default LocationButton;
