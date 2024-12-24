export function bulkPaperQuantity(
	sheetPerBulk,
	sheetQuantity,
	excess
) {
	console.log(
		Math.ceil(
			(sheetQuantity + parseInt(excess)) / sheetPerBulk
		)
	);
	return Math.ceil(
		(sheetQuantity + parseInt(excess)) / sheetPerBulk
	);
}

export function paperCostByWeight(
	grammage,
	paperCostPerTon
) {
	console.log(paperCostPerTon / 1000);
	return (paperCostPerTon / 1000) * (grammage / 1000);
}
