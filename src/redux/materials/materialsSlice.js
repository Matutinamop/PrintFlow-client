import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

const initialState = {
	loadingMaterial: true,
	materials: [],
	material: {},
	errorMaterial: '',
	materialsCount: 0,
};

const fetchMaterials = createAsyncThunk(
	'material/fetchMaterials',
	async () => {
		try {
			const response = await axios.get(
				`${url}/api/material`
			);
			return response.data.materials;
		} catch (error) {
			console.error(error);
		}
	}
);

const fetchFilteredMaterials = createAsyncThunk(
	'materials/fetchFilteredMaterials',
	async ({ searchTerm = '', page, limit } = {}) => {
		try {
			const response = await axios.get(
				`${url}/api/material/filtered`,
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

const fetchMaterialById = createAsyncThunk(
	'material/fetchById',
	async (id) => {
		try {
			const response = await axios.get(
				`${url}/api/material/${id}`
			);
			return response.data.material;
		} catch (error) {
			console.error(error);
		}
	}
);

const materialSlice = createSlice({
	name: 'material',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(fetchMaterials.pending, (state) => {
			state.loadingMaterial = true;
		});
		builder.addCase(
			fetchMaterials.fulfilled,
			(state, action) => {
				state.loadingMaterial = false;
				state.materials = action.payload;
				state.errorMaterial = '';
			}
		);
		builder.addCase(
			fetchMaterials.rejected,
			(state, action) => {
				state.loadingMaterial = false;
				state.materials = [];
				state.errorMaterial = action.error.message;
			}
		);
		builder.addCase(
			fetchFilteredMaterials.pending,
			(state) => {
				state.loadingMaterial = true;
			}
		);
		builder.addCase(
			fetchFilteredMaterials.fulfilled,
			(state, action) => {
				state.loadingMaterial = false;
				state.materials = action.payload.materials;
				state.errorMaterial = '';
				state.materialsCount = action.payload.count;
			}
		);
		builder.addCase(
			fetchFilteredMaterials.rejected,
			(state, action) => {
				state.loadingMaterial = false;
				state.materials = [];
				state.errorMaterial = action.error.message;
				state.materialsCount = 0;
			}
		);
		builder.addCase(fetchMaterialById.pending, (state) => {
			state.material = {};
		});
		builder.addCase(
			fetchMaterialById.fulfilled,
			(state, action) => {
				state.material = action.payload;
			}
		);
		builder.addCase(fetchMaterialById.rejected, (state) => {
			state.material = {};
		});
	},
});

export const { reducer: materialReducer } = materialSlice;
export {
	fetchMaterials,
	fetchMaterialById,
	fetchFilteredMaterials,
};
