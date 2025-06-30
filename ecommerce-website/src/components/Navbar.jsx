import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

function Navbar() {
  return (
    <div className={styles.Navbar}>
      <div className={styles.options}>
        <div className={`${styles.option} ${styles.firstOption}`}>New Arrivals</div>
        <div className={styles.option}>Skin Care</div>
        <div className={styles.option}>Hand & Body</div>
        <div className={styles.option}>Hair Care</div>
        <div className={styles.option}>Home</div>
        <FaSearch className={styles.icon} />
      </div>

      <img src="./lush.png" alt="not available" className={styles.logo} />

      <div className={styles.right}>
        <div className={`${styles.option} ${styles.firstOption}`}>Login</div>
        <div className={styles.option}><FaShoppingCart className={styles.icon} /></div>
        
      </div>
    </div>
  );
}

export default Navbar;
