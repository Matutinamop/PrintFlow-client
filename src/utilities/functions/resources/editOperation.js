import axios from 'axios';

export const editOperation = async (fields) => {
	const { progressivePrice, _id, __v, ...body } = fields;

	let newBody = { ...body };

	if (body.workStation._id) {
		newBody.workStation = body.workStation._id;
	}
	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/operation/${_id}`,
			newBody
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
