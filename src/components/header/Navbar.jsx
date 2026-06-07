import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Navbar({ variant = "transparent" }) {
  const { itemCount } = useCart();
  const { user } = useAuth();

  return (
    <header className={`${styles.navbar} ${styles[variant]}`}>
      <nav className={styles.center}>
        <Link to="/" className={styles.navLink}>
          HOME
        </Link>
        <Link to="/products" className={styles.navLink}>
          PRODUCTS
        </Link>
        <Link to="/products?filter=new-arrivals" className={styles.navLink}>
          NEW ARRIVALS
        </Link>
        <Link to="/products?filter=bestsellers" className={styles.navLink}>
          BESTSELLERS
        </Link>
      </nav>
      <div className={styles.right}>
        <FaSearch />
        <Link to="/cart" className={styles.cartLink} aria-label={`Cart, ${itemCount} items`}>
          <FaShoppingCart />
          {itemCount > 0 && (
            <span className={styles.cartBadge}>{itemCount > 99 ? "99+" : itemCount}</span>
          )}
        </Link>
        {user ? (
          <span className={styles.profileBtn} aria-label={`Signed in as ${user.name}`} title={user.name}>
            <FaUserCircle className={styles.profileIcon} />
          </span>
        ) : (
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;