/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  VStack,
  Text,
  Button,
  Heading,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { LuMessageCirclePlus } from 'react-icons/lu';

const ChatSidebar = () => {
  const bgColor = useColorModeValue('white.100', 'black.700');

  // Mock data for testing layout
  const mockSessions = [
    {
      _id: '1',
      title: 'Discussion about React Components',
      createdAt: new Date('2025-03-15T10:30:00'),
    },
    {
      _id: '2',
      title: 'API Integration Planning',
      createdAt: new Date('2025-03-16T14:45:00'),
    },
    {
      _id: '3',
      title: 'Database Schema Review',
      createdAt: new Date('2025-03-18T09:20:00'),
    },
    {
      _id: '4',
      title: 'UI/UX Improvements',
      createdAt: new Date('2025-03-20T16:15:00'),
    },
    {
      _id: '5',
      title: 'Untitled Chat',
      createdAt: new Date('2025-03-21T11:05:00'),
    }
  ];

  const mockCurrentSession = mockSessions[4];

  const handleCreateNewChat = () => {
    console.log('Creating new chat session...');
  };

  // The sidebar content - reused in both desktop and mobile views
  return (
    <Box 
      h="100%" 
      bg={bgColor} 
      borderRight="1px" 
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      overflow="hidden"
      width="full"
    >
      <Box p={4} overflow="hidden">
        <Heading size="md" mb={4}>Chat Sessions</Heading>
        <Button
          colorScheme="blue"
          variant="solid"
          width="50%"
          mb={4}
          onClick={handleCreateNewChat}
          justifyContent="flex-center"
        >
          <LuMessageCirclePlus  />
          New Chat
        </Button>
        
        <VStack spacing={2} align="stretch">
          {mockSessions.map(session => (
            <Box
              key={session._id}
              p={3}
              borderRadius="md"
              bg={mockCurrentSession._id === session._id ? 'blue.500' : useColorModeValue('gray.100', 'gray.700')}
              color={mockCurrentSession._id === session._id ? 'white' : 'inherit'}
              cursor="pointer"
              onClick={() => console.log(`Selecting chat session: ${session.title}`)}
              _hover={{
                bg: mockCurrentSession._id === session._id ? 'blue.600' : useColorModeValue('gray.200', 'gray.600')
              }}
              title={session.title}
            >
              <Text fontWeight="medium" noOfLines={1}>
                {session.title || 'Untitled Chat'}
              </Text>
              <Text fontSize="xs" opacity={0.8}>
                {session.createdAt.toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default ChatSidebar;