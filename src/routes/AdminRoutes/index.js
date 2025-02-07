import { Routes, Route } from 'react-router-dom';
import OrdersList from '../../pages/admin/Orders/OrdersList';
import OrderForm from '../../pages/admin/Orders/OrderForm';
import OrderItem from '../../pages/admin/Orders/OrderItem';
import ClientsList from '../../pages/admin/Clients/ClientsList';
import ClientProfile from '../../pages/admin/Clients/ClientProfile';
import ClientForm from '../../pages/admin/Clients/ClientForm';
import ResourcesList from '../../pages/admin/Resources/ResourcesList';

function AdminRoutes() {
	return (
		<Routes>
			<Route path="/orders/all" element={<OrdersList />} />
			<Route path="/orders/form" element={<OrderForm />} />
			<Route path="/orders/:id" element={<OrderItem />} />
			<Route path="/clients" element={<ClientsList />} />
			<Route
				path="/clients/:id"
				element={<ClientProfile />}
			/>
			<Route
				path="/clients/form"
				element={<ClientForm />}
			/>
			<Route
				path="/resources"
				element={<ResourcesList />}
			/>
		</Routes>
	);
}

export default AdminRoutes;
