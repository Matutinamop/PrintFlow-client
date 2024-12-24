import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingOperation: true,
	operations: [],
	operation: {},
	errorOperation: '',
};

const fetchOperations = createAsyncThunk(
	'operation/fetchOperations',
	async () => {
		try {
			const response = await axios.get(
				`${url}/api/operation`
			);
			return response.data.operations;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchOperationById = createAsyncThunk(
	'operation/fetchById',
	async (id) => {
		try {
			const response = await axios.get(
				`${url}/api/operation/${id}`
			);
			return response.data.operation;
		} catch (error) {
			console.error(error);
		}
	}
);

const operationSlice = createSlice({
	name: 'operation',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchOperations.pending, (state) => {
			state.loadingOperation = true;
		});
		builder.addCase(
			fetchOperations.fulfilled,
			(state, action) => {
				state.loadingOperation = false;
				state.operations = action.payload;
				state.errorOperation = '';
			}
		);
		builder.addCase(
			fetchOperations.rejected,
			(state, action) => {
				state.loadingOperation = false;
				state.operations = [];
				state.errorOperation = action.error.message;
			}
		);
		builder.addCase(fetchOperationById.pending, (state) => {
			state.operation = {};
		});
		builder.addCase(
			fetchOperationById.fulfilled,
			(state, action) => {
				state.operation = action.payload;
			}
		);
		builder.addCase(
			fetchOperationById.rejected,
			(state) => {
				state.operation = {};
			}
		);
	},
});

export const { reducer: operationReducer } = operationSlice;
export { fetchOperations, fetchOperationById };
