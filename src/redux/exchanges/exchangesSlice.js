import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingExchange: true,
	exchanges: [],
	errorExchange: '',
};

const fetchExchanges = createAsyncThunk(
	'exchanges/fetchExchanges',
	async () => {
		try {
			const response = await axios.get(
				`${url}/api/exchange`
			);
			return response.data.exchanges;
		} catch (error) {
			console.error(error);
		}
	}
);

const exchangesSlice = createSlice({
	name: 'exchanges',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchExchanges.pending, (state) => {
			state.loadingExchange = true;
		});
		builder.addCase(
			fetchExchanges.fulfilled,
			(state, action) => {
				state.loadingExchange = false;
				state.exchanges = action.payload;
				state.errorExchange = '';
			}
		);
		builder.addCase(
			fetchExchanges.rejected,
			(state, action) => {
				state.loadingExchange = false;
				state.exchanges = [];
				state.errorExchange = action.error.message;
			}
		);
	},
});

export const { reducer: exchangesReducer } = exchangesSlice;
export { fetchExchanges };
