import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Products() {
  const [products, setProducts] = useState([]);
  //切換頁面
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        const messages = error.response?.data?.message;
        toast.error(
          Array.isArray(messages)
            ? messages.join(", ")
            : messages || "載入產品失敗",
        );
      }
    };
    getProducts();
  }, []);
  //查看更多按鈕
  const handleView = async (id) => {
    navigate(`/product/${id}`);
  };
  //加入購物車
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      toast.success(res.data.message || "已加入購物車！");
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    }
  };
  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card">
              <img
                src={product.imageUrl}
                className="card-img-top"
                style={{ height: "400px", objectFit: "cover" }}
                alt={product.title}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">價格:${product.price}</p>
                <p className="card-text">
                  <small className="text-muted">{product.unit}</small>
                </p>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handleView(product.id)}
                >
                  查看更多
                </button>
                <button
                    type="button"
                    className="btn btn-warning flex-grow-1"
                    onClick={() => addCart(product.id)}
                  >
                    加入購物車
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Products;
