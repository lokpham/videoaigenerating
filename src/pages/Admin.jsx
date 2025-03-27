import { useState } from 'react';
import { 
  Box,
  Heading,
  Flex,
  VStack,
  Text ,
  Icon,
  Image,
} from "@chakra-ui/react"
import { 
  FaHome, 
  FaTable, 
  FaUserFriends, 
  FaSignInAlt,
  FaSignOutAlt 
} from 'react-icons/fa';
import { HeaderAdmin } from '@/components/HeaderAdmin';

const initialUsers = [
  { 
    id: 1, 
    username: 'admin1', 
    email: 'admin1@example.com', 
    role: 'Admin',
    chatHistory: [
      { date: '2024-03-25', duration: '30 phút', videoLink: '/videos/session1.mp4' },
      { date: '2024-03-26', duration: '45 phút', videoLink: '/videos/session2.mp4' }
    ]
  },
  { 
    id: 2, 
    username: 'user1', 
    email: 'user1@example.com', 
    role: 'User',
    chatHistory: [
      { date: '2024-03-24', duration: '15 phút', videoLink: '/videos/session3.mp4' }
    ]
  }
];

const AdminDashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    const userToAdd = {
      ...newUser,
      id: users.length + 1,
      chatHistory: []
    };

    setUsers(prev => [...prev, userToAdd]);
    
    // Reset form
    setNewUser({
      username: '',
      email: '',
      role: ''
    });
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <Flex h='100vh' bg='#1b1b38'>
      {/* Thanh nav */}
      <Box
        w="250px" 
        bg="#070b26" 
        color="white" 
        p={5}
        m={4}
        borderRadius='4xl'
      >
        <Heading size="md" mb={10} textAlign='center'>
            <Image 
              src="logo.png" 
              alt="Logo"
              w='50px'
              h='50px'
              m='auto'
            />
          </Heading>
        <VStack>
        {[
            { icon: FaHome, text: 'Tài khoản người dùng' },
            { icon: FaTable, text: 'Nhật ký sử dụng' },
            { icon: FaUserFriends, text: 'Thông tin ' },
            { icon: FaSignInAlt, text: 'Đăng nhập' },
            { icon: FaSignOutAlt, text: 'Đăng xuất' }
          ].map((item, index) => (
            <Flex
              w='full' 
              key={index} 
              alignItems="center" 
              p={2} 
              borderRadius="md"
              _hover={{ bg: 'gray.700' }}
              bg={item.text === 'Tables' ? 'purple.500' : 'transparent'}
            >
              <Icon as={item.icon} mr={3} />
              <Text>{item.text}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>
      {/* Thông tin cụ thể */}
      <Box flex='1' p={6}>
        <VStack>
          <Heading size="lg" mb={4} w='full'>
            <HeaderAdmin/>
          </Heading>
          {/* Thông tin các tabs */}
          <Box flex='1'>

          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;