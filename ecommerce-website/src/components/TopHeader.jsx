import styles from "./TopHeader.module.css";

function TopHeader() {
  return (
    <div className={styles.topHeader}>
      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeContent}>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹499</span>
          <span>GET 10% OFF ON YOUR FIRST ORDER </span>
          <span>NEW: SUMMER SKIN COLLECTION </span>
          <span>CHECK OUR BODY & HAIR RANGE COLLECTION </span>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹499</span>
          <span>GET 10% OFF ON YOUR FIRST ORDER </span>
          <span>NEW: SUMMER SKIN COLLECTION </span>
          <span>CHECK OUR BODY & HAIR RANGE COLLECTION </span>
          <span>FREE SHIPPING ON ORDERS ABOVE ₹499</span>
          <span>GET 10% OFF ON YOUR FIRST ORDER </span>
          <span>NEW: SUMMER SKIN COLLECTION </span>
          <span>CHECK OUR BODY & HAIR RANGE COLLECTION </span>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;

