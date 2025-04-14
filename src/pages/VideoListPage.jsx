import {
  Box,
  VStack,
  IconButton,
  useDisclosure,
  useBreakpointValue,
  Flex,
  Text,
  Image,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DrawerRoot, DrawerBody, DrawerContent } from '@/components/ui/drawer';
import { LuMenu } from "react-icons/lu";
import { Toaster, toaster } from '@/components/ui/toaster';

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from 'react-router';
import ChatSidebar from "@/components/SidebarUser";
import { Infomation } from "@/components/Infomation";
import api from "@/api";
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  logoutAtom,
} from "@/atoms/authAtom.js";

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});
  const [loadingMedia, setLoadingMedia] = useState({}); // Trạng thái loading cho từng file
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [accessToken] = useAtom(accessTokenAtom);
  const [, logout] = useAtom(logoutAtom);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch danh sách video
  const fetchUserVideos = useCallback(async () => {
    try {
      if (!accessToken) {
        navigate('/login', { state: { error: "Please login to continue" } });
        return;
      }
      setLoading(true);
      setIsFetching(true);

      const response = await api.get('/video/user-videos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Videos from backend:", response.data);
      
      // Kiểm tra phản hồi từ backend
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        console.error("Invalid response data format:", response.data);
        toaster.create({
          title: "Data Error",
          description: "Received invalid data format from server",
          type: "error",
          duration: 3000,
          isClosable: true,
        });
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching user videos:", error.response?.data || error.message);
      // Thông báo khi load thất bại
      toaster.create({
        title: "Fetch Error",
        description: "Failed to load videos. Please try again.",
        type: "error",
        duration: 3000,
        isClosable: true,
      });

      if (error.response?.status === 401) {
        await logout();
        navigate("/login", { state: { error: "Session expired, please login again" } });
      }
      
      // Set videos to empty array on error
      setVideos([]);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [accessToken]);

  // Fetch media (video, images, generateText) cho từng video
  const fetchMediaForVideo = useCallback(async (video) => {
    if (!video || !video._id) {
      console.error("Invalid video object:", video);
      return;
    }
    
    // Cập nhật trạng thái loading
    setLoadingMedia(prev => ({ ...prev, [`video-${video._id}`]: true }));
    const newUrls = { ...mediaUrls };

    try {
      // Fetch video
      if (video._id) {
        try {
          console.log(`Fetching video for ID: ${video._id}`);
          const videoResponse = await api.get(`/video/download/${video._id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: 'blob',
            timeout: 60000, // Tăng timeout lên 60 giây
          });
          //
          console.log(`Video response status: ${videoResponse.status}`);
          console.log(`Video response headers:`, videoResponse.headers);

          // // Kiểm tra content-type một cách linh hoạt hơn
          // const contentType = videoResponse.headers['content-type'];
          // if (contentType && contentType.includes('video')) {
          //   newUrls[`video-${video._id}`] = URL.createObjectURL(videoResponse.data);
          // } else {
          //   console.warn(`Unexpected content type for video: ${contentType}`);
          //   // Vẫn tạo URL nếu có dữ liệu
          //   if (videoResponse.data.size > 0) {
          //     newUrls[`video-${video._id}`] = URL.createObjectURL(videoResponse.data);
          //   }
          // }
          // Đơn giản hóa logic xử lý content-type
          const contentType = videoResponse.headers['content-type'];
          console.log(`Content-Type: ${contentType}`);
          if (videoResponse.data.size > 0) {
            const videoUrl = URL.createObjectURL(videoResponse.data);
            newUrls[`video-${video._id}`] = videoUrl;
            console.log(`Created video URL: ${videoUrl}`);
          } else {
            console.warn(`Video data is empty for ID: ${video._id}`);
          }
        } catch (videoError) {
          console.error(`Failed to load video ${video._id}:`, videoError.response?.data || videoError.message);
        }
      }

      // Fetch images
      if (Array.isArray(video.images)) {
        for (const image of video.images) {
          if (image && image._id) {
            try {
              const imageResponse = await api.get(`/video/download/image/${image._id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: "blob",
                timeout: 10000,
              });
              
              if (imageResponse.data.size > 0) {
                newUrls[`image-${image._id}`] = URL.createObjectURL(imageResponse.data);
              }
            } catch (imageError) {
              console.error(`Failed to load image ${image._id}:`, imageError.response?.data || imageError.message);
            }
          }
        }
      }

      setMediaUrls(prevUrls => {
        console.log("Updated mediaUrls:", { ...prevUrls, ...newUrls });
        return { ...prevUrls, ...newUrls };});
    } catch (error) {
      console.error(`General error fetching media for video ${video._id}:`, error);
    } finally {
      console.log("---- Log thông báo finally")
      // Cập nhật trạng thái loading khi hoàn thành
      // setLoadingMedia(prev => ({ ...prev, [`video-${video._id}`]: false }));
      setLoadingMedia(prev => {
        const updated = { ...prev, [`video-${video._id}`]: false };
        console.log("Updated loadingMedia:", updated);
        return updated;
      });
    }
  }, [accessToken, mediaUrls]);

  // Fetch videos khi component mount hoặc khi refreshTrigger thay đổi
  useEffect(() => {
    if (accessToken) { // Chỉ gọi nếu có accessToken
      fetchUserVideos();
    }
    // Cleanup function 
    return () => {
      setVideos([]);
      setIsFetching(false);
    };
  }, [fetchUserVideos, refreshTrigger]);

  // Fetch media cho các videos đã tải
  useEffect(() => {
    const fetchAllMedia = async () => {
      console.log("Fetching media for videos:", videos); // Thêm log để kiểm tra
      if (videos && videos.length > 0) {
        for (const video of videos) {
          if (video && video._id && !loadingMedia[`video-${video._id}`] ) {
            console.log(`Calling fetchMediaForVideo for video ID: ${video._id}`);
            await fetchMediaForVideo(video);
          }
        }
      }
    };
    
    fetchAllMedia();
  }, [videos, fetchMediaForVideo, loadingMedia, mediaUrls]);

  // Cleanup URLs khi component unmount
  useEffect(() => {
    return () => {
      if (mediaUrls && typeof mediaUrls === "object") {
        Object.values(mediaUrls).forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
      }
    };
  }, []);

  const videoList = useMemo(() => {
    console.log("Rendering videoList with loadingMedia:", loadingMedia);
    console.log("Rendering videoList with mediaUrls:", mediaUrls);
    return videos && videos.length > 0 ? (
      <VStack spacing={6} align="stretch">
        {videos.map((video, videoIndex) => (
          <Box key={video._id || videoIndex} borderWidth="1px" borderRadius="lg" p={4}>
            <Text fontWeight="bold" fontSize="lg" mb={2}>
              Video {videoIndex + 1} {video.filename ? `- ${video.filename}` : ''}
            </Text>

            {/* Hiển thị hình ảnh */}
            <Box>
              <Text fontWeight="medium">Images:</Text>
              {video.images && video.images.length > 0 ? (
                <Flex gap={2} flexWrap="wrap">
                  {video.images.map((image, imgIndex) => (
                    <Box key={image._id || imgIndex} position="relative">
                      <Image
                        loading="lazy"
                        src={mediaUrls[`image-${image._id}`]}
                        alt={`Generated Image ${imgIndex + 1}`}
                        boxSize="200px"
                        objectFit="cover"
                        fallback={<Box boxSize="200px" bg="gray.100" display="flex" alignItems="center" justifyContent="center"><Text color="gray.500">Loading...</Text></Box>}
                      />
                      {mediaUrls[`image-${image._id}`] && (
                        <Button
                          as="a"
                          href={mediaUrls[`image-${image._id}`]}
                          download={image.filename || `image-${imgIndex}.jpg`}
                          size="sm"
                          position="absolute"
                          bottom="2"
                          right="2"
                          variant="ghost"
                        >
                          <Text fontSize="xs">Download</Text>
                        </Button>
                      )}
                    </Box>
                  ))}
                </Flex>
              ) : (
                <Text>No images available</Text>
              )}
            </Box>
              {/* Hiển thị video */}
            <Box mt={4}>
              <Text fontWeight="medium">Video:</Text>
              {video.filename ? (
                loadingMedia[`video-${video._id}`] ? (
                  <Flex direction="column" alignItems="center" justifyContent="center" h="200px" bg="gray.100" borderRadius="md">
                    <Spinner size="md"/>
                    <Text mt={2} color='black'>Loading video...</Text>
                    {console.log(`Loading video ${video._id}: đã thêm ${loadingMedia[`video-${video._id}`]}`)}
                  </Flex>
                ) : mediaUrls[`video-${video._id}`] ? (
                  <Box>
                    <video 
                      controls 
                      width="100%" 
                      onError={(e) => {
                        console.error("Video playback error:", e);
                        e.target.parentNode.innerHTML = 'Error loading video. <button onclick="fetchMediaForVideo(video)">Retry</button>';
                      }}
                    >
                      <source src={mediaUrls[`video-${video._id}`]} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                    <Button
                      as="a"
                      href={mediaUrls[`video-${video._id}`]}
                      download={video.filename || `video-${videoIndex}.mp4`}
                      size="sm"
                      mt={2}
                    >
                      Download Video
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Text>Video: {video.filename} (Failed to load)</Text>
                    <Button
                      onClick={() => fetchMediaForVideo(video)}
                      size="sm"
                      mt={2}
                      colorScheme="blue"
                    >
                      Retry
                    </Button>
                  </Box>
                )
              ) : (
                <Text>No video available</Text>
              )}
            </Box>

            <Box mt={4}>
              <Text fontWeight="medium">Generated Text:</Text>
              {video.generatedText ? (
                <Text whiteSpace="pre-wrap">{video.generatedText.content || "No generated text available"}</Text>
              ) : (
                <Text>No generated text available</Text>
              )}
            </Box>
          </Box>
        ))}
      </VStack>
    ) : (
      <Box textAlign="center" p={10} borderWidth="1px" borderRadius="lg">
        <Text color="gray.500" mb={4}>
          No videos available. Create a new video to get started!
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate('/video/create')} // Điều hướng đến trang tạo video mới
        >
          Create New Video
        </Button>
      </Box>
    );
  }, [videos, mediaUrls, loadingMedia, fetchMediaForVideo, navigate]);

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
          w="200px"
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
        ml={isMobile ? 0 : "200px"}
        transition="margin 0.3s ease"
        position="relative"
        minH="100vh"
        width={isMobile ? "100%" : "calc(100% - 200px)"}
      >
        <Box w={["90%", "85%", "80%", "70%"]} mx="auto" my={8}>
          <VStack spacing={4} w="full">
            <Flex justifyContent="space-between" w="full" mb={4}>
              <Button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                colorScheme="blue"
                leftIcon={<LuMenu />}
              >
                Refresh Videos
              </Button>
              {isFetching && <Spinner size="sm" />}
            </Flex>
            <Box
              w="full"
              p={4}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              borderRadius="md"
              overflowY="auto"
              maxH="85vh"
            >
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="50vh"
              >
                <VStack>
                  <Spinner size="xl" />
                  <Text mt={4}>Loading videos...</Text>
                </VStack>
              </Box>
            ) : (
              videoList
            )}
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoListPage;