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
	return (
		Math.round(
			(paperCostPerTon / 1000) * (grammage / 1000) * 1000
		) / 1000
	);
}
