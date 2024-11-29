import React, { useEffect, useRef, useState } from 'react';
import styles from './pages.module.css';
import { Button, Input } from '@mui/material';
import { login } from '../utilities/functions/login';
import { navigate } from 'wouter/use-browser-location';

function Login() {
	const [fields, setFields] = useState({});
	const [error, setError] = useState(false);
	const [message, setMessage] = useState('');
	const usernames =
		JSON.parse(localStorage.getItem('loggedUsernames')) ||
		[];

	const changeValue = (e) => {
		setFields((prevFields) => ({
			...prevFields,
			[e.target.name]: e.target.value,
		}));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!fields.username || !fields.pw) {
			setError(true);
			setMessage(
				'Por favor, ingrese nombre de usuario y contraseña.'
			);
			return;
		}

		const res = await login(fields.username, fields.pw);

		if (res.error) {
			setMessage(res.error);
			return setError(true);
		}
		if (res.token) {
			setError(false);
			setMessage(res.message);
			navigate('/task/manager');
		}
	};

	return (
		<div className={styles.loginPage}>
			<div className={styles.loginChart}>
				<h2>Iniciar Sesión</h2>
				<form
					autoFocus
					className={styles.loginForm}
					onSubmit={(e) => handleLogin(e)}
				>
					<label>Nombre de usuario</label>
					<Input
						name="username"
						placeholder="Nombre de usuario"
						autoComplete="off"
						inputProps={{ list: 'usernames' }}
						onChange={(e) => changeValue(e)}
					/>
					<datalist id="usernames">
						{usernames.map((username, index) => (
							<option key={index} value={username} />
						))}
					</datalist>
					<label>Contraseña</label>
					<Input
						name="pw"
						type="password"
						onChange={(e) => changeValue(e)}
					/>
					{error && (
						<p
							style={{ color: 'red', textAlign: 'center' }}
						>
							{message}
						</p>
					)}
					<Button variant="contained" type="submit">
						Aceptar
					</Button>
				</form>
			</div>
		</div>
	);
}

export default Login;
