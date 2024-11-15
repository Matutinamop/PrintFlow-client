import React, { useEffect, useState } from 'react';
import styles from './nav.module.css';
import { Link } from 'wouter';
import Button from '../shared/Button';
import MenuIcon from '@mui/icons-material/Menu';

function NavBar() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [window.innerWidth]);

	return (
		<div className={styles.navBar}>
			{windowSize.width < 1000 ? (
				<div>
					<MenuIcon
						className={`${styles.burgerMenu} ${
							menuOpen ? styles.open : ''
						}`}
						onClick={() => setMenuOpen(!menuOpen)}
					/>
					{menuOpen ? (
						<div
							className={`${styles.verticalNav} ${styles.navLinks}`}
						>
							<Link
								className={(active) =>
									active ? styles.active : ''
								}
								to="/task/manager"
							>
								Tareas
							</Link>
							<Link
								className={(active) =>
									active ? styles.active : ''
								}
								to="/orders/all"
							>
								MOPS
							</Link>
							<Link
								className={(active) =>
									active ? styles.active : ''
								}
								to="/clients"
							>
								Clientes
							</Link>
							<Link
								className={(active) =>
									active ? styles.active : ''
								}
							>
								Usuarios
							</Link>
							<Link
								className={(active) =>
									active ? styles.active : ''
								}
							>
								Estaciones
							</Link>
						</div>
					) : (
						''
					)}
				</div>
			) : (
				<div className={styles.nav}>
					<div className={styles.logo}>
						<h1>Matutina</h1>
					</div>
					<div className={styles.navLinks}>
						<Link
							className={(active) =>
								active ? styles.active : ''
							}
							to="/task/manager"
						>
							Tareas
						</Link>
						<Link
							className={(active) =>
								active ? styles.active : ''
							}
							to="/orders/all"
						>
							Mops
						</Link>
						<Link
							className={(active) =>
								active ? styles.active : ''
							}
							to="/clients"
						>
							Clientes
						</Link>
						<Link
							className={(active) =>
								active ? styles.active : ''
							}
						>
							Usuarios
						</Link>
						<Link
							className={(active) =>
								active ? styles.active : ''
							}
						>
							Estaciones
						</Link>
					</div>
				</div>
			)}

			<Button>Cerrar sesión</Button>
		</div>
	);
}

export default NavBar;
