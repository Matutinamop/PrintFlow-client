import {
	eachDayOfInterval,
	format,
	isWeekend,
	startOfDay,
} from 'date-fns';

const now = format(startOfDay(new Date()), 'dd/MM/yyyy');

export const parseDate = (dateString) => {
	let [day, month, year] = dateString.split('/');
	if (year < 100) {
		year = Number(year);
		year += 2000;
	}
	return new Date(year, month - 1, day);
};

export const today = () => {
	let today = format(startOfDay(new Date()), 'dd/MM/yyyy');
	return today;
};

export const isUrgent = (order) => {
	if (order) {
		const { dateFinal, status } = order;
		if (status === 'En espera' || status === 'En proceso') {
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

		if (status === 'En espera' || status === 'En proceso') {
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
