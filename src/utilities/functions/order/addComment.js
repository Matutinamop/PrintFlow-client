import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export const addComment = async (orderId, comment) => {
	const date = new Date();
	const body = {
		order: orderId,
		content: comment,
		date,
	};

	try {
		const res = await axios.post(
			`${url}/api/comment`,
			body
		);
		const newCommentId = res.data.newComment._id;

		const resOrder = await axios.get(
			`${url}/api/order/${orderId}`
		);
		const oldComments = resOrder.data.order.comments;
		const newComments = [...oldComments, newCommentId];

		const resUpdatedOrder = await axios.put(
			`${url}/api/order/${orderId}`,
			{ comments: newComments }
		);
	} catch (error) {
		console.error(error);
	}
};
