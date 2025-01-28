import React, { useState } from 'react';
import { Redirect, Route, Router } from 'wouter';
import AdminRoutes from '../AdminRoutes';
import WorkerRoutes from '../WorkerRoutes';
import PrivateRoute from '../PrivateRoute';
import OrdersList from '../../pages/admin/Orders/OrdersList';
import OrderItem from '../../pages/admin/Orders/OrderItem';
import { Switch } from 'wouter';
import OrderForm from '../../pages/admin/Orders/OrderForm';
import Login from '../../pages/Login';
import styles from './main.module.css';

function MainRoutes({ hideSideBar }) {
	const [role, setRole] = useState('ADMIN');

	return (
		<div
			className={`${styles.mainContent} ${
				hideSideBar ? styles.fullScreen : ''
			}`}
		>
			<AdminRoutes />
			<WorkerRoutes />
			<Route path="/">
				<Redirect to="/task/manager" />
			</Route>
			<Route path="/login">
				<Login />
			</Route>
		</div>
	);
}

export default MainRoutes;
