export function bulkPaperQuantity(
	sheetPerBulk,
	sheetQuantity,
	excess
) {
	return Math.ceil(
		(sheetQuantity + parseInt(excess)) / sheetPerBulk
	);
}

export function paperCostByWeight(
	grammage,
	paperCostPerTon
) {
	return (paperCostPerTon / 1000) * (grammage / 1000);
}
