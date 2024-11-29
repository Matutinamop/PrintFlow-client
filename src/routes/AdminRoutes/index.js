import React, { useEffect, useState } from 'react';
import { Switch } from 'wouter';
import PrivateRoute from '../PrivateRoute';
import OrdersList from '../../pages/admin/Orders/OrdersList';
import OrderForm from '../../pages/admin/Orders/OrderForm';
import OrderItem from '../../pages/admin/Orders/OrderItem';
import Login from '../../pages/Login';
import LoadingPage from '../../pages/LoadingPage';
import ClientsList from '../../pages/admin/Clients/ClientsList';
import ClientProfile from '../../pages/admin/Clients/ClientProfile';
import ClientForm from '../../pages/admin/Clients/ClientForm';
import ResourcesList from '../../pages/admin/Resources/ResourcesList';

function AdminRoutes() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		setIsAdmin(true);
		setIsLoading(false);
	}, []);

	return (
		<>
			{isLoading ? (
				<LoadingPage />
			) : (
				<Switch>
					<PrivateRoute
						path="/orders/all"
						component={OrdersList}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/orders/form"
						component={OrderForm}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/orders/:id"
						component={OrderItem}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/clients"
						component={ClientsList}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/clients/:id"
						component={ClientProfile}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/clients/form"
						component={ClientForm}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/resources"
						component={ResourcesList}
						condition={isAdmin}
						redirectTo="/login"
					/>
					<PrivateRoute
						path="/"
						component={Login}
						condition={!isAdmin}
						redirectTo="/orders/all"
					/>
				</Switch>
			)}
		</>
	);
}

export default AdminRoutes;
