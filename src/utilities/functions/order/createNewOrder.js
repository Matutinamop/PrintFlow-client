import axios from 'axios';
import { toDateObject, today } from '../dates';
import { format } from 'date-fns';

export const createNewOrder = async (fields) => {
	const {
		orderNumber,
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
		deviation,
	} = fields;

	const newContact = !client.contact.some(
		(cont) =>
			cont.name === contactName &&
			cont.phone === contactPhone &&
			cont.email === contactEmail
	);

	scheme?.files?.forEach((file) => {
		delete file.lastModified;
		delete file.lastModifiedDate;
		delete file.webkitRelativePath;
	});

	if (newContact) {
		try {
			const updatedContacts = [
				...client.contact,
				{
					name: contactName,
					phone: contactPhone,
					email: contactEmail,
				},
			];
			const response = await axios.put(
				`${process.env.REACT_APP_API_URL}/api/client/${client._id}`,
				{ contact: updatedContacts }
			);
		} catch (error) {
			console.error(error);
		}
	}

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

	const stationsList = tasks
		.filter((task) => task.operation)
		.map((task, index) => {
			if (!task._id) {
				return;
			} else {
				return {
					station: task.operation._id ?? task.operation,
					completed: false,
					number: index,
				};
			}
		})
		.filter(Boolean);

	const body = {
		orderNumber,
		product,
		client,
		contact: {
			name: contactName,
			phone: contactPhone,
			email: contactEmail,
		},
		deliveryData,
		status: 'Abierta',
		request:
			'asdasd' /* aca tengo que ver si va a ir o no en el formulario */,
		scheme,
		dateCreated: new Date(),
		dateEstimate: dateEstimate
			? toDateObject(dateEstimate)
			: '',
		dateFinal: dateFinal ? toDateObject(dateFinal) : '',
		descriptionClient,
		descriptionWork,
		descriptionPrivate,
		tasks,
		stationsList,
		budgetEstimate,
		budget,
		deviation: `${deviation} %`,
		fields,
	};

	console.log('tasks', tasks);

	try {
		const response = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/order`,
			body
		);
		localStorage.removeItem('fields');
		return response;
	} catch (error) {
		console.error(error);
	}
};
