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
		finalPrice,
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
	/* let budgetEstimate = 0,
		budget = 0;

	printTasks.forEach((task) => {
		if (task.estimatedCost) {
			budgetEstimate += task.estimatedCost;
			budget += task.totalCost;
		}
	});
	otherTasks.forEach((task) => {
		if (task.estimatedCost) {
			budgetEstimate += task.estimatedCost;
		}
		if (task.cost) {
			budget += task.cost;
		}
	}); */

	const stationsList = tasks
		.filter((task) => task.operation && !task.manualAdded)
		.map((task, index) => {
			return {
				station: task.operation._id ?? task.operation,
				completed: false,
				number: index,
			};
		})
		.filter(Boolean);

	console.log('tasks', tasks);
	console.log('stationsList', stationsList);

	try {
		const fieldsResponse = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/orderFields`,
			{ values: fields }
		);
		const fieldsId = fieldsResponse.data.newOrderFields._id;

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
			scheme,
			dateCreated: new Date(),
			dateEstimate: dateEstimate
				? toDateObject(dateEstimate)
				: '',
			dateFinal: dateFinal ? toDateObject(dateFinal) : '',
			descriptionClient,
			descriptionWork,
			descriptionPrivate,
			stationsList,
			budget: finalPrice,
			deviation: `${deviation} %`,
			fields: fieldsId,
		};

		console.log('body', body);
		console.log('fields', fields);

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
