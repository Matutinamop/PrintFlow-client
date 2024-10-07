import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingTask: true,
	tasks: [],
	task: {},
	errorTask: '',
};

const fetchTasks = createAsyncThunk(
	'task/fetchTasks',
	async () => {
		try {
			const response = await axios.get(`${url}/api/task`);
			return response.data.tasks;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchTaskById = createAsyncThunk(
	'task/fetchById',
	async (id) => {
		try {
			const response = await axios.get(
				`${url}/api/task/${id}`
			);
			return response.data.task;
		} catch (error) {
			console.error(error);
		}
	}
);

const taskSlice = createSlice({
	name: 'task',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchTasks.pending, (state) => {
			state.loadingTask = true;
		});
		builder.addCase(
			fetchTasks.fulfilled,
			(state, action) => {
				state.loadingTask = false;
				state.tasks = action.payload;
				state.errorTask = '';
			}
		);
		builder.addCase(
			fetchTasks.rejected,
			(state, action) => {
				state.loadingTask = false;
				state.tasks = [];
				state.errorTask = action.error.message;
			}
		);
		builder.addCase(fetchTaskById.pending, (state) => {
			state.task = {};
		});
		builder.addCase(
			fetchTaskById.fulfilled,
			(state, action) => {
				state.task = action.payload;
			}
		);
		builder.addCase(fetchTaskById.rejected, (state) => {
			state.task = {};
		});
	},
});

export const { reducer: taskReducer } = taskSlice;
export { fetchTasks, fetchTaskById };
