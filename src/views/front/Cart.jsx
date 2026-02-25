import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
function Cart() {
  const [cart, setCart] = useState({});

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
    getCart();
  }, []);
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

  return (
    <div className="container">
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
                    defaultValue={cartItem.qty}
                    onChange={(e) =>{
                      const val=Number(e.target.value);
                      if (val >= 1 && val!==cartItem.qty) {
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        val
                      )}}
                    }
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
    </div>
  );
}
export default Cart;
