import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    const handleView = async (id) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(res.data.product);
      } catch (error) {
        const messages = error.response?.data?.message;
        toast.error(
          Array.isArray(messages)
            ? messages.join(", ")
            : messages || "產品載入失敗",
        );
      }
    };
    handleView(id);
  }, [id]);
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    }
  };
  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <div className="container mt-3">
      <div className="card" style={{ width: "500px" }}>
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
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductDetail;
