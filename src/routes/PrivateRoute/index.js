import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

function PrivateRoute({
	element,
	condition,
	redirectTo,
	...rest
}) {
	return (
		<Routes>
			<Route
				{...rest}
				element={
					condition ? (
						element // Si la condición es verdadera, renderiza el componente
					) : (
						<Navigate to={redirectTo} /> // Si no, redirige
					)
				}
			/>
		</Routes>
	);
}

export default PrivateRoute;
