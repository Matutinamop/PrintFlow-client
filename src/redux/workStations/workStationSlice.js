import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingStation: true,
	stations: [],
	station: {},
	errorStation: '',
};

const fetchStations = createAsyncThunk(
	'workStation/fetchStations',
	async () => {
		try {
			const response = await axios.get(
				`${url}/api/workStation/lite`
			);
			return response.data.stations;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchStationById = createAsyncThunk(
	'workStation/fetchById',
	async (id) => {
		try {
			const response = await axios.get(
				`${url}/api/workStation/lite:${id}`
			);
			return response.data.station;
		} catch (error) {
			console.error(error);
		}
	}
);

const workStationSlice = createSlice({
	name: 'workStation',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchStations.pending, (state) => {
			state.loadingStation = true;
		});
		builder.addCase(
			fetchStations.fulfilled,
			(state, action) => {
				state.loadingStation = false;
				state.stations = action.payload;
				state.errorStation = '';
			}
		);
		builder.addCase(
			fetchStations.rejected,
			(state, action) => {
				state.loadingStation = false;
				state.stations = [];
				state.errorStation = action.error.message;
			}
		);
		builder.addCase(fetchStationById.pending, (state) => {
			state.station = {};
		});
		builder.addCase(
			fetchStationById.fulfilled,
			(state, action) => {
				state.station = action.payload;
			}
		);
		builder.addCase(fetchStationById.rejected, (state) => {
			state.station = {};
		});
	},
});

export const { reducer: workStationReducer } =
	workStationSlice;
export { fetchStations, fetchStationById };
