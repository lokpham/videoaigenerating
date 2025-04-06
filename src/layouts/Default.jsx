import { lazy, Suspense, useEffect  } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { Box, Spinner, Center } from '@chakra-ui/react'
import { Provider } from "@/components/ui/provider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { useAtom } from "jotai";
import { 
  accessTokenAtom,
  userAtom,
  loadingAtom,
 } from "@/atoms/authAtom";


const VideoGeneratePage = lazy(() => import("@/pages/VideoGeneratePage"));

const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" />
  </Center>
);

const RootRedirect = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  return <Navigate to={accessToken ? "/generator" : "/login"} replace />;
};


const AppRoutes = () => {
  const [loading] = useAtom(loadingAtom);
  if(loading) return <LoadingFallback />;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/generator" element={
          <ProtectedRoute>
            <VideoGeneratePage />
          </ProtectedRoute>
        }/>
      </Routes>
    </Suspense>
  )
}

const Default = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [,setUser] = useAtom(userAtom);
  const [, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    if (accessToken) {
      setUser({token : accessToken}); // Reset user state when accessToken changes
    }
    setLoading(false); 
  }, [accessToken]);
  return (

    <Provider defaultTheme="light">
      <BrowserRouter>
      <Box minH="100vh">
        <AppRoutes />
        {/* <Toaster position="top-right" /> */}
      </Box>
      </BrowserRouter>
    </Provider>
  );
};

export default Default;
