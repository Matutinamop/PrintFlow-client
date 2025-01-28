import React, { useEffect } from 'react';
import styles from './sideBar.module.css';
import { Link } from 'wouter';

function SideBar({ hideSideBar }) {
	useEffect(() => {
		console.log(hideSideBar);
	}, [hideSideBar]);

	return (
		<div
			className={`${styles.sideBar} 
				${hideSideBar ? styles.sideBarHide : ''}
			}`}
		>
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
					to="/resources"
				>
					Operaciones y Materiales
				</Link>
			</div>
		</div>
	);
}

export default SideBar;
