import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Customers from './pages/Customers/Customers';

import Banks from './pages/Banks/Banks';
import AddBank from './pages/Banks/AddBank';
import Roles from './pages/Roles/Roles';
import AddRole from './pages/Roles/AddRole';
import Permissions from './pages/Permissions/Permissions';
import AddPermission from './pages/Permissions/AddPermission';
import RolePermissions from './pages/RolePermissions/RolePermissions';
import Users from './pages/Users/Users';
import AuthSettings from './pages/Auth/AuthSettings';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Dashboard />} />

            {/* Customer Management */}
            <Route path="/customers" element={<Customers />} />

            {/* Bank Management */}
            <Route path="/banks" element={<Banks />} />
            <Route path="/banks/add" element={<AddBank />} />

            {/* Role Management */}
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/add" element={<AddRole />} />

            {/* Permission Management */}
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/permissions/add" element={<AddPermission />} />

            {/* Role Permission Management */}
            <Route path="/role-permissions" element={<RolePermissions />} />

            {/* User Management */}
            <Route path="/users" element={<Users />} />
            <Route path="/auth/settings" element={<AuthSettings />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;