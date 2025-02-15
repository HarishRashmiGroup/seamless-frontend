import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Spinner, Text } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import AppProviders from './providers/appProvider';
import { AuthProvider, useAuth } from './providers/authProvider';
import ShiftReport from './components/ShiftReport.js';

const Dashboard = lazy(() => import('./components/Dashbord.js'));
const ProductionForm = lazy(() => import('./components/ProductionForm.js'));
const HourlyProductionForm = lazy(() => import('./components/HourlyProductionForm.js'));
const MaintenancePage = lazy(() => import('./components/MaintenancePage.js'));

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Box width={'full'}><Text color={'red'}>Access Denied</Text></Box>;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProviders>
          <Suspense fallback={<Box width="full" height="100vh" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Box>}>
            <Navbar />
            <Box pt="80px">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/hourly" element={<HourlyProductionForm />} />
                <Route
                  path="/production"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'manager']}>
                      <ProductionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shift-report"
                  element={
                    // <ProtectedRoute allowedRoles={['operator', 'admin', 'manager']}>
                      <ShiftReport />
                    // </ProtectedRoute>
                  }
                />
                <Route path="/maintenance" element={<MaintenancePage />} />
              </Routes>
            </Box>
          </Suspense>
        </AppProviders>
      </AuthProvider>
    </Router>
  );
}

export default App;
