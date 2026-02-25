import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/style.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <RouterProvider router={router} />
    </>
  );
}
export default App;
