import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Navbar({ variant = "transparent" }) {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await logout();
  };

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
          <div className={styles.profileMenu} ref={menuRef}>
            <button
              type="button"
              className={styles.profileBtn}
              aria-label={`Signed in as ${user.name}`}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <FaUserCircle className={styles.profileIcon} />
            </button>
            {menuOpen && (
              <div className={styles.profileDropdown}>
                <p className={styles.profileGreeting}>Hi, {user.name}</p>
                <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            )}
          </div>
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