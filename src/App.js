import { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import MainRoutes from './routes/MainRoutes';
import { rolToken } from './utilities/functions/login';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
	const location = useLocation();
	const navigate = useNavigate();

	const [hideSideBar, setHideSideBar] = useState(true);
	const [flag, setFlag] = useState(false);
	const [role, setRole] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isWorker, setIsWorker] = useState(false);

	useEffect(() => {
		setRole(rolToken());
		setHideSideBar(true);
	}, [location]);

	useEffect(() => {
		if (role) {
			setIsAdmin(role === 'ADMIN' || role === 'SUPERADMIN');
			setIsWorker(role === 'WORKER');
			setFlag(true);
		}
	}, [role]);

	useEffect(() => {
		if (flag) {
			setIsLoading(false);
			if (!isAdmin && !isWorker) {
				navigate('/login');
			}
			if (isWorker) {
				navigate('/task/manager');
			}
		}
	}, [flag]);

	return (
		<div id="content">
			<div id="header">
				<NavBar
					setHideSideBar={setHideSideBar}
					hideSideBar={hideSideBar}
					role={role}
				/>
			</div>
			<div
				className={`'dashBoard' ${
					hideSideBar ? 'hiddenDashBoard' : ''
				}`}
			>
				<SideBar hideSideBar={hideSideBar} />
			</div>
			<div id="page">
				<MainRoutes
					isLoading={isLoading}
					isAdmin={isAdmin}
					isWorker={isWorker}
				/>
			</div>
			{/* <div id="footer">
				<Footer />
			</div> */}
		</div>
	);
}

export default App;
