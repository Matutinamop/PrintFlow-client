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
	operationsCount: 0,
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

const fetchFilteredOperations = createAsyncThunk(
	'operations/fetchFilteredOperations',
	async ({ searchTerm, page, limit }) => {
		try {
			const response = await axios.get(
				`${url}/api/operation/filtered`,
				{
					params: {
						...(page && { page }),
						...(searchTerm && { searchTerm }),
						...(limit && { limit }),
					},
				}
			);
			return response.data;
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
		builder.addCase(
			fetchFilteredOperations.pending,
			(state) => {
				state.loadingOperation = true;
			}
		);
		builder.addCase(
			fetchFilteredOperations.fulfilled,
			(state, action) => {
				state.loadingOperation = false;
				state.operations = action.payload.operations;
				state.errorOperation = '';
				state.operationsCount = action.payload.count;
			}
		);
		builder.addCase(
			fetchFilteredOperations.rejected,
			(state, action) => {
				state.loadingOperation = false;
				state.operations = [];
				state.errorOperation = action.error.message;
				state.operationsCount = 0;
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
export {
	fetchOperations,
	fetchOperationById,
	fetchFilteredOperations,
};
