import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute, { AdminRoute, CustomerServiceRoute } from './components/auth/ProtectedRoute';
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
import LoginPage from './pages/Auth/LoginPage';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
          {/* Protected Dashboard Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard - All authenticated users */}
            <Route index path="/" element={<Dashboard />} />

            {/* Customer Management - All authenticated users (buttons hidden based on permissions) */}
            <Route path="/customers" element={<Customers />} />

            {/* Bank Management - All authenticated users (buttons hidden based on permissions) */}
            <Route path="/banks" element={<Banks />} />
            <Route path="/banks/add" element={
              <CustomerServiceRoute>
                <AddBank />
              </CustomerServiceRoute>
            } />

            {/* Administration - Admin Only */}
            <Route path="/roles" element={
              <AdminRoute>
                <Roles />
              </AdminRoute>
            } />
            <Route path="/roles/add" element={
              <AdminRoute>
                <AddRole />
              </AdminRoute>
            } />

            <Route path="/permissions" element={
              <AdminRoute>
                <Permissions />
              </AdminRoute>
            } />
            <Route path="/permissions/add" element={
              <AdminRoute>
                <AddPermission />
              </AdminRoute>
            } />

            <Route path="/role-permissions" element={
              <AdminRoute>
                <RolePermissions />
              </AdminRoute>
            } />

            <Route path="/users" element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            } />
            <Route path="/auth/settings" element={
              <AdminRoute>
                <AuthSettings />
              </AdminRoute>
            } />
          </Route>

          {/* Auth Routes (outside of AppLayout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;