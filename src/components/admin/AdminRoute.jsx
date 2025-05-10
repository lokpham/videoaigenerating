/* eslint-disable react/prop-types */
import { useAtom } from "jotai";
import { Navigate } from "react-router";
import { userAtom } from "@/atoms/authAtom";

const AdminRoute = ({ children }) => {
  const [user] = useAtom(userAtom);

  if (!user) return <Navigate to="/login" replace />;

  const adminRole = (Array.isArray(user.roles) && user.roles.includes('admin')) || 
  user.roles === 'admin';

  if (!adminRole) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;