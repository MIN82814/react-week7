import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { currency } from "../../utils/filter";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import DetailProductModal from "../../assets/components/DetailProductModal";
import { emailValidation } from "../../utils/validation";
import { phonePattern } from "../../utils/phonePattern";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Checkout() {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingProductId, setLoadingProductsId] = useState(null);
  const productModalRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages)
          ? messages.join(", ")
          : messages || "購物車載入失敗",
      );
    }
  };
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
    getCart();
    productModalRef.current = new bootstrap.Modal("#productModal");
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);
  const addCart = async (id, qty = 1) => {
    setLoadingCartId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      getCart();
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    } finally {
      setLoadingCartId(null);
    }
  };
  //新增數量
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = { product_id: productId, qty };
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      getCart();
      toast.success("數量更新成功");
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    }
  };

  //刪除單品項
  const delCart = async (cartId) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      getCart();
      toast.success("商品已刪除");
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    }
  };
  //刪除全部品項
  const delAllCart = async () => {
    try {
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
      toast.success("購物車已清空");
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages) ? messages.join(", ") : messages || "操作失敗",
      );
    }
  };
  const onSubmit = async (formData) => {
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      getCart();
      toast.success("訂購完成");
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages)
          ? messages.join(", ")
          : messages || "訂單送出失敗",
      );
    }
    reset();
  };
  const handleView = async (id) => {
    setLoadingProductsId(id);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      const messages = error.response?.data?.message;
      toast.error(
        Array.isArray(messages)
          ? messages.join(", ")
          : messages || "產品載入失敗",
      );
    } finally {
      setLoadingProductsId(null);
    }
    productModalRef.current.show();
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：${product.origin_price}</del>
                <div className="h5">特價：${product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines
                        visible={true}
                        height={16}
                        width={80}
                        color="grey"
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartId === product.id}
                  >
                    {loadingCartId === product.id ? (
                      <RotatingLines
                        visible={true}
                        height={16}
                        width={80}
                        color="grey"
                      />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => delAllCart()}
        >
          清空購物車
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col" className="text-end">
              小計
            </th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => delCart(cartItem.id)}
                >
                  刪除
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div
                  className="input-group input-group-sm mb-3"
                  style={{ width: "20%" }}
                >
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    min="1"
                    value={cartItem.qty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val !== cartItem.qty) {
                        updateCart(cartItem.id, cartItem.product_id, val);
                      }
                    }}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", emailValidation)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="姓名"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入姓名",
                minLength: { value: 2, message: "姓名最少兩個字" },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="電話"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入收件人電話",
                minLength: { value: 8, message: "電話至少輸入8碼" },
                pattern: {
                  value: phonePattern,
                  message: "電話僅能輸入數字",
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="地址"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", { required: "請輸入地址" })}
            />{" "}
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <DetailProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
        getCart={getCart}
      />
    </div>
  );
}
export default Checkout;
