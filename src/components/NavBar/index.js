import React, { useEffect, useRef, useState } from 'react';
import styles from './nav.module.css';
import { Link } from 'wouter';
import Button from '../shared/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../../utilities/functions/login';

function NavBar() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const buttonRef = useRef(null);

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

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(e.target)
			) {
				setMenuOpen(false);
			}
		};

		document.addEventListener(
			'mousedown',
			handleClickOutside
		);

		return () => {
			document.removeEventListener(
				'mousedown',
				handleClickOutside
			);
		};
	}, []);

	return (
		<div className={styles.navBar}>
			{windowSize.width < 1000 ? (
				<div>
					<MenuIcon
						ref={buttonRef}
						className={`${styles.burgerMenu} ${
							menuOpen ? styles.open : ''
						}`}
						onClick={() => setMenuOpen(!menuOpen)}
					/>
					{menuOpen ? (
						<div
							ref={menuRef}
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
								to="/resources"
							>
								Estaciones y Materiales
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
							to="/resources"
						>
							Estaciones y Materiales
						</Link>
					</div>
				</div>
			)}

			<Button onClick={() => logout()}>
				Cerrar sesión
			</Button>
		</div>
	);
}

export default NavBar;
