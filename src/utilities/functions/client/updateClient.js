import axios from 'axios';

export const updateClient = async (fields) => {
	const {
		companyName,
		legalName,
		RUT,
		contact,
		address,
		phone,
		extraInfo,
		_id,
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
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/client/${_id}`,
			body
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
