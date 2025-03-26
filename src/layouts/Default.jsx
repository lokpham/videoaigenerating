import { lazy, Suspense  } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { Box, Spinner, Center } from '@chakra-ui/react'
import { Provider } from "@/components/ui/provider";

import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// import { useAtom } from 'jotai';
// import { userAtom } from '@/atoms/userAtom';

const VideoGeneratePage = lazy(() => import("@/pages/VideoGeneratePage"));
const Default = () => {
  // const [user] = useAtom(userAtom);

  const LoadingFallback = () => (
    <Center h="100vh">
      <Spinner size="xl" color="blue.500" />
    </Center>
  );
  
  return (
    <Provider defaultTheme="light">
      <BrowserRouter>
      <Box minH="100vh">
        <Routes>
        <Route path="/generator" element={
          <Suspense fallback={<LoadingFallback />}>
            <VideoGeneratePage />
          </Suspense>
        } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route 
              path="/generator" 
              element={user ? <VideoGeneratePage /> : <Navigate to="/login" />} 
            /> */}
          <Route 
              path="/admin" element={<Admin />}
              // element={user && user.isAdmin ? <Admin/> : <Navigate to="/login" />} 
            />
          <Route path="/" element={<Navigate to="/generator" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      </BrowserRouter>
    </Provider>
  );
};

export default Default;
