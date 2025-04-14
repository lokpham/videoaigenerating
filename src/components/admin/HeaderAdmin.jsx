/* eslint-disable react/prop-types */
import { 
  HStack,
  Heading,
  Input,
  InputGroup,
  Button,
  Flex,

 } from "@chakra-ui/react"
import { FaSearch, FaUserCircle } from "react-icons/fa";

export const HeaderAdmin = ({ searchTerm, setSearchTerm}) => {

  return (
    <Flex
      color='white'
      justifyContent='space-between'
    >
      <Heading color="black">
      </Heading>
      <HStack>
        <InputGroup startElement={<FaSearch  />}>
          <Input 
            placeholder="Search contacts" 
            color='black' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button 
          borderRadius='2xl'
          bg='transparent'
        >
          <FaUserCircle />
          Sign In
        </Button>

      </HStack>
    </Flex>
  )
}