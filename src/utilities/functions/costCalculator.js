export const costCalculator = (operation, quantity) => {
	let price = 0;

	if (operation.unitCost) {
		price += operation.unitCost * quantity;
	}

	if (operation.pricingRules) {
		const { pricingRules } = operation;
		let quantityLeft = quantity;
		let range = 1;

		while (
			quantityLeft > 0 &&
			range < pricingRules.length
		) {
			const {
				rangeStart,
				rangeEnd,
				price: rulePrice,
				step,
			} = pricingRules[range - 1];
			const quantityRange = rangeEnd - rangeStart;
			const applicableQuantity = Math.min(
				quantityLeft,
				quantityRange
			);
			price += (applicableQuantity * rulePrice) / step;
			quantityLeft -= applicableQuantity;
			range++;
		}
		if (quantityLeft > 0 && range === pricingRules.length) {
			const { price: rulePrice, step } =
				pricingRules[range - 1];
			price += (quantityLeft * rulePrice) / step;
			quantityLeft = 0;
		}
	}

	if (operation.minPrice && price < operation.minPrice) {
		price = operation.minPrice;
	}

	return Math.round(price * 100) / 100;
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

	return Math.round(price * 100) / 100;
};

export const printModuleCost = (module) => {
	if (module.printCost && module.moduleRepeat) {
		const price = module.printCost * module.moduleRepeat;
		return Math.round(price * 100) / 100;
	}
};

export const toRawNumber = (number) => {
	if (typeof number === 'string') {
		const raw = number
			.replace(/\./g, '') // elimina puntos de miles
			.replace(',', '.'); // cambia la coma decimal por punto

		const res = parseFloat(raw || '0');
		return res;
	}
	return number;
};

export const toFormatNumber = (number) => {
	const res = new Intl.NumberFormat('es-AR').format(number);
	return res;
};
