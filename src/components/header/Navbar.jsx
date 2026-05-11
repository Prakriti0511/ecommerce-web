import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ variant = "transparent" }) {
  return (
    <header className={`${styles.navbar} ${styles[variant]}`}>
      <nav className={styles.center}>
        <span className={styles.home}>HOME</span>
        <span>REVIEWS</span>
        <span>NEW ARRIVALS</span>
        <span>BESTSELLERS</span>
      </nav>
      <div className={styles.right}>
        <FaSearch />
        <FaShoppingCart />
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
      </div>
    </header>
  );
}

export default Navbar;