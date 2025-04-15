import {
  Box,
  Heading,
  Flex,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Text,
  Spinner,
  Card,
  CardHeader,
  CardBody
} from "@chakra-ui/react";

import { HeaderAdmin } from '@/components/admin/HeaderAdmin';
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import { useEffect, useState } from 'react';
import api from "@/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // State lưu dữ liệu thống kê từ API
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu thống kê khi component được mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/dashboard-stats"); // Gọi API
        setStats(response.data); // Cập nhật state với dữ liệu trả về
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false); // Dừng hiển thị loading spinner
      }
    };

    fetchStats();
  }, []);

  // Dữ liệu biểu đồ line (video theo từng ngày trong tuần)
  const chartData = stats?.weeklyVideoStats || [];

  return (
    <Flex h='100vh' bg='white'>
      {/* Sidebar bên trái */}
      <Box shadow='xs' m='2' borderRadius='4xl' borderColor="blue.800">
        <SidebarAdmin />
      </Box>

      {/* Nội dung chính bên phải */}
      <Box flex='1' p={6}>
        <VStack align="stretch">
          {/* Header phía trên */}
          <Heading size="lg" mb={4}>
            <HeaderAdmin />
          </Heading>

          {/* Nếu đang loading thì hiển thị spinner */}
          {loading ? (
            <Spinner size="xl" alignSelf="center" />
          ) : (
            <>
              {/* Các chỉ số tổng quan */}
              <SimpleGrid columns={[1, 2, 2, 4]} spacing={6} mb={8}>
                <Stat bg="gray.50" p={4} borderRadius="xl" shadow="md">
                  <StatLabel>Tổng số người dùng</StatLabel>
                  <StatNumber>{stats.totalUsers}</StatNumber>
                </Stat>

                <Stat bg="gray.50" p={4} borderRadius="xl" shadow="md">
                  <StatLabel>Tổng số video</StatLabel>
                  <StatNumber>{stats.totalVideos}</StatNumber>
                </Stat>

                <Stat bg="gray.50" p={4} borderRadius="xl" shadow="md">
                  <StatLabel>Video tạo trong tuần</StatLabel>
                  <StatNumber>{stats.weeklyVideos}</StatNumber>
                </Stat>

                <Stat bg="gray.50" p={4} borderRadius="xl" shadow="md">
                  <StatLabel>Top User</StatLabel>
                  <StatNumber>{stats.topUser?.name}</StatNumber>
                  <Text fontSize="sm" color="gray.500">
                    {stats.topUser?.videoCount} videos
                  </Text>
                </Stat>
              </SimpleGrid>

              {/* Biểu đồ đường thể hiện video theo tuần */}
              <Card>
                <CardHeader>
                  <Heading size="md">Thống kê video theo tuần</Heading>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" /> {/* ngày trong tuần */}
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3182CE" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
