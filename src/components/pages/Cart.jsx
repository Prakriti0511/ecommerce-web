import { Link } from "react-router-dom";
import Navbar from "../header/Navbar";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function resolveProductImage(src) {
  if (!src) return "/products-grey.png";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `${API_BASE}/${src.replace(/^\/+/, "")}`;
}

function Cart() {
  const { cart, loading, busyProductId, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (productId, nextQty) => {
    if (nextQty < 1) return;
    const result = await updateQuantity(productId, nextQty);
    if (result.needsAuth) {
      window.alert("Please sign in to manage your cart.");
    } else if (!result.ok) {
      window.alert(result.message || "Could not update quantity.");
    }
  };

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.needsAuth) {
      window.alert("Please sign in to manage your cart.");
    } else if (!result.ok) {
      window.alert(result.message || "Could not remove item.");
    }
  };

  return (
    <div className="cart-page">
      <Navbar />
      <section className="cart-section">
        <h1 className="cart-title">Your Cart</h1>

        {loading ? (
          <p className="cart-muted">Loading cart…</p>
        ) : cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/products" className="cart-shop-link">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.items.map((item) => {
                const busy = busyProductId === item.productId;
                const price = item.product.price ?? 0;
                return (
                  <li key={item.productId} className="cart-item">
                    <img
                      src={resolveProductImage(item.product.image)}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.product.name}</p>
                      <p className="cart-item-price">${price.toFixed(2)}</p>
                      <div className="cart-item-actions">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="cart-qty">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          disabled={busy}
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="cart-remove-btn"
                          disabled={busy}
                          onClick={() => handleRemove(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="cart-item-subtotal">
                      ${(price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="cart-summary">
              <p className="cart-total">
                Total ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}):{" "}
                <strong>${cart.total.toFixed(2)}</strong>
              </p>
              <Link to="/products" className="cart-continue-link">
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Cart;
