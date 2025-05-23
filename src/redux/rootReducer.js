import { combineReducers } from '@reduxjs/toolkit';
import { workStationReducer } from './workStations/workStationSlice';
import { ordersReducer } from './orders/ordersSlice';
import { taskReducer } from './tasks/tasksSlice';
import { clientReducer } from './clients/clientsSlice';
import { materialReducer } from './materials/materialsSlice';
import { operationReducer } from './operations/operationsSlice';
import { exchangesReducer } from './exchanges/exchangesSlice';
import { commentsReducer } from './comments/comments';

const rootReducer = combineReducers({
	workStations: workStationReducer,
	orders: ordersReducer,
	tasks: taskReducer,
	clients: clientReducer,
	materials: materialReducer,
	operations: operationReducer,
	exchanges: exchangesReducer,
	comments: commentsReducer,
});

export default rootReducer;
