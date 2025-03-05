import axios from 'axios';

export const createNewMaterial = async (fields) => {
	const { ...body } = fields;

	const newSizes = body.sizes.map(
		(size) => size.value ?? size
	);
	const newGrammage = body.grammage.map(
		(gram) => gram.value ?? gram
	);

	const newBody = {
		...body,
		sizes: newSizes,
		grammage: newGrammage,
	};

	try {
		const response = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/material`,
			newBody
		);
		return response;
	} catch (error) {
		console.log(error);
	}
};
