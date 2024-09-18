import React, { useEffect } from 'react';
import { Link } from 'wouter';

function Login() {
	useEffect(() => {
		console.log(process.env.REACT_APP_API_URL);
	}, []);

	return (
		<div>
			Login
			<Link to="/task/manager">task manager</Link>
		</div>
	);
}

export default Login;
