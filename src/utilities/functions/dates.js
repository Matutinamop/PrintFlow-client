import {
	eachDayOfInterval,
	format,
	isWeekend,
	startOfDay,
} from 'date-fns';

const today = format(startOfDay(new Date()), 'dd/MM/yyyy');

export const parseDate = (dateString) => {
	const [day, month, year] = dateString.split('/');
	return new Date(year, month - 1, day);
};

export const isWarning = (order) => {
	const { dateEstimate, status } = order;
	if (status === 'En espera' || status === 'En proceso') {
		if (dateEstimate > today) {
			const startDate = parseDate(today);
			const endDate = parseDate(dateEstimate);
			const daysInRange = eachDayOfInterval({
				start: startDate,
				end: endDate,
			});

			const businessDays = daysInRange.filter(
				(date) => !isWeekend(date)
			);
			return businessDays.length < 5;
		}
		return true;
	}
	return false;
};
