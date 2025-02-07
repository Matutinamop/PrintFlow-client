import React, { useEffect, useState } from 'react';
import TaskManager from '../../pages/TaskManager';
import LoadingPage from '../../pages/LoadingPage';
import { Route, Routes } from 'react-router-dom';
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
				<Routes>
					<Route
						path="/task/manager"
						element={<TaskManager />}
					/>
				</Routes>
			)}
		</>
	);
}

export default WorkerRoutes;
