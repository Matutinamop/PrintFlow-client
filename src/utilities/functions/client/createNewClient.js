import axios from 'axios';

export const createNewClient = async (fields) => {
	const {
		companyName,
		legalName,
		RUT,
		contact,
		address,
		phone,
		extraInfo,
	} = fields;

	const body = {
		companyName,
		legalName,
		RUT,
		contact,
		address,
		phone,
		extraInfo,
	};

	try {
		const response = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/client`,
			body
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
