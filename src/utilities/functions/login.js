import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export async function login(username, pw) {
	const url = process.env.REACT_APP_API_URL;
	const loggedUsernames =
		JSON.parse(localStorage.getItem('loggedUsernames')) ||
		[];

	try {
		const res = await axios.post(`${url}/api/user/login`, {
			username,
			pw,
		});
		if (res.data.token) {
			localStorage.setItem('sessionToken', res.data.token);
		} else {
			return { error: 'No se recibió un token válido.' };
		}
		if (!loggedUsernames.includes(username)) {
			loggedUsernames.push(username);
			localStorage.setItem(
				'loggedUsernames',
				JSON.stringify(loggedUsernames)
			);
		}
		return res.data;
	} catch (error) {
		const errorMessage =
			error.response?.data?.error || 'Error de conexión';
		return {
			error: errorMessage,
		};
	}
}

export function rolToken() {
	const token = localStorage.getItem('sessionToken');
	if (token) {
		const userInfo = jwtDecode(token);
		return userInfo.role;
	}
	return 'sin rol';
}
