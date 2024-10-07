import { configureStore } from '@reduxjs/toolkit';
import { workStationReducer } from './workStations/workStationSlice';
import { ordersReducer } from './orders/ordersSlice';
import { taskReducer } from './tasks/tasksSlice';

const store = configureStore({
	reducer: {
		workStations: workStationReducer,
		orders: ordersReducer,
		tasks: taskReducer,
	},
});

export default store;
