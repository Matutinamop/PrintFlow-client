import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminRoutes from '../AdminRoutes';
import WorkerRoutes from '../WorkerRoutes';
import PrivateRoute from '../PrivateRoute'; // Si este componente es necesario, lo podemos adaptar también
import OrdersList from '../../pages/admin/Orders/OrdersList';
import OrderItem from '../../pages/admin/Orders/OrderItem';
import OrderForm from '../../pages/admin/Orders/OrderForm';
import Login from '../../pages/Login';
import styles from './main.module.css';
import TaskManager from '../../pages/TaskManager';
import { rolToken } from '../../utilities/functions/login';

function MainRoutes({ hideSideBar }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isWorker, setIsWorker] = useState(false);

	const role = rolToken();

	useEffect(() => {
		setIsAdmin(role === 'ADMIN' || role === 'SUPERADMIN');
		setIsWorker(role === 'WORKER');
		setIsLoading(false);
	}, [role]);

	return isLoading ? null : (
		<div
			className={`${styles.mainContent} ${
				hideSideBar ? styles.fullScreen : ''
			}`}
		>
			{' '}
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/"
					element={
						<Navigate
							to={
								isAdmin
									? '/admin/orders/all'
									: isWorker
									? '/task/manager'
									: '/login'
							}
						/>
					}
				/>
				{isAdmin && (
					<Route
						path="/admin/*"
						element={<AdminRoutes />}
					/>
				)}
				{(isWorker || isAdmin) && (
					<Route
						path="/task/manager"
						element={<TaskManager />}
					/>
				)}
				{/* <Route
					path="*"
					element={<Navigate to="/login" />}
				/> */}
			</Routes>
		</div>
	);
}

export default MainRoutes;
