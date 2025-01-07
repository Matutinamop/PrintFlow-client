import axios from 'axios';

export const createNewOperation = async (fields) => {
	const { progressivePrice, ...body } = fields;

	try {
		console.log('body', body);
		const response = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/operation`,
			body
		);
		console.log(response);
		return response;
	} catch (error) {
		console.log(error);
	}
};
