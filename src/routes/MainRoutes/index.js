import React, { useEffect, useState } from 'react';
import {
	Route,
	Routes,
	Navigate,
	useNavigate,
	useLocation,
} from 'react-router-dom';
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

function MainRoutes({ isLoading, isAdmin, isWorker }) {
	return isLoading ? null : (
		<div
			className={`${styles.mainContent} ${styles.fullScreen}`}
		>
			<Routes>
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
				<Route
					path="/login"
					element={
						isAdmin || isWorker ? (
							<Navigate to="/task/manager" />
						) : (
							<Login />
						)
					}
				/>
				<Route
					path="*"
					element={
						isAdmin ? (
							<Navigate to="/admin/orders/all" />
						) : isWorker ? (
							<Navigate to="/task/manager" />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
			</Routes>
		</div>
	);
}

export default MainRoutes;
