import { useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import MainRoutes from './routes/MainRoutes';

function App() {
	const [hideSideBar, setHideSideBar] = useState(true);

	return (
		<div id="content">
			<div id="header">
				<NavBar
					setHideSideBar={setHideSideBar}
					hideSideBar={hideSideBar}
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
				<MainRoutes hideSideBar={hideSideBar} />
			</div>
			<div id="footer">
				<Footer />
			</div>
		</div>
	);
}

export default App;
