import React, { useEffect } from 'react';
import { Link } from 'wouter';

function Login() {
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
