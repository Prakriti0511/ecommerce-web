import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../header/Navbar';
import './Products.css';

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function resolveProductImage(src) {
  if (!src) return "/products-grey.png";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `${API_BASE}/${src.replace(/^\/+/, "")}`;
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill={filled ? "#eb5b5b" : "rgba(235,91,91,0)"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.5766 4.80209C22.0233 4.26981 21.3663 3.84756 20.6433 3.55947C19.9202 3.27139 19.1452 3.12311 18.3625 3.12311C17.5798 3.12311 16.8047 3.27139 16.0817 3.55947C15.3586 3.84756 14.7016 4.26981 14.1483 4.80209L13 5.90626L11.8516 4.80209C10.734 3.72741 9.21809 3.12366 7.63747 3.12366C6.05685 3.12366 4.54097 3.72741 3.4233 4.80209C2.30563 5.87677 1.67773 7.33435 1.67773 8.85418C1.67773 10.374 2.30563 11.8316 3.4233 12.9063L13 22.1146L22.5766 12.9063C23.1302 12.3742 23.5693 11.7425 23.869 11.0473C24.1686 10.352 24.3228 9.60677 24.3228 8.85418C24.3228 8.10158 24.1686 7.35637 23.869 6.6611C23.5693 5.96583 23.1302 5.33413 22.5766 4.80209Z"
        stroke="#7C6B47"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductCard({ product, inWishlist, wishlistBusyId, onWishlistToggle, onClick }) {
  const priceNum = typeof product.price === "number" ? product.price : Number(product.price);
  const price = Number.isFinite(priceNum) ? `$${priceNum.toFixed(2)}` : String(product.price ?? "");
  const ratingVal = typeof product.rating === "number" ? product.rating : Number(product.rating) || 0;
  const numReviews = typeof product.numReviews === "number" ? product.numReviews : Number(product.numReviews) || 0;
  const ratingLabel = numReviews > 0 ? `${ratingVal.toFixed(1)} (${numReviews.toLocaleString()})` : "No reviews yet";
  const fullStars = Math.min(5, Math.max(0, Math.round(ratingVal)));
  const imageSrc = resolveProductImage(product.image);

  return (
    <div
      className="product-card"
      style={{ background: "#F2EEE8", width: "220px", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="relative" style={{ height: "240px" }}>
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ borderRadius: "25px", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "25px",
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
          }}
        />
        <button
          type="button"
          onClick={(e) => onWishlistToggle(e, product._id ?? product.id)}
          disabled={wishlistBusyId === String(product._id ?? product.id)}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            opacity: wishlistBusyId === String(product._id ?? product.id) ? 0.5 : 1,
          }}
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={inWishlist} />
        </button>
      </div>
      <div className="px-3 pt-4 pb-2">
        <p
          style={{
            fontFamily: "'Cascadia Code', 'Courier New', monospace",
            fontSize: "14px",
            color: "#4b4b4b",
            margin: 0,
            lineHeight: "1.3",
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: "'Cascadia Code', 'Courier New', monospace",
            fontSize: "12px",
            color: "#4b4b4b",
            margin: 0,
            marginTop: "2px",
          }}
        >
          {price}
        </p>
      </div>
      <div className="flex items-center gap-0.5 px-2 pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{ fontSize: "11px", color: i <= fullStars ? "#7C6B47" : "#d1c9bc" }}
          >
            ★
          </span>
        ))}
        <span style={{ fontSize: "10px", color: "#888", marginLeft: "4px" }}>
          {ratingLabel}
        </span>
      </div>
    </div>
  );
}

const CHAT_WELCOME =
  "Hello! Ask what you're looking for — skin type, concerns, ingredients, budget, new arrivals, or bestsellers — and I'll suggest products from our catalog.";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistBusyId, setWishlistBusyId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => [
    { id: "welcome", role: "assistant", text: CHAT_WELCOME, products: [] },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chatOpen) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatOpen, chatMessages, chatLoading]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/wishlist`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setWishlistIds(Array.isArray(data.wishlistIds) ? data.wishlistIds : []);
    } catch {
      /* ignore */
    }
  };

  const handleWishlistToggle = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const id = String(productId);
    setWishlistBusyId(id);
    try {
      const res = await fetch(`${API_BASE}/api/wishlist/toggle/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        window.alert("Please sign in to save items to your wishlist.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setWishlistIds(Array.isArray(data.wishlistIds) ? data.wishlistIds : []);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not update wishlist.");
    } finally {
      setWishlistBusyId(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProductFromChat = (p) => {
    const id = p.id ?? p._id;
    setSelectedProduct({
      _id: id,
      id,
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      category: p.category,
      rating: p.rating,
      numReviews: p.numReviews,
    });
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userId = `u-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setChatMessages((prev) => [...prev, { id: userId, role: "user", text, products: [] }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fallback =
          typeof data.aiMessage === "string"
            ? data.aiMessage
            : `Something went wrong (${res.status}). Please try again.`;
        setChatMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            role: "assistant",
            text: fallback,
            products: Array.isArray(data.products) ? data.products : [],
          },
        ]);
        return;
      }

      const aiMessage =
        typeof data.aiMessage === "string" && data.aiMessage.trim()
          ? data.aiMessage.trim()
          : "Here’s what I found.";
      const suggested = Array.isArray(data.products) ? data.products : [];

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          text: aiMessage,
          products: suggested,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          text: "Could not reach the server. Check your connection and that the API is running.",
          products: [],
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ background: "#f3f1ec", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ padding: "2rem", color: "#c00", fontSize: "1rem" }}>Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f3f1ec", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "40px 14px 24px 14px" }}>
        <h2
          style={{
            fontFamily: "'Catamaran', sans-serif",
            fontSize: "43px",
            marginBottom: "20px",
            fontWeight: 400,
            color: "#3e3e3e",
            lineHeight: 1.1,
            margin: "0 0 20px 0",
          }}
        >
          Our Products
        </h2>

        <div className="search-box" style={{ marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{
              fontFamily: "'Cascadia Code', 'Courier New', monospace",
              padding: "12px 16px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #d1c9bc",
              background: "white",
              width: "100%",
              maxWidth: "400px",
            }}
          />
        </div>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#888", padding: "16px 0" }}>Loading…</p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#888", padding: "16px 0" }}>No products found.</p>
        ) : (
          <div className="flex overflow-x-auto pb-2" style={{ scrollbarWidth: "thin", scrollBehavior: "smooth", paddingLeft: "0", paddingRight: "14px", gap: "24px", flexWrap: "wrap" }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                inWishlist={wishlistIds.includes(String(product._id || product.id))}
                wishlistBusyId={wishlistBusyId}
                onWishlistToggle={handleWishlistToggle}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <div className="modal-body">
              <div className="modal-image-wrapper">
                <img
                  src={resolveProductImage(selectedProduct.image)}
                  alt={selectedProduct.name}
                  className="modal-image"
                />
              </div>
              <div className="modal-details">
                <h2 style={{ fontFamily: "'Cascadia Code', 'Courier New', monospace" }}>{selectedProduct.name}</h2>
                <p className="modal-price" style={{ fontFamily: "'Cascadia Code', 'Courier New', monospace" }}>
                  ${typeof selectedProduct.price === "number" ? selectedProduct.price.toFixed(2) : selectedProduct.price}
                </p>
                <button className="add-to-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={{ padding: "0 14px 16px" }}>
        <div
          style={{
            background: "#ece7e2",
            borderRadius: "16px",
            padding: "16px 20px 14px",
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #ddd5cd",
          }}
        >
          <div>
            <h3
              style={{
                color: "#e891a8",
                fontWeight: "bold",
                fontFamily: "'Gotu', sans-serif",
                margin: 0,
                fontSize: "44px",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              alara
            </h3>
            <p
              style={{
                fontSize: "12px",
                marginTop: "6px",
                color: "#706d68",
                fontFamily: "'Gotu', sans-serif",
              }}
            >
              Where Radiance Begins.
            </p>

            <div
              className="flex gap-3 mt-2"
              style={{ color: "#7e7972", fontSize: "11px", fontFamily: "'Gotu', sans-serif" }}
            >
              <span>X</span>
              <span>IG</span>
              <span>f</span>
            </div>

            <p
              style={{
                fontSize: "9px",
                marginTop: "8px",
                color: "#7e7972",
                fontFamily: "'Gotu', sans-serif",
              }}
            >
              © 2026 Glow Skin Care
            </p>
          </div>

          <div
            style={{
              textAlign: "left",
              color: "#a36b74",
              fontFamily: "'Gotu', sans-serif",
              fontSize: "11px",
              lineHeight: 1.75,
              paddingTop: "5px",
              minWidth: "96px",
            }}
          >
            <p style={{ margin: 0 }}>Home</p>
            <p style={{ margin: 0 }}>About</p>
            <p style={{ margin: 0 }}>Contact Us</p>
            <p style={{ margin: 0 }}>Login</p>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Button */}
      <button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        aria-expanded={chatOpen}
        aria-label={chatOpen ? "Close skincare assistant" : "Open skincare assistant"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#7C6B47",
          border: "2px solid #F2EEE8",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: chatOpen ? "scale(1.1)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#6b5a3d";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#7C6B47";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6.18-.99C9.31 21.75 10.63 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.41 0-2.73-.3-3.93-.86l-.28-.15-2.9.46.47-2.83-.18-.29C4.25 14.82 4 13.47 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm3.64-11.36c-.2-.2-.52-.2-.72 0l-2.5 2.5c-.2.2-.52.2-.72 0l-1.44-1.44c-.2-.2-.52-.2-.72 0-.2.2-.2.52 0 .72l1.44 1.44c.2.2.2.52 0 .72l-2.5 2.5c-.2.2-.2.52 0 .72.2.2.52.2.72 0l2.5-2.5c.2-.2.52-.2.72 0l1.44 1.44c.2.2.52.2.72 0 .2-.2.2-.52 0-.72l-1.44-1.44c-.2-.2-.2-.52 0-.72l2.5-2.5c.2-.2.2-.52 0-.72z"
            fill="#F2EEE8"
          />
        </svg>
      </button>

      {/* Chat Popup */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "320px",
            background: "#F2EEE8",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
            maxHeight: "500px",
            border: "2px solid #7C6B47",
          }}
        >
          <div
            style={{
              background: "#7C6B47",
              color: "white",
              padding: "16px",
              borderRadius: "10px 10px 0 0",
              fontFamily: "'Catamaran', sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>AI Assistant</span>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
          <div
            className="chat-messages"
            style={{
              padding: "12px 14px",
              flex: 1,
              overflowY: "auto",
              fontFamily: "'Cascadia Code', monospace",
              fontSize: "13px",
              color: "#4b4b4b",
              lineHeight: "1.45",
              minHeight: "220px",
              maxHeight: "320px",
            }}
          >
            {chatMessages.map((m) => (
              <div
                key={m.id}
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "92%",
                    padding: "8px 10px",
                    borderRadius: "10px",
                    background: m.role === "user" ? "#ddd5cd" : "white",
                    border: m.role === "user" ? "none" : "1px solid #d1c9bc",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.role === "assistant" && (
                    <span style={{ color: "#7C6B47", fontSize: "11px", display: "block", marginBottom: "4px" }}>
                      Skincare assistant
                    </span>
                  )}
                  {m.text}
                </div>
                {m.role === "assistant" && m.products?.length > 0 && (
                  <div style={{ marginTop: "8px", width: "100%" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#888" }}>Suggested products</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {m.products.map((p) => {
                        const img = resolveProductImage(p.image);
                        const priceLabel =
                          typeof p.price === "number" ? `$${p.price.toFixed(2)}` : String(p.price ?? "");
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => openProductFromChat(p)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid #d1c9bc",
                              background: "#faf8f5",
                              cursor: "pointer",
                              textAlign: "left",
                              width: "100%",
                            }}
                          >
                            <img
                              src={img}
                              alt=""
                              style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                            />
                            <span style={{ flex: 1, fontSize: "12px", color: "#3e3e3e" }}>{p.name}</span>
                            <span style={{ fontSize: "11px", color: "#7C6B47" }}>{priceLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <p style={{ margin: 0, fontSize: "12px", color: "#888", fontStyle: "italic" }}>Thinking…</p>
            )}
            <div ref={chatEndRef} />
          </div>
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid #d1c9bc",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="e.g. moisturizer for dry skin under $50"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage();
                }
              }}
              disabled={chatLoading}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #d1c9bc",
                borderRadius: "6px",
                fontFamily: "'Cascadia Code', monospace",
                fontSize: "12px",
                background: "white",
              }}
            />
            <button
              type="button"
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              style={{
                background: "#7C6B47",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: chatLoading || !chatInput.trim() ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: 600,
                opacity: chatLoading || !chatInput.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
