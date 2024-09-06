import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import MainRoutes from './routes/MainRoutes';

function App() {
	return (
		<div id="content">
			<div id="header">
				<NavBar />
			</div>
			<div id="page">
				<MainRoutes />
			</div>
			<div id="footer">
				<Footer />
			</div>
		</div>
	);
}

export default App;
