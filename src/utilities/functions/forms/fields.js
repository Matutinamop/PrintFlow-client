export const changeValue = (e, setFields) => {
	setFields((prevFields) => ({
		...prevFields,
		[e.target.name]: e.target.value,
	}));
};
