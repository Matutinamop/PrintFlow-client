import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingOrders: true,
	orders: [],
	activeOrders: [],
	errorOrders: '',
	ordersCount: 0,
	allOrdersCount: 0,
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
			return response.data;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchActiveOrders = createAsyncThunk(
	'orders/fetchActiveOrders',
	async () => {
		try {
			const response = await axios.get(
				`${url}/api/order/active`
			);
			return response.data;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchFilteredOrders = createAsyncThunk(
	'orders/fetchFilteredOrders',
	async ({
		searchTerm,
		status,
		page,
		limit,
		dateOrder = false,
	}) => {
		try {
			const response = await axios.get(
				`${url}/api/order/filtered`,
				{
					params: {
						...(page && { page }),
						...(searchTerm && { searchTerm }),
						...(status && { status }),
						...(limit && { limit }),
						...(dateOrder && { dateOrder }),
					},
				}
			);
			return response.data;
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
				state.orders = action.payload.orders;
				state.errorOrders = '';
				state.ordersCount = action.payload.count;
				state.allOrdersCount = action.payload.count;
			}
		);
		builder.addCase(
			fetchOrdersPage.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
				state.ordersCount = 0;
			}
		);
		builder.addCase(fetchActiveOrders.pending, (state) => {
			state.loadingOrders = true;
		});
		builder.addCase(
			fetchActiveOrders.fulfilled,
			(state, action) => {
				state.loadingOrders = false;
				state.activeOrders = action.payload.orders;
			}
		);
		builder.addCase(
			fetchActiveOrders.rejected,
			(state, action) => {
				state.loadingOrders = false;
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
				state.orders = action.payload.orders;
				state.errorOrders = '';
				state.ordersCount = action.payload.count;
			}
		);
		builder.addCase(
			fetchFilteredOrders.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
				state.ordersCount = 0;
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
				state.orders = [action.payload];
				state.errorOrders = '';
				state.ordersCount = 1;
			}
		);
		builder.addCase(
			fetchOrderByOrderNumber.rejected,
			(state, action) => {
				state.loadingOrders = false;
				state.orders = [];
				state.errorOrders = action.error.message;
				state.ordersCount = 0;
			}
		);
	},
});

export const { reducer: ordersReducer } = ordersSlice;
export {
	fetchOrdersPage,
	fetchActiveOrders,
	fetchFilteredOrders,
	fetchOrderByOrderNumber,
};
