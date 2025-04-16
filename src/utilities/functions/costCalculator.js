export const costCalculator = (operation, quantity) => {
	let price = 0;

	if (operation.unitCost) {
		price += operation.unitCost * quantity;
	}

	if (operation.pricingRules.length > 0) {
		const { pricingRules } = operation;

		const range = pricingRules.find(
			(rule) =>
				rule.rangeStart <= quantity &&
				(!rule.rangeEnd || rule.rangeEnd > quantity)
		);

		price += (range?.price * quantity) / range?.step;
	}

	if (operation.minPrice && price < operation.minPrice) {
		price = operation.minPrice;
	}

	return Math.round(price);
};

export const printCost = (module) => {
	let price = 0;

	if (module.paperCost) {
		price += module.paperCost;
	}

	if (module.plateCost) {
		price += module.plateCost;
	}

	if (module.postureCost) {
		price += module.postureCost;
	}

	return Math.round(price);
};

export const printModuleCost = (module) => {
	if (module.printCost && module.moduleRepeat) {
		const price = module.printCost * module.moduleRepeat;
		return Math.round(price);
	}
};

export const toRawNumber = (number) => {
	if (typeof number === 'string') {
		const raw = number
			.replace(/\./g, '') // elimina puntos de miles
			.replace(',', '.'); // cambia la coma decimal por punto

		const res = Number(raw || '0');
		return res;
	}
	return number;
};

export const toFormatNumber = (number) => {
	const raw = String(number)
		.replace(/\./g, '')
		.replace(',', '');
	const res = new Intl.NumberFormat('es-AR').format(raw);
	return res;
};
