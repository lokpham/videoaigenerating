import { Box, Heading, VStack, Input, Button, Text, Select, Portal, createListCollection, Checkbox  } from "@chakra-ui/react";

import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '@/api';
import { useAtom } from 'jotai';
import { toaster, Toaster } from '@/components/ui/toaster';
import { accessTokenAtom } from '@/atoms/authAtom';


const roles = createListCollection({
  items: [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
]});
const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessToken] = useAtom(accessTokenAtom);
  const [userData, setUserData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: ['user'],
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await api.get(`/user/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          setUserData({
            ...response.data,
            password: '',
            confirmPassword: ''
          });
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          toaster.create({
            title: "Lỗi",
            description: "Không thể lấy thông tin người dùng.",
            type: "error",
            duration: 3000,
          });
        }
      };
      fetchUserData();
    }
  }, [id, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match when adding new user
    if (!id && userData.password !== userData.confirmPassword) {
      toaster.create({
        title: "Lỗi",
        description: "Mật khẩu và xác nhận mật khẩu không khớp.",
        type: "error",
        duration: 3000,
      });
      return;
    }
    
    try {
      if(id) {
        // Update user
        // Remove password fields if they're empty when updating
        const dataToSend = {...userData};
        if (!dataToSend.password) {
          delete dataToSend.password;
          delete dataToSend.confirmPassword;
        }
        
        await api.put(`/user/${id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        toaster.create({
          title: "Thành công",
          description: "Cập nhật người dùng thành công.",
          type: "success",
          duration: 3000,
        });
      }
      else {
        // Add new user
        await api.post('/user', userData, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        toaster.create({
          title: "Thành công",
          description: "Thêm người dùng thành công.",
          type: "success",
          duration: 3000,
        });
      }
      navigate("/admin/users");
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
      toaster.create({
        title: "Lỗi",
        description: "Không thể lưu người dùng.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Heading size="lg" mb={6}>
        {id ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        <Toaster/>
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text mb={2}>Họ tên</Text>
            <Input
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
            />
          </Box>
          
          <Box>
            <Text mb={2}>Tên đăng nhập</Text>
            <Input
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Nhập user name"
              required
            />
          </Box>
          
          <Box>
            <Text mb={2}>Email</Text>
            <Input
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </Box>
          
          {/* Password fields - only required for new users */}
          {!id && (
            <>
              <Box>
                <Text mb={2}>Mật khẩu <Text as="span" color="red.500">*</Text></Text>
                <Input
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </Box>
              
              <Box>
                <Text mb={2}>Xác nhận mật khẩu <Text as="span" color="red.500">*</Text></Text>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </Box>
            </>
          )}

          
          <Box
            w="full"
            h="40px"
            mb={4}
          >     
            <Text mb={2}>Vai trò</Text>
            <Select.Root 
              collection={roles}  
              value={userData.roles || "user"}
              onValueChange={(value) => setUserData({ ...userData, roles: [value] })}>
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Vai trò" color="gray.500"/>
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {roles.items.map((role) => (
                      <Select.Item item={role} key={role.value}>
                        {role.label}  
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
            
          <Box pt={2} mt={2} mb={4}>
            <Text mb={2}>Trạng thái</Text>
            <Checkbox.Root
              
              name="isActive"
              checked={userData.isActive}
              onCheckedChange={(e) => setUserData({ ...userData, isActive: e })}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Kích hoạt tài khoản</Checkbox.Label>
            </Checkbox.Root>
          </Box> 
          
          <Button type="submit" variant="subtle" bg="blue.600" width="full" mt={4}>
            Lưu
          </Button>
          <Button
            variant="subtle"
            bg="red.600"
            colorScheme="gray"
            width="full"
            onClick={() => navigate("/admin/users")}
          >
            Hủy
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UserForm;