import { 
  HStack,
  Heading,
  Input,
  InputGroup,
  Button,
  Flex,

 } from "@chakra-ui/react"
import { FaSearch, FaUserCircle, FaCog } from "react-icons/fa";

export const HeaderAdmin = () => {

  return (
    <Flex
      color='white'
      justifyContent='space-between'
    >
      <Heading>
        Name Pages  
      </Heading>
      <HStack>
        <InputGroup startElement={<FaSearch  />}>
          <Input placeholder="Search contacts" />
        </InputGroup>

        <Button 
          borderRadius='2xl'
          bg='transparent'
        >
          <FaUserCircle />
          Sign In
        </Button>

        <Button
          borderRadius='2xl'
          bg='transparent'
        >
          <FaCog />
        </Button>
      </HStack>
    </Flex>
  )
}