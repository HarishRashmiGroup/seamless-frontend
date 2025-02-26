import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Spinner, Text, useToast } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import AppProviders from './providers/appProvider';
import { AuthProvider, useAuth } from './providers/authProvider';
import ShiftReport from './components/ShiftReport.js';
import LoginPage from './components/login.js';
import axios from 'axios';

const Dashboard = lazy(() => import('./components/Dashbord.js'));
const ProductionForm = lazy(() => import('./components/ProductionForm.js'));
const HourlyProductionForm = lazy(() => import('./components/HourlyProductionForm.js'));
const MaintenancePage = lazy(() => import('./components/MaintenancePage.js'));

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, setUser } = useAuth();
  if (!user) return;
  if (!allowedRoles.includes(user.role)) {
    return <Box width={'full'} mt={100} display={'flex'} justifyContent={'center'}><Text color={'red'}>Access Denied</Text></Box>;
  }
  return children;
};

function App() {
  const toast = useToast();
  const [isServerHealthy, setIsServerHealthy] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  useEffect(() => {
    const fetchServerHealth = async () => {
      try {
        const response = await axios.get("https://seamless-backend-nz7d.onrender.com", {
          timeout: Math.min(2000 * retryCount, 8000)
        });
        if (response.status === 200) {
          setIsServerHealthy(true);
        }
      } catch (e) {
        console.error("Server health check failed:", e);
        console.log(e.code)
        if (e.code == 'ERR_NETWORK' && retryCount == 2) {
          console.log(e.code)
          toast({
            title: "Network Error",
            description: "Please check your internet connection and try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
        if (retryCount < 10) {
          setTimeout(() => setRetryCount((prev) => prev + 1), 500 * (retryCount + 1));
          if (retryCount == 2 || retryCount == 6 || retryCount == 10)
            toast({
              title: "Server Health Check Unsuccessful.",
              description: "If it doesn’t open in a few seconds, try refreshing the page.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
        }
      }
    };

    fetchServerHealth();
  }, [retryCount]);


  if (!isServerHealthy) return (
    <AppProviders>
      <Box width="full" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Box>
    </AppProviders>
  );
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
                <Route path="/" element={
                  <ProtectedRoute allowedRoles={['admin', 'head']}><Dashboard /></ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/hourly" element={<HourlyProductionForm />} />
                <Route
                  path="/production"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'head']}>
                      <ProductionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shift-report"
                  element={
                    <ProtectedRoute allowedRoles={['head', 'admin']}>
                      <ShiftReport />
                    </ProtectedRoute>
                  }
                />
                <Route path="/maintenance"
                  element={
                    <ProtectedRoute allowedRoles={['maintenance', 'admin', 'head']}>
                      <MaintenancePage />
                    </ProtectedRoute>
                  } />
              </Routes>
            </Box>
          </Suspense>
        </AppProviders>
      </AuthProvider>
    </Router>
  );
}

export default App;
