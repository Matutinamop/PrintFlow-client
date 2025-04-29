import {
	eachDayOfInterval,
	format,
	isWeekend,
	startOfDay,
} from 'date-fns';

const now = format(startOfDay(new Date()), 'dd/MM/yyyy');

export const toDateObject = (fechaStr) => {
	if (!fechaStr) return null;

	if (/^\d{2,4}\/\d{2}\/\d{2}$/.test(fechaStr)) {
		const [year, month, day] = fechaStr.split('-');
		const fullYear =
			year.length === 2
				? Number('20' + year)
				: Number(year);
		return new Date(
			fullYear,
			Number(month) - 1,
			Number(day)
		);
	}

	const parsed = new Date(fechaStr);
	return isNaN(parsed) ? null : parsed;
};

export const toFormatDate = (dateStr) => {
	if (!dateStr) {
		return null;
	}
	const date = new Date(dateStr);
	if (isNaN(date)) return null;

	// Usa funciones UTC para evitar desfase por zona horaria
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(
		2,
		'0'
	); // Los meses comienzan en 0, por eso sumamos 1
	const year = String(date.getUTCFullYear()).slice(-2); // Toma los dos últimos dígitos del año

	return `${day}/${month}/${year}`;
};

export const parseDate = (dateString) => {
	let [day, month, year] = dateString.split('/');
	if (year < 100) {
		year = Number(year);
		year += 2000;
	}
	return new Date(year, month - 1, day);
};

/* export const today = () => {
	let today = format(startOfDay(new Date()), 'dd/MM/yyyy');
	return today;
}; */

export const warningLevel = (order) => {
	const { dateFinal, dateEstimate, status } = order;
	const limitDate = dateFinal
		? new Date(dateFinal)
		: dateEstimate
		? new Date(dateEstimate)
		: null;
	const today = startOfDay(new Date());

	if (
		status === 'Abierta' ||
		status === 'Finalizada' ||
		!limitDate
	) {
		return 0;
	}

	if (limitDate > today) {
		const daysInRange = eachDayOfInterval({
			start: today,
			end: limitDate,
		});
		const businessDays = daysInRange.filter(
			(date) => !isWeekend(date)
		).length;

		switch (businessDays) {
			case 0:
			case 1:
				return 5;
			case 2:
				return 4;
			case 3:
				return 3;
			case 4:
				return 2;
			case 5:
				return 1;
			default:
				return 0;
		}
	}
	return 5;
};

export const isUrgent = (order) => {
	if (order?.dateFinal) {
		const { dateFinal, status } = order;
		if (status === 'Abierta' || status === 'Aceptada') {
			const startDate = parseDate(now);
			const endDate = parseDate(dateFinal);
			if (endDate > startDate) {
				const daysInRange = eachDayOfInterval({
					start: startDate,
					end: endDate,
				});
				const businessDays = daysInRange.filter(
					(date) => !isWeekend(date)
				);
				return businessDays.length < 3;
			}
			return true;
		}
	}
	return false;
};

export const isWarning = (order) => {
	if (order) {
		const { dateEstimate, status } = order;

		if (status === 'Abierta' || status === 'Aceptada') {
			const startDate = parseDate(now);
			const endDate = parseDate(dateEstimate);
			if (dateEstimate > now) {
				const daysInRange = eachDayOfInterval({
					start: startDate,
					end: endDate,
				});

				const businessDays = daysInRange.filter(
					(date) => !isWeekend(date)
				);
				return businessDays.length < 3;
			}
			return true;
		}
	}
	return false;
};
