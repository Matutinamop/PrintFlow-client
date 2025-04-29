import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingComment: true,
	comments: [],
	errorComment: '',
};

const fetchCommentsByOrder = createAsyncThunk(
	'comments/fetchCommentsByOrder',
	async (orderId) => {
		try {
			if (!orderId) {
				return;
			}
			const response = await axios.get(
				`${url}/api/comment/order/${orderId}`
			);
			return response.data.comments;
		} catch (error) {
			console.error(error);
		}
	}
);

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(
			fetchCommentsByOrder.pending,
			(state) => {
				state.loadingComment = true;
			}
		);
		builder.addCase(
			fetchCommentsByOrder.fulfilled,
			(state, action) => {
				state.loadingComment = false;
				state.comments = action.payload;
				state.errorExchange = '';
			}
		);
		builder.addCase(
			fetchCommentsByOrder.rejected,
			(state, action) => {
				state.loadingExchange = false;
				state.comments = [];
				state.errorExchange = action.error.message;
			}
		);
	},
});

export const { reducer: commentsReducer } = commentsSlice;
export { fetchCommentsByOrder };
