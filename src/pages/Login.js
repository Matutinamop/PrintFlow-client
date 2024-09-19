import React, { useEffect } from 'react';
import { Link } from 'wouter';

function Login() {
	useEffect(() => {
		console.log(process.env.REACT_APP_API_URL);
	}, []);

	return (
		<div>
			Login
			<button>
				<Link to="/task/manager">task manager</Link>
			</button>
		</div>
	);
}

export default Login;
