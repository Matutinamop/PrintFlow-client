import { configureStore } from '@reduxjs/toolkit';
import { workStationReducer } from './workStation/workStationSlice';

const store = configureStore({
	reducer: {
		workStation: workStationReducer,
	},
});

export default store;
