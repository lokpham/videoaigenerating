import { 
  Box,
  Heading,
  Flex,
  VStack,
} from "@chakra-ui/react"

import { HeaderAdmin } from '@/components/admin/HeaderAdmin';
import { useState } from 'react';
import SidebarAdmin from "@/components/admin/SidebarAdmin";


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
    <Flex h='100vh' bg='white'>
      {/* Thanh nav */}
      <Box
        shadow='xs'
        m='2'
        borderRadius='4xl'
        borderColor="blue.800"
      >
        <SidebarAdmin/>
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