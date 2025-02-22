import React, { useEffect } from 'react';
import styles from './sideBar.module.css';
import { Link, useLocation } from 'react-router-dom';

function SideBar({ hideSideBar }) {
	const location = useLocation();

	return (
		<div
			className={`${styles.sideBar} 
        ${hideSideBar ? styles.sideBarHide : ''}`}
		>
			<div
				className={`${styles.verticalNav} ${styles.navLinks}`}
			>
				<Link
					className={
						location.pathname === '/task/manager'
							? styles.active
							: ''
					}
					to="/task/manager"
				>
					Estaciones
				</Link>
				<Link
					className={
						location.pathname === '/orders/all'
							? styles.active
							: ''
					}
					to="/admin/orders/all"
				>
					MOPS
				</Link>
				<Link
					className={
						location.pathname === '/clients'
							? styles.active
							: ''
					}
					to="/admin/clients"
				>
					Clientes
				</Link>
				<Link
					className={
						location.pathname === '/users'
							? styles.active
							: ''
					}
					to="/admin/users"
				>
					Usuarios
				</Link>
				<Link
					className={
						location.pathname === '/resources'
							? styles.active
							: ''
					}
					to="/admin/resources"
				>
					Tareas y Materiales
				</Link>
			</div>
		</div>
	);
}

export default SideBar;
