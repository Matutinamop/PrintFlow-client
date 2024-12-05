import React, { useEffect, useState } from 'react';
import TaskManager from '../../pages/TaskManager';
import LoadingPage from '../../pages/LoadingPage';
import { Switch } from 'wouter';
import PrivateRoute from '../PrivateRoute';
import { rolToken } from '../../utilities/functions/login';

function WorkerRoutes() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isWorker, setIsWorker] = useState(false);

	const role = rolToken();

	useEffect(() => {
		setIsAdmin(role === 'ADMIN' || role === 'SUPERADMIN');
		setIsWorker(role === 'WORKER');
		setIsLoading(false);
	}, []);

	return (
		<>
			{isLoading ? (
				<LoadingPage />
			) : (
				<Switch>
					<PrivateRoute
						path="/task/manager"
						component={TaskManager}
						condition={isAdmin || isWorker}
						redirectTo="/login"
					/>
				</Switch>
			)}
		</>
	);
}

export default WorkerRoutes;
