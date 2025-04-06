import { useState, useEffect } from "react";
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
  Flex,
  Text,
  Image
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
import { Toaster, toaster } from '@/components/ui/toaster';

import { useNavigate } from 'react-router';
import ChatSidebar from "@/components/ChatSidebar";
import MessageWelcome from "@/components/MessageWelcome";
import { Infomation } from "@/components/Infomation";
import api from "@/api";



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
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Đóng mở sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt || !ratio || !duration ) {
      toaster.create({
        title: 'Missing Fields',
        description: 'Please fill in all fields!',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('duration', duration);
    if (file) {
      formData.append('music', file); // Chỉ append nếu có file
    }
    // Xử lý ratio để tính width và height
    let width, height;
    if (ratio === "169") {
      width = 1280;
      height = 720;
    } else if (ratio === "916") {
      width = 720;
      height = 1280;
    } else if (ratio === "11") {
      width = 1080;
      height = 1080;
    }
    formData.append('width', width);
    formData.append('height', height);

    try {
      console.log("Sending data to backend:", { prompt, duration, width, height });
      const response = await api.post('/video/generate-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      toaster.create({
        title: 'Video Generated',
        description: 'Your video has been generated successfully.',
        type: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      toaster.create({
        title: 'Generation Error',
        description: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" position="relative" minH="100vh">
      <Toaster />
      <Flex position="absolute" top="4" right="4" zIndex="100" align="center" gap="2">
        <ColorModeButton />
        <Infomation />
      </Flex>

      {isMobile && (
        <Box position="absolute" top="4" left="4" zIndex="100">
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

      {isMobile && (
        <DrawerRoot placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerContent maxWidth="30%">
            <DrawerBody p={0}>
              <ChatSidebar onItemClick={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      )}

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
            borderColor: "gray.700",
          }}
        >
          <ChatSidebar />
        </Box>
      )}

      <Box
        flex="1"
        ml={isMobile ? 0 : "280px"}
        transition="margin 0.3s ease"
        position="relative"
        minH="100vh"
        width={isMobile ? "100%" : "70%"}
      >
        <AbsoluteCenter axis="both" w={["90%", "85%", "80%", "70%"]}>
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
              {result ? (
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="medium">Paragraph:</Text>
                    <Text>{result.paragraph}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium">Image Prompts:</Text>
                    {result.prompts.map((prompt, index) => (
                      <Text key={index}>- {prompt}</Text>
                    ))}
                  </Box>

                  <Box>
                    <Text fontWeight="medium">Images:</Text>
                    <Flex wrap="wrap" gap={4}>
                      {result.images.map((imageUrl, index) => (
                        <Image
                          key={index}
                          src={imageUrl}
                          alt={`Generated Image ${index + 1}`}
                          boxSize="200px"
                          objectFit="cover"
                        />
                      ))}
                    </Flex>
                  </Box>

                  <Box>
                    <Text fontWeight="medium">Audio:</Text>
                    <audio controls>
                      <source src={result.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>

                  <Box>
                    <Text fontWeight="medium">Subtitles:</Text>
                    <Text>{result.subtitle}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="medium">Video:</Text>
                    <video controls width="100%">
                      <source src={result.video} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </Box>
                </VStack>
              ) : (
                <MessageWelcome />
              )}
            </Box>

            <Box
              w="full"
              position="sticky"
              boxShadow="lg"
              borderRadius="xl"
              bg="white"
              overflow="hidden"
              _dark={{
                bg: "gray.800",
              }}
            >
              <form onSubmit={handleSubmit}>
                <HStack>
                  <Field flex="1">
                    <Textarea
                      placeholder="Enter your prompt to video"
                      lineHeight="tall"
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

                <HStack p={2} spacing={4} justifyContent="space-between">
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
                        <SelectValueText placeholder="Duration" />
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

                  <Box
                    width={["45%", "150px"]}
                    marginEnd="auto"
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
                        <SelectValueText placeholder="Ratio" />
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

                  <Box
                    width={["45%", "150px"]}
                    marginEnd="auto"
                    transition="all 0.2s ease"
                    _hover={{ "& > div": { boxShadow: "md", bg: "gray.100" } }}
                  >
                    <input
                      type="file"
                      accept=".mp3,.wav,.ogg"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                  </Box>

                  <Button
                    p={3}
                    cursor="pointer"
                    onClick={handleSubmit}
                    opacity={isSubmitting ? 0.5 : 1}
                    transition="all 0.2s ease"
                    color={useColorModeValue('black', 'white')}
                    bg="transparent"
                    _hover={{
                      color: "blue.500",
                      transform: "scale(1.1)",
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