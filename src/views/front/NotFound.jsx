import { Link } from "react-router";

function NotFound() {
  return(<><h2>404找不到頁面</h2>
  <Link to="/" className="btn btn-primary">回到首頁</Link></> )
}
export default NotFound;
