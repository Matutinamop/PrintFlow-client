import { configureStore } from '@reduxjs/toolkit';
import { workStationReducer } from './workStation/workStationSlice';
import { ordersReducer } from './orders/ordersSlice';

const store = configureStore({
	reducer: {
		workStation: workStationReducer,
		orders: ordersReducer,
	},
});

export default store;
