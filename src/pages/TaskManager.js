import React from 'react';
import styles from './pages.module.css';
import Paper from '../components/shared/Paper';

function TaskManager() {
	return (
		<div className={styles.taskManager}>
			<div className={styles.paperList}>
				<Paper title={'Komori'}>
					<Paper title={'tarea'}>Tarea 1</Paper>
				</Paper>
				<Paper title={'Impresion'} />
				<Paper title={'Diseño'} />
			</div>
		</div>
	);
}

export default TaskManager;
