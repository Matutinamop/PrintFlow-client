export function bulkPaperQuantity(
	sheetPerBulk,
	sheetQuantity,
	excess
) {
	console.log(Math.ceil(sheetQuantity / sheetPerBulk));
	return (
		Math.ceil(sheetQuantity / sheetPerBulk) +
		parseInt(excess)
	);
}

export function paperCostByWeight(
	grammage,
	paperCostPerTon
) {
	console.log(paperCostPerTon / 1000);
	return (paperCostPerTon / 1000) * (grammage / 1000);
}
