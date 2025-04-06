/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Link,
  VStack
} from '@chakra-ui/react';
import { toaster, Toaster } from '@/components/ui/toaster';
import { useColorModeValue } from '@/components/ui/color-mode';

import { useNavigate } from 'react-router';
import { useState } from 'react';
import api from '@/api';
import { useAtom } from "jotai";
import { 
  loginAtom,
  userAtom
 } from "@/atoms/authAtom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'black.700');
  const navigate = useNavigate();
  const [,login] = useAtom(loginAtom); // Lấy hàm login từ authAtom
  const [user] = useAtom(userAtom); // Lấy hàm setUser từ authAtom

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toaster.create({
        title: 'Missing Fields',
        description: 'Please enter your username and password.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      console.log("Response FE: ", response.data);

      // Gọi hàm login từ authATom
      login(response.data.accessToken); // Cập nhật accessToken vào localStorage và userAtom 
      toaster.create({
        title: 'Login Successful',
        description: 'You have been logged in successfully.',
        type: 'success',
        duration: 1000, 
        isClosable: true,
      });
      navigate('/generator');
    } catch (error) {
      console.error("Login error:", error.response?.data); // Thêm log để debug
      toaster.create({
        title: 'Login Error',
        description: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  } 
  return (
    <Flex minH="100vh" align="center" justify="center" bg="blue.500" p={4}>
      <Toaster />
      <Box bg={bgColor} p={8} rounded="md" boxShadow="md" w="full" maxW="md">
        <form onSubmit={handleLogin}>
          <VStack spacing={6} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={2}>
              Login
            </Text>

            <Stack spacing={4}>
              <Box>
                <label fontWeight="medium"> Email</label>
                <Input
                  type="email"
                  placeholder="Your username or email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Box>
                <label fontWeight="medium">Password</label>
                <Input
                  type="password"
                  placeholder="Your password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Button
                type="submit"
                bg="#1a202c"
                color="white"
                size="lg"
                _hover={{ bg: 'gray.700' }}
                mt={2}
                isLoading={isLoading}
                loadingText="Logging in"
              >
                SIGN IN
              </Button>
            </Stack>

            <Text textAlign="center" pt={4}>
              Dont have an account?{' '}
              <Link color="blue.500" fontWeight="semibold" onClick={() => navigate('/register')}>
                Sign Up
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;