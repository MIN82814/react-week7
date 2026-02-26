import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./stroe/store.js";


createRoot(document.getElementById("root")).render(
    <Provider store={store}>
<App /></Provider>);
