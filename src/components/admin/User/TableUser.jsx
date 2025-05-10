/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Table, IconButton,
  Badge
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { Toaster, toaster } from "@/components/ui/toaster";
import { MdDeleteForever } from "react-icons/md";
import api from "@/api";
import { useState } from "react";



const TableUser = ({users, onEdit, accessToken, refreshUsers}) => {
  const [deletingUser, setDeletingUser] = useState({});

  const handleDeleteUser = async (userId) => { 
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng ${userId?.fullName || userId?.email || "này"}? Hành động này không thể hoàn tác.`
    );
    if (!confirmed) return;
    setDeletingUser((prev) => ({ ...prev, [userId]: true })); 
    try {
      await api.delete(`/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      toaster.create({
        title: "Thành công",
        description: "Xóa người dùng thành công.",
        type: "success",
        duration: 3000,
      })
      refreshUsers(); // Refetch the user list after deletion 
    } catch (error) {
      console.error("Error deleting user:", error);
    let errorMessage = "Không thể xóa người dùng.";
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response.status === 404) {
        errorMessage = "Người dùng không tồn tại.";
      }
    } else if (error.request) {
      errorMessage = "Không thể kết nối đến máy chủ.";
    }
    toaster.create({
      title: "Lỗi",
      description: errorMessage,
      type: "error",
      duration: 3000,
    });
    }finally {
      setDeletingUser((prev) => ({ ...prev, [userId]: false }));
    }
  }
  
  return (
    <Table.Root 
      color="black"
      bg="white"
      variant="outline"
      borderRadius='lg'
      stickyHeader
    >
      <Toaster />
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Họ tên</Table.ColumnHeader>
          <Table.ColumnHeader>Email</Table.ColumnHeader>
          <Table.ColumnHeader>Vai trò</Table.ColumnHeader>
          <Table.ColumnHeader>Trạng thái</Table.ColumnHeader>
          <Table.ColumnHeader>Hành động</Table.ColumnHeader>
      </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row
            key={user._id}
            _hover={{ bg: "blue.100" }}
            cursor="pointer"
            >
            <Table.Cell px="2" py="0">{user.fullName}</Table.Cell>
            <Table.Cell px="2" py="0">{user.email}</Table.Cell>
            <Table.Cell px="2" py="0">{user.roles?.join(', ')}</Table.Cell>
            <Table.Cell px="2" py="0">{
              user.isActive ? 
              <Badge bg="green" color="white">Đang hoạt động</Badge> :
              <Badge bg="red" color="white">Đã khóa</Badge> }
            </Table.Cell>
            <Table.Cell px="2" py="0">
              <IconButton
                size="lg"
                onClick={() => onEdit(user)}
                mr={2}
                color="blue.400"
                bg="transparent"
                _hover={{ bg: "blue.700" }}
              >
                <FaEdit />
              </IconButton>
              <IconButton
                size="lg"
                color="red.400"
                _hover={{ bg: "red.700" }}
                bg="transparent"
                aria-label="Delete User"
                onClick={() => handleDeleteUser(user._id)}
                isLoading={deletingUser[user._id] || false}
                isDisabled={deletingUser[user._id]}
              > 
                <MdDeleteForever />
              </IconButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

export default TableUser;

