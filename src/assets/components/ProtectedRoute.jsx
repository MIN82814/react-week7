import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingTriangles } from "react-loader-spinner";
import useMessage from "../../hooks/useMessage";
import { Navigate } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showError } = useMessage();

  //Cookie取得函式
  const loadToken = () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("minToken="))
      ?.split("=")[1];
    //先判斷是否有token，取得token帶入header
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    return token;
  };
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = loadToken();
        //判斷是否有token沒有就跳出
        if (!token) return;
        const res = await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        showError("登入失敗");
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);
  if (loading) return <RotatingTriangles />;
  if (!isAuth) return <Navigate to="/login" />;
  return children;
}
export default ProtectedRoute;
