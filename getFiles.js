const fs = require("fs");
const fetch = require("node-fetch");

fetch("http://localhost:5555/api/events/hourly")
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		fs.writeFile("eventsHourly.json", JSON.stringify(response), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved in eventsHourly.json .");
		});
	});

fetch("http://localhost:5555/api/events/daily")
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		fs.writeFile("eventsDaily.json", JSON.stringify(response), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved in eventsDaily.json .");
		});
	});

fetch("http://localhost:5555/api/stats/hourly")
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		fs.writeFile("statsHourly.json", JSON.stringify(response), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved in statsHourly.json .");
		});
	});

fetch("http://localhost:5555/api/stats/daily")
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		fs.writeFile("statsDaily.json", JSON.stringify(response), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved in statsDaily.json .");
		});
	});

fetch("http://localhost:5555/api/poi")
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		fs.writeFile("poiData.json", JSON.stringify(response), (err) => {
			if (err) {
				throw err;
			}
			console.log("JSON data is saved in poiData.json .");
		});
	});
