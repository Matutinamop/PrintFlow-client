import { configureStore } from '@reduxjs/toolkit';
import { workStationReducer } from './workStations/workStationSlice';
import { ordersReducer } from './orders/ordersSlice';
import { taskReducer } from './tasks/tasksSlice';
import { clientReducer } from './clients/clientsSlice';

const store = configureStore({
	reducer: {
		workStations: workStationReducer,
		orders: ordersReducer,
		tasks: taskReducer,
		clients: clientReducer,
	},
});

export default store;
