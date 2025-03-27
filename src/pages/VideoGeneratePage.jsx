import { useState } from "react";
import { Box, 
  VStack, 
  Textarea, 
  HStack, 
  AbsoluteCenter, 
  Button, 
  createListCollection, 
  IconButton,
  useDisclosure,
  useBreakpointValue,
  Flex
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode"
import { Field } from "@/components/ui/field";
import { DrawerRoot, DrawerBody, DrawerContent } from '@/components/ui/drawer';
import { LuSend, LuMenu } from "react-icons/lu";

import ChatSidebar from "@/components/ChatSidebar";
import MessageWelcome from "@/components/MessageWelcome";
import { Infomation } from "@/components/Infomation";


const ratios = createListCollection({
  items: [
    { label: "16:9", value: "169",},
    { label: "9:16", value: "916",},
    { label: "1:1", value: "11",},
  ],
});

const durations = createListCollection({
  items: [ 
    { label: "15s", value: 15 }, 
    { label: "30s", value: 30 }, 
    { label: "45s", value: 45 }, 
    { label: "60s", value: 60 } 
  ],
});

const VideoGeneratePage = () => {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Đóng mở sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Determine if mobile view is active
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt || !ratio || !duration) {
      alert("Please fill in all fields");
      return;
    }
    
    // Compare data send back to server
    const formData = {
      prompt,
      ratio,
      duration,
    };

    setIsSubmitting(true);

    try {
      console.log("Sending data to backend:", formData);
      // Thêm API vào tại đây
    }
    catch (error) {
      console.error("Error submitting form:", error);
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box display="flex" position="relative" minH="100vh">
      {/* Color mode toggle button - always visible */}
      <Flex 
        position="absolute" 
        top="4" 
        right="4" 
        zIndex="100" 
        align="center" 
        gap="2"
      >
        <ColorModeButton />
        <Infomation />
      </Flex>

      {/* Mobile menu toggle button */}
      {isMobile && (
        <Box 
          position="absolute"
          top="4"
          left="4"
          zIndex="100"
        >
          <IconButton
            aria-label="Open Menu"
            onClick={onOpen}
            variant="ghost"
            size="md"
          >
            <LuMenu />
          </IconButton>
        </Box>
      )}
      
      {/* Mobile Drawer with overlay */}
      {isMobile && (
        <DrawerRoot 
          placement="left" 
          onClose={onClose} 
          isOpen={isOpen}
        >
          {/* <DrawerOverlay /> */}
          <DrawerContent maxWidth="30%">
            <DrawerBody p={0}>
              <ChatSidebar onItemClick={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      )}
      
      {/* Desktop Sidebar - fixed position */}
      {!isMobile && (
        <Box 
          position="fixed"
          left="0"
          top="0"
          h="100vh" 
          w="280px"
          borderRight="1px"
          borderColor="gray.200"
          bg="white"
          _dark={{
            bg: "gray.800",
            borderColor: "gray.700"
          }}
        >
          <ChatSidebar />
        </Box>
      )}
      
      {/* Main content area */}
      <Box 
        flex="1" 
        ml={isMobile ? 0 : "280px"}
        transition="margin 0.3s ease"
        position="relative"
        minH="100vh"
        width={isMobile ? "100%" : "70%"}
      >
        <AbsoluteCenter axis="both"  w={["90%", "85%", "80%", "70%"]} >
          <VStack spacing={4} w="full" h="100vh">
            <Box 
              flex="1"
              overflowY="auto"
              w="full"
              p={4}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              borderRadius="md"
            >
              <MessageWelcome /> 
            </Box>
            
            {/* Nhập thông tin yêu cầu từ người dùng */}
            <Box 
              w="full" 
              position="sticky" 
              boxShadow="lg" 
              borderRadius="xl" 
              bg="white"
              overflow='hidden' 
              _dark={{
                bg: "gray.800"
              }}
            >
              <form onSubmit={handleSubmit}>
                <HStack>
                  <Field flex="1">
                    <Textarea 
                      placeholder="Enter your prompt to video" 
                      lineHeight='tall'
                      variant="none" 
                      maxH="150px" 
                      autoresize  
                      fontSize="16px"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      required
                    />
                  </Field>
                </HStack>
                
                <HStack p={2} spacing={4} justifyContent='space-between'>
                  {/* Chọn thời gian*/}
                  <Box
                    width={["45%", "150px"]}
                    transition="all 0.2s ease"
                    _hover={{ "& > div": { boxShadow: "md", bg: "gray.100" } }}
                  >
                    <SelectRoot
                      required
                      collection={durations}
                      value={duration}
                      onValueChange={(e) => setDuration(e.value)}
                    >
                      <SelectTrigger transition="all 0.2s ease">
                        <SelectValueText placeholder="Duration"/>
                      </SelectTrigger>
                      <SelectContent>
                        {durations.items.map((option) => (
                          <SelectItem item={option} key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Box>
                  
                  {/* Chọn tỉ lệ */}
                  <Box
                    width={["45%", "150px"]}
                    marginEnd='auto'
                    transition="all 0.2s ease"
                    _hover={{ "& > div": { boxShadow: "md", bg: "gray.100" } }}
                  >
                    <SelectRoot
                      required
                      collection={ratios}
                      value={ratio}
                      onValueChange={(e) => setRatio(e.value)}
                    >
                      <SelectTrigger transition="all 0.2s ease">
                        <SelectValueText placeholder="Ratio"/>
                      </SelectTrigger>
                      <SelectContent>
                        {ratios.items.map((option) => (
                          <SelectItem item={option} key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Box>
                  {/* Nút gửi */}
                  <Button 
                    p={3} 
                    cursor="pointer" 
                    onClick={handleSubmit}
                    opacity={isSubmitting ? 0.5 : 1}
                    transition="all 0.2s ease"
                    color={useColorModeValue('black', 'white')}
                    bg = 'transparent'
                    _hover={{ 
                      color: "blue.500", 
                      transform: "scale(1.1)" 
                    }}
                  >
                    <LuSend />
                  </Button>
                </HStack>
              </form>
            </Box>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </Box>
  );
};

export default VideoGeneratePage;