import { Button } from "@material-ui/core";
import { ArrowUpward, ArrowDownward } from "@material-ui/icons";
import React from "react";

function TableHeaderButton({
	titleToShow,
	title,
	setCompareKey,
	setSortDirection,
	isSelected,
	sortDirection,
}) {
	const clickHandler = () => {
		setCompareKey(title);
		if (isSelected) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortDirection("desc");
		}
	};

	return (
		<Button
			style={{ minWidth: "0px", marginLeft: "-.5rem" }}
			onClick={clickHandler}
			endIcon={
				sortDirection === "asc" && isSelected ? (
					<ArrowDownward />
				) : sortDirection === "desc" && isSelected ? (
					<ArrowUpward />
				) : (
					""
				)
			}
		>
			{titleToShow}
		</Button>
	);
}

export default TableHeaderButton;
