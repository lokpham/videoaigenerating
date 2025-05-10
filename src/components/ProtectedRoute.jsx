/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import { useAtom } from "jotai";
import { 
  accessTokenAtom,
  userAtom,
 } from "@/atoms/authAtom";
const ProtectedRoute = ({ children, requiredRole }) => {
  const [accessToken] = useAtom(accessTokenAtom); // 
  const [user] = useAtom(userAtom); // Lấy thông tin người dùng từ atom
  if(!accessToken) {
    return <Navigate to="/login" />;
  }
  if(requiredRole && (!user?.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/admin" replace/>;
  }
  return children; 
}

export default ProtectedRoute;

