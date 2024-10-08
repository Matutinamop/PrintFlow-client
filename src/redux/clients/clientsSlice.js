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
export { fetchClients, fetchClientById };
