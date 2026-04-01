import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

function Navbar({ variant }) {
  const isTransparent = variant === "transparent";

  return (
    <div className={`${styles.Navbar} ${isTransparent ? styles.transparent : ""}`}>
      <div className={styles.options}>
        <div className={`${styles.option} ${styles.firstOption}`}>NEW ARRIVALS</div>
        <div className={styles.option}>SKIN CARE</div>
        <div className={styles.option}>HAND & BODY</div>
        <div className={styles.option}>HAIR CARE</div>
        <div className={styles.option}>HOME</div>
        <FaSearch className={styles.icon} />
      </div>

      <img src="./flowcare.png" alt="not available" className={styles.logo} />

      <div className={styles.right}>
        <div className={`${styles.option} ${styles.firstOption}`}>LOGIN</div>
        <div className={styles.option}><FaShoppingCart className={styles.icon} /></div>
        
      </div>
    </div>
  );
}

export default Navbar;
