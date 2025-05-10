/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  VStack,
  Link,
  // useColorModeValue
} from '@chakra-ui/react';
// import { LuFacebook } from 'react-icons/lu';
import { useNavigate } from 'react-router';
import { useColorModeValue } from '@/components/ui/color-mode';
import { toaster, Toaster } from '@/components/ui/toaster';
import api from '@/api';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'black.700');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username) {
      toaster.create({
        title: 'Missing Fields',
        description: 'Please enter your username',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateEmail(email)) {
      toaster.create({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validatePassword(password)) {
      toaster.create({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toaster.create({
        title: 'Password Mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username, // Đổi từ name thành username
        email,
        password,
        fullName: username, // Sử dụng username làm fullName
      });

      toaster.create({
        title: 'Registration Successful',
        description: 'You have been registered successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      toaster.create({
        title: 'Registration Error',
        description: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="blue.500" p={4}>
      <Toaster />
      <Box bg={bgColor} p={8} rounded="md" boxShadow="md" w="full" maxW="md">
        <form onSubmit={handleRegister}>
          <VStack spacing={6} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={2}>
              Register
            </Text>

            <Stack spacing={4}>
              <Box>
                <label fontWeight="medium">Username</label>
                <Input
                  type="text"
                  placeholder="Your username"
                  size="lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  borderColor={borderColor}
                  required
                />
              </Box>

              <Box>
                <label fontWeight="medium">Email</label>
                <Input
                  placeholder="Your email address"
                  size="lg"
                  type="email"
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

              <Box>
                <label fontWeight="medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  size="lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                loadingText="Registering"
              >
                SIGN UP
              </Button>
            </Stack>

            <Text textAlign="center" pt={4}>
              Already have an account?{' '}
              <Link color="blue.500" fontWeight="semibold" onClick={() => navigate('/login')}>
                Sign In
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;  