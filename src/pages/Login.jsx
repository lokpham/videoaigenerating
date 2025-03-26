/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  Link
} from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { toaster, Toaster } from '@/components/ui/toaster';
import { useColorModeValue } from '@/components/ui/color-mode';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'black');
  const navigate = useNavigate();

  const handleRegister = () => { 
    // console.log('Navigating to registration page');
    navigate('/register');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //Giả API
    console.log("Form submission: ", email, password, rememberMe);

    setTimeout(() => {
      setLoading(false);
      console.log("Login success");

      toaster.create({
        title: 'Successfully',
        position: 'top right',
        type: 'success',
      })
      navigate('/generator')
    }, 1000);

  //   try {
  //     const response = await fetch('http://your-nodejs-api/api/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     })

  //     const data = await response.json

  //     if(response.ok) { 
  //       localStorage.setItem('token', data.token)
  //       navigate('/generator')
  //     } else {
  //       // Show error message
  //       toast({
  //         title: 'error',
  //         description:  data.message || 'Login error',
  //         position: 'top-right',
  //         duration: 3000,
  //         isClosable: true,
  //       })
  //     }
  //   } catch(e) {
  //     console.error(e)
  //     toaster.create({
  //       title: 'Error',
  //       description: 'Something went wrong. Please try again.',
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //     })
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const handleForgot = (e) => {
  //   // Perform password reset logic here
  // } 
  } 
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="blue.500"
      p={4}
    >
      <Toaster/>
      <Box
        bg={bgColor}
        p={8}
        rounded="md"
        boxShadow="md"
        w="full"
        maxW="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
            >
              Sign In
            </Text>
            
            {/* Social login button */}
            <Flex justify="center">
              <Button
                variant="outline"
                borderRadius="md"
                size="lg"
                h="60px"
                w="60px"
                onClick={() => console.log('Facebook login clicked')}
                type="button"
              >
                <FaFacebook size={24} />
              </Button>
            </Flex>
            
            <Flex align="center">
              <Box flex={1} h="1px" bg="gray.300" />
              <Text px={4} color="gray.500">or</Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </Flex>
            
            {/* Login form */}
            <Stack spacing={4}>
              <Box>
                <label>Email</label>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Box>
              
              <Box>
                <label>Password</label>
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Box>
              
              <Flex justify="space-between" align="center">
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </Checkbox>
                <Link 
                  color="blue.500"
                  onClick={() => console.log('Forgot password clicked')} //navigate('/forgotPass') }
                >
                  Forgot Password?
                </Link>
              </Flex>
              
              <Button
                type="submit"
                bg="gray.800"
                color="white"
                _hover={{ bg: 'gray.700' }}
                size="lg"
                isLoading={isLoading}
                loadingText="Signing In"
              >
                SIGN IN
              </Button>
            </Stack>
            
            <Text textAlign="center">
              Don't have an account?{' '}
              <Link 
                color="blue.500" 
                fontWeight="semibold"
                onClick={handleRegister}
              >
                Sign Up
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;