import { Navigate } from "react-router";
import { useAtom } from "jotai";
import { 
  accessTokenAtom
 } from "@/atoms/authAtom";
const ProtectedRoute = ({ children }) => {
  const [accessToken] = useAtom(accessTokenAtom); // 
  if(!accessToken) {
    // Nếu không có accessToken, điều hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }
  return children; // Nếu có accessToken, hiển thị nội dung của route
}

export default ProtectedRoute;

