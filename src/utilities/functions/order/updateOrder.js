import axios from 'axios';
import { format } from 'date-fns';
import { activateOrder } from './activateOrder';
import { deactivateOrder } from './deactivateOrder';
import { toDateObject } from '../dates';

export const updateOrder = async (id, fields) => {
	const {
		product,
		client,
		contactName,
		contactPhone,
		contactEmail,
		deliveryData,
		scheme,
		dateEstimate,
		dateFinal,
		descriptionClient,
		descriptionWork,
		descriptionPrivate,
		printTasks,
		otherTasks,
		status,
		deviation,
	} = fields;

	const tasks = [...printTasks, ...otherTasks];
	let budgetEstimate = 0,
		budget = 0;

	printTasks.map((task) => {
		if (task.estimatedCost) {
			budgetEstimate += task.estimatedCost;
			budget += task.totalCost;
		}
	});
	otherTasks.map((task) => {
		task.estimatedCost
			? (budgetEstimate += task.estimatedCost)
			: (budgetEstimate += Number(task.cost));
		task.cost
			? (budget += Number(task.cost))
			: (budget += task.estimatedCost);
	});

	const body = {
		product,
		client,
		contact: {
			name: contactName,
			phone: contactPhone,
			email: contactEmail,
		},
		deliveryData,
		request:
			'asdasd' /* aca tengo que ver si va a ir o no en el formulario */,
		scheme,
		dateEstimate: dateEstimate
			? toDateObject(dateEstimate)
			: '',
		dateFinal: dateFinal ? toDateObject(dateFinal) : '',
		descriptionClient,
		descriptionWork,
		descriptionPrivate,
		tasks,
		budgetEstimate,
		budget,
		deviation: `${deviation} %`,
		status,
		fields,
	};

	console.log('tasksupdate', tasks);

	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			body
		);
		localStorage.removeItem('fields');
	} catch (error) {
		console.error(error);
	}
};

export const acceptOrder = async (id) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{ status: 'Aceptada' }
		);
		if (response) {
			activateOrder(response.data.updatedOrder);
		}
	} catch (error) {
		console.error(error);
	}
};
