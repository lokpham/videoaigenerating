import {
  Menu,
  VStack,
  Text,
  Avatar,
  Portal
} from '@chakra-ui/react';
import { 
  LuSettings , 
  LuLogOut , 
  LuUser , 
  LuDock  
} from 'react-icons/lu';
// import { useNavigate } from 'react-router';

export const Infomation = () => {
  // const navigate = useNavigate()

  return (
    <Menu.Root>
      <Menu.Trigger
        _hover={{ transform: 'scale(1.05)' }}
        transition="all 0.2s"
      >
        <Avatar.Root
          size="md" 
          cursor="pointer"
          shape="rounded"
        >
          <Avatar.Fallback name="User name" />
          <Avatar.Image src="https://bit.ly/sage-adebayo" />
        </Avatar.Root>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner 
          boxShadow="xl" 
          borderRadius="md"
          minWidth="250px"
        >
          <Menu.Content>
            <VStack 
              spacing={2} 
              px={4} 
              mb={2} 
              align="start"
            >
              <Text fontWeight="bold">John Doe</Text>
              <Text fontSize="sm" color="gray.500">john.doe@example.com</Text>
            </VStack>
            
            
            <Menu.ItemGroup title="Profile">
              <Menu.Item 
                _hover={{ 
                  bg: 'blue.50', 
                  color: 'blue.500' 
                }}
              >
                <LuUser size={16} />
                My Profile
              </Menu.Item>
              <Menu.Item 
                _hover={{ 
                  bg: 'blue.50', 
                  color: 'blue.500' 
                }}
              >
                <LuDock  size={16} />
                Billing
              </Menu.Item>
            </Menu.ItemGroup>
                    
            <Menu.ItemGroup title="Account">
              <Menu.Item 
                _hover={{ 
                  bg: 'blue.50', 
                  color: 'blue.500' 
                }}
              >
                <LuSettings size={16} />
                Settings
              </Menu.Item>
              <Menu.Item 
                icon={<LuLogOut size={16} />}
                color="red.500"
                _hover={{ 
                  bg: 'red.600',  
                  color: 'black' 
                }}
              >
                Logout
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>

  );
};
