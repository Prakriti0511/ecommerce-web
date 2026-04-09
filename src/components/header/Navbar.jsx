import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ variant }) {
  const isTransparent = variant === "transparent";

  return (
    <div className={`${styles.Navbar} ${isTransparent ? styles.transparent : ""}`}>
      <img src="./flowcare.png" alt="not available" className={styles.logo} />

      <div className={styles.navLinks}>
        <div className={styles.options}>
          <div className={`${styles.option} ${styles.firstOption}`}>NEW ARRIVALS</div>
          <div className={styles.option}>SKIN CARE</div>
          <div className={styles.option}>HAND & BODY</div>
          <div className={styles.option}>HAIR CARE</div>
          <div className={styles.option}>HOME</div>
          <FaSearch className={styles.icon} />
        </div>

        <div className={styles.right}>
          <Link to="/login" className={`${styles.option} ${styles.firstOption} ${styles.navLink}`}>
            LOGIN
          </Link>
          <div className={`${styles.option} ${styles.cartOption}`}>
            <FaShoppingCart className={styles.icon} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
