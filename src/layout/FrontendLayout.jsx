import { Outlet, Link } from "react-router-dom";

function FrontendLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container flex-grow-1">
        <header>
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                首頁
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/products"
              >
                產品列表
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/cart">
                購物車
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/checkout">
                結帳
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/login">
                登入
              </Link>
            </li>
          </ul>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <footer
        className="mt-5 text-center py-2"
        style={{ backgroundColor: "#ecd2ad" }}
      >
        <p>Min甜點店商</p>
      </footer>
    </div>
  );
}
export default FrontendLayout;
