import { combineReducers } from '@reduxjs/toolkit';
import { workStationReducer } from './workStations/workStationSlice';
import { ordersReducer } from './orders/ordersSlice';
import { taskReducer } from './tasks/tasksSlice';
import { clientReducer } from './clients/clientsSlice';
import { materialReducer } from './materials/materialsSlice';

const rootReducer = combineReducers({
	workStations: workStationReducer,
	orders: ordersReducer,
	tasks: taskReducer,
	clients: clientReducer,
	materials: materialReducer,
});

export default rootReducer;
