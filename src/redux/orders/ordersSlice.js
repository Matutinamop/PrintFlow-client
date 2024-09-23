import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingOrders: true,
	orders: [],
	errorOrders: '',
};

const fetchOrdersPage = createAsyncThunk(
	'orders/fetchOrdersPage',
	async (from) => {
		try {
			const response = await axios.get(
				`${url}/api/order/page`,
				{
					params: from ? { from } : {},
				}
			);
			return response.data.orders;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchFilteredOrders = createAsyncThunk(
	'orders/fetchFilteredOrders',
	async (client, product, status, from) => {
		try {
			const response = await axios.get(
				`${url}/api/order/filtered`,
				{
					params: {
						...(from && { lastOrderNumber: from }),
						...(client && { client }),
						...(product && { product }),
						...(status && { status }),
					},
				}
			);
			return response.data.orders;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchOrderByOrderNumber = createAsyncThunk(
	'orders/fetchOrderByOrderNumber',
	async (number) => {
		try {
			const response = await axios.get(
				`${url}/api/order/number/${number}`
			);
			return response.data.order;
		} catch (error) {
			console.error(error);
		}
	}
);

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchOrdersPage.pending, (state) => {
			state.loadingOrders = true;
		});
		builder.addCase(
			fetchOrdersPage.fulfilled,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = action.payload;
				state.errorOrders = '';
			}
		);
		builder.addCase(
			fetchOrdersPage.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
			}
		);
		builder.addCase(
			fetchFilteredOrders.pending,
			(state) => {
				state.loadingOrders = true;
			}
		);
		builder.addCase(
			fetchFilteredOrders.fulfilled,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = action.payload;
				state.errorOrders = '';
			}
		);
		builder.addCase(
			fetchFilteredOrders.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
			}
		);
		builder.addCase(
			fetchOrderByOrderNumber.pending,
			(state) => {
				state.loadingOrders = true;
			}
		);
		builder.addCase(
			fetchOrderByOrderNumber.fulfilled,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = action.payload;
				state.errorOrders = '';
			}
		);
		builder.addCase(
			fetchOrderByOrderNumber.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
			}
		);
	},
});

export const { reducer: ordersReducer } = ordersSlice;
export { fetchOrdersPage };
