import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
const API_BASE = import.meta.env.VITE_API_BASE;
import "../assets/style.css";
import { emailValidation } from "../utils/validation";

function Login({ getProducts, setIsAuth }) {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "min82814@gmail.com",
      password: "",
    },
  });
  //登入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({ ...preData, [name]: value }));
  };
  //表單按鈕驗證+token存取
  const onSubmit = async (formData) => {
    // e.preventDefault(); // 阻止表單自動刷新
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data; // 先在這裡拿到
      saveToken(token, expired); // 再傳給函式

      // getProducts();
      // setIsAuth(true);
    } catch (error) {
      const message = error.response?.data?.message || "表單驗證失敗";
      toast.error(message);
      setIsAuth(false);
    }
  };
  //Cookie存取函式
  const saveToken = (token, expired) => {
    document.cookie = `minToken=${token};expires=${new Date(expired)};`;
    //如果登入成功取得token帶入header
    axios.defaults.headers.common["Authorization"] = token;
  };
  return (
    <>
      {" "}
      <div className="container login">
        <h1>請登入</h1>
        <form className="form-floating " onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="username"
              placeholder="name@example.com"
              // value={formData.username}
              // onChange={handleInputChange}
              id="username"
              {...register("username", emailValidation)}
            />
            <label htmlFor="username">Email address</label>
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              {...register("password", {
                required: "請輸入密碼",
                minLength: {
                  value: 6,
                  message: "密碼長度至少需 6 碼",
                },
              })}
              // value={formData.password}
              // onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={!isValid}
          >
            登入
          </button>
        </form>
      </div>
    </>
  );
}
export default Login;
