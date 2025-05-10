import { Box, VStack, Text } from "@chakra-ui/react";
import { NavLink } from 'react-router';

// eslint-disable-next-line react/prop-types
const ChatSidebar = ({ onItemClick }) => {
  return (
    <Box
      h="100vh"
      w="200px"
      borderRight="1pxs"
      borderColor="gray.200"
      bg="white"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Video App
        </Text>
        <NavLink to="/video/create" onClick={onItemClick}>
          <Text
            p={2}
            borderRadius="md"
            _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
          >
            Create Video
          </Text>
        </NavLink>
        <NavLink to="/video/list" onClick={onItemClick}>
          <Text
            p={2}
            borderRadius="md"
            _hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
          >
            Video List
          </Text>
        </NavLink>
      </VStack>
    </Box>
  );
};

export default ChatSidebar;