import axios from 'axios';

export const createNewOperation = async (fields) => {
	const { progressivePrice, ...body } = fields;

	try {
		const response = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/operation`,
			body
		);
		return response;
	} catch (error) {
		console.log(error);
	}
};
