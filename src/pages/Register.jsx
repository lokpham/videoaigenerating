/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Button,
  // Checkbox,
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


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'black.700');
  const navigate = useNavigate();
  
  // Validation Functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Comprehensive Validation
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
      const response = await fetch('http://your-nodejs-api/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json(); // Fixed json method call

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toaster.create({
          title: 'Registration Successful',
          description: 'You have been registered successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        toaster.create({
          title: 'Registration Error',
          description: data.message || 'Registration failed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Network Error',
        description: 'Unable to register. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"s
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
        <form onSubmit={handleRegister}>
          <VStack spacing={6} align="stretch">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              mb={2}
            >
              Register
            </Text>
            
            {/* Social login buttons
            <Flex justify="center" gap={4}>
              <Button
                variant="outline"
                borderRadius="md"
                size="lg"
                h="60px"
                w="60px"
                borderColor={borderColor}
              >
                <LuFacebook size={24} />
              </Button>
            </Flex> */}
            
            {/* Divider with "or" text */}
            {/* <Flex align="center" my={4}>
              <Box flex={1} borderColor={borderColor} />
              <Text px={4} color="gray.500">or</Text>
              <Box flex={1} borderColor={borderColor} />
            </Flex> */}
            
            {/* Register form */}
              <Stack spacing={4}>
                <Box >
                  <label fontWeight="medium">Name</label>
                  <Input 
                    type='text'
                    placeholder="Your full name" 
                    size="lg" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    borderColor={borderColor}
                    required
                  />
                </Box>
                
                <Box >
                  <label fontWeight="medium">Email</label>
                  <Input 
                    placeholder="Your email address" 
                    size="lg"
                    type='email'
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
                    placeholder="Comfirm password" 
                    size="lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    borderColor={borderColor}
                    required
                  />
                </Box>
                
                {/* <Checkbox colorScheme="blue" size="md">
                  Remember me
                </Checkbox> */}
                
                <Button
                type='submit'
                  bg="#1a202c"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'gray.700' }}
                  mt={2}
                  isLoading={isLoading}
                  loadingText="Registing"
                >
                  SIGN UP
                </Button>
              </Stack>

            
            <Text textAlign="center" pt={4}>
              Already have an account? <Link color="blue.500" fontWeight="semibold" onClick={() => navigate('/login')}>Sign In</Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;  