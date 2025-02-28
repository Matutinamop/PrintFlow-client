import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingClient: true,
	clients: [],
	client: {},
	errorClient: '',
	clientsCount: 0,
	allClientsCount: 0,
};

const fetchClients = createAsyncThunk(
	'client/fetchClients',
	async () => {
		try {
			const response = await axios.get(`${url}/api/client`);
			return response.data.clients;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchFilteredClients = createAsyncThunk(
	'client/fetchFilteredClients',
	async ({ from, searchTerm, page, limit }) => {
		try {
			const response = await axios.get(
				`${url}/api/client/filtered`,
				{
					params: {
						...(page && { page }),
						...(from && { from }),
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

const fetchClientById = createAsyncThunk(
	'client/fetchById',
	async (id) => {
		try {
			const response = await axios.get(
				`${url}/api/client/${id}`
			);
			return response.data.client;
		} catch (error) {
			console.error(error);
		}
	}
);

const clientSlice = createSlice({
	name: 'client',
	initialState,
	reducers: {
		cleanClient: (state) => {
			state.client = {};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchClients.pending, (state) => {
			state.loadingClient = true;
		});
		builder.addCase(
			fetchClients.fulfilled,
			(state, action) => {
				state.loadingClient = false;
				state.clients = action.payload;
				state.errorClient = '';
			}
		);
		builder.addCase(
			fetchClients.rejected,
			(state, action) => {
				state.loadingClient = false;
				state.clients = [];
				state.errorClient = action.error.message;
			}
		);

		builder.addCase(
			fetchFilteredClients.pending,
			(state) => {
				state.loadingClient = true;
			}
		);
		builder.addCase(
			fetchFilteredClients.fulfilled,
			(state, action) => {
				state.loadingClient = false;
				state.clients = action.payload.clients;
				state.errorClient = '';
				state.clientsCount = action.payload.count;
				state.allClientsCount = action.payload.count;
			}
		);
		builder.addCase(
			fetchFilteredClients.rejected,
			(state, action) => {
				state.loadingClient = false;
				state.errorClient = action.error.message;
			}
		);

		builder.addCase(fetchClientById.pending, (state) => {
			state.client = {};
		});
		builder.addCase(
			fetchClientById.fulfilled,
			(state, action) => {
				state.client = action.payload;
			}
		);
		builder.addCase(fetchClientById.rejected, (state) => {
			state.client = {};
		});
	},
});

export const { reducer: clientReducer } = clientSlice;
export const { cleanClient } = clientSlice.actions;
export {
	fetchClients,
	fetchClientById,
	fetchFilteredClients,
};
