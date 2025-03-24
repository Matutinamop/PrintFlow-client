import axios from 'axios';

export const editMaterial = async (fields) => {
	const { _id, __v, ...body } = fields;

	const newSizes = body.sizes.map((size) => size.value);
	const newGrammage = body.grammage.map(
		(gram) => gram.value
	);

	const newBody = {
		...body,
		sizes: newSizes,
		grammage: newGrammage,
	};

	try {
		const response = await axios.put(
			`${process.env.REACT_APP_API_URL}/api/material/${_id}`,
			newBody
		);
		return response;
	} catch (error) {
		console.error(error);
	}
};
