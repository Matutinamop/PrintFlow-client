import axios from 'axios';
import { format, startOfDay } from 'date-fns';
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

	let budgetEstimate = 0,
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
	});
	try {
		console.log('llegue aca');
		const fieldsIdResponse = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`
		);
		const fieldsId = fieldsIdResponse.data.order.fields._id;
		console.log('fieldsId', fieldsId);

		const fieldsResponse = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/orderFields/${fieldsId}`,
			{ values: fields }
		);

		console.log('fieldsResponse', fieldsResponse);

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
			budgetEstimate,
			budget,
			deviation: `${deviation} %`,
			status,
		};

		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			body
		);
		localStorage.removeItem('fields');
		const prevStatus = response.data.orderToUpdate.status;
		if (
			(prevStatus === 'Aceptada' ||
				prevStatus === 'Detenida' ||
				prevStatus === 'Para facturar' ||
				prevStatus === 'Para enviar') &&
			(status === 'Finalizada' || status === 'Abierta')
		) {
			deactivateOrder(id);
		}
		if (
			status === 'Aceptada' &&
			prevStatus !== 'Aceptada'
		) {
			activateOrder(id);
		}
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
		const status = response.orderToUpdate.status;
		if (status === 'Abierta') {
			activateOrder(id);
		}
	} catch (error) {
		console.error(error);
	}
};

export const completeOrder = async (id) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{ status: 'Para facturar' }
		);
	} catch (error) {
		console.error(error);
	}
};

export const billOrder = async (id, billNumber) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{
				status: 'Para enviar',
				bill: {
					number: billNumber,
					date: startOfDay(new Date()),
				},
			}
		);
	} catch (error) {
		console.error(error);
	}
};

export const sendOrder = async (id, setCurrentStatus) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{ status: 'Finalizada' }
		);
		const stationsResponse = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/workStation/lite`
		);
		const stations = stationsResponse.data.stations;
		const deliveryStation = stations.find(
			(station) => station.name === 'Envío'
		);
		const newTasks = deliveryStation.tasks.filter(
			(task) => task !== id
		);
		const res = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/workstation/${deliveryStation._id}`,
			{ tasks: newTasks }
		);
		setCurrentStatus('Finalizada');
	} catch (error) {
		console.error(error);
	}
};

export const stopOrder = async (id, setCurrentStatus) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{ status: 'Detenida' }
		);
		setCurrentStatus('Detenida');
	} catch (error) {
		console.error(error);
	}
};

export const unStopOrder = async (id, setCurrentStatus) => {
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/order/${id}`,
			{ status: 'Aceptada' }
		);
		setCurrentStatus('Aceptada');
	} catch (error) {
		console.error(error);
	}
};
