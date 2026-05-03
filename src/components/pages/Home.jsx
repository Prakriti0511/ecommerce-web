import { useEffect, useState, useCallback } from "react";
import Navbar from "../header/Navbar";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

const HERO_IMAGE = "/hero_image.jpg";
const SKIN_TYPE_IMAGE =
  "https://api.builder.io/api/v1/image/assets/TEMP/aa1ec44ee29a90caf0ef476ef282c8c5a2b00292?width=1284";
function resolveImageUrl(src) {
  if (!src) return "/products-grey.png";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function mapProductToCard(p) {
  const priceNum = typeof p.price === "number" ? p.price : Number(p.price);
  const price = Number.isFinite(priceNum) ? `$${priceNum.toFixed(2)}` : String(p.price ?? "");
  const ratingVal = typeof p.rating === "number" ? p.rating : Number(p.rating) || 0;
  const numReviews = typeof p.numReviews === "number" ? p.numReviews : Number(p.numReviews) || 0;
  const ratingLabel =
    numReviews > 0
      ? `${ratingVal.toFixed(1)} (${numReviews.toLocaleString()})`
      : "No reviews yet";
  return {
    id: p._id,
    name: p.name,
    type: p.category?.trim() || "For All Types",
    price,
    ratingVal,
    rating: ratingLabel,
    image: "/bestseller_img.avif",
  };
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
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductCard({ product, inWishlist, wishlistBusyId, onWishlistToggle }) {
  const fullStars = Math.min(5, Math.max(0, Math.round(product.ratingVal || 0)));
  return (
    <div
      className="relative flex-shrink-0 flex flex-col"
      style={{ background: "#F2EEE8", width: "300px", borderRadius: "12px", overflow: "hidden" }}
    >
      {/* Product image with overlay text */}
      <div className="relative" style={{ height: "320px" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ borderRadius: "25px", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)" }}
        />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "25px",
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
          }}
        />
        {/* Heart / wishlist button */}
        <button
          type="button"
          onClick={(e) => onWishlistToggle(e, product.id)}
          disabled={wishlistBusyId === String(product.id)}
          className="absolute top-3 left-3 z-10 bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={inWishlist} />
        </button>
      </div>
      {/* Name + price below image */}
      <div className="px-4 pt-6 pb-2">
        <p
          style={{
            fontFamily: "'Cascadia Code', 'Courier New', monospace",
            fontSize: "16px",
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
            fontSize: "14px",
            color: "#4b4b4b",
            margin: 0,
            marginTop: "2px",
          }}
        >
          {product.price}
        </p>
      </div>
      {/* Stars */}
      <div className="flex items-center gap-0.5 px-3 pb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{ fontSize: "13px", color: i <= fullStars ? "#7C6B47" : "#d1c9bc" }}
          >
            ★
          </span>
        ))}
        <span style={{ fontSize: "11px", color: "#888", marginLeft: "6px" }}>
          {product.rating}
        </span>
      </div>
    </div>
  );
}

function ProductRow({ products, loading, error, wishlistIds, wishlistBusyId, onWishlistToggle }) {
  if (loading)
    return <p style={{ fontSize: "14px", color: "#888", padding: "16px 0" }}>Loading…</p>;
  if (error)
    return <p style={{ fontSize: "14px", color: "#c00", padding: "16px 0" }}>{error}</p>;
  if (products.length === 0)
    return <p style={{ fontSize: "14px", color: "#888", padding: "16px 0" }}>No products found.</p>;
  return (
    <div className="flex overflow-x-auto pb-2" style={{ scrollbarWidth: "thin", scrollBehavior: "smooth", paddingLeft: "14px", paddingRight: "14px", gap: "24px" }}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inWishlist={wishlistIds.includes(String(product.id))}
          wishlistBusyId={wishlistBusyId}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
}

function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);
  const [newArrivalsError, setNewArrivalsError] = useState(null);

  const [bestsellers, setBestsellers] = useState([]);
  const [bestsellersLoading, setBestsellersLoading] = useState(true);
  const [bestsellersError, setBestsellersError] = useState(null);

  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistBusyId, setWishlistBusyId] = useState(null);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/wishlist`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setWishlistIds(Array.isArray(data.wishlistIds) ? data.wishlistIds : []);
    } catch {
      /* ignore */
    }
  }, []);

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

  useEffect(() => {
    (async () => {
      setNewArrivalsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products/new-arrivals`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        setNewArrivals(Array.isArray(data) ? data.map(mapProductToCard) : []);
      } catch (e) {
        setNewArrivalsError(e.message);
      } finally {
        setNewArrivalsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setBestsellersLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products/best-sellers`);
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        setBestsellers(Array.isArray(data) ? data.map(mapProductToCard) : []);
      } catch (e) {
        setBestsellersError(e.message);
      } finally {
        setBestsellersLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return (
    <div style={{ background: "#f3f1ec", minHeight: "100vh" }}>
      <Navbar />

{/* HERO */}
<section
  className="relative w-full"
  style={{
    height: "520px",
    backgroundImage: `url(${HERO_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
    backgroundRepeat: "no-repeat",
  }}
>
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: "490px",
    }}
  >
    <h1
      style={{
        fontFamily: "'Playfair Display', 'Times New Roman', serif",
        fontSize: "92px",
        color: "#f7e7c8",
        fontWeight: 500,
        margin: 0,
        position: "absolute",
        left: "22px",
        top: "50%",
        transform: "translateY(-38%)",
        lineHeight: "0.95",
      }}
    >
      Glow.
    </h1>

    <div
      style={{
        position: "absolute",
        right: "24px",
        top: "50%",
        transform: "translateY(-42%)",
        textAlign: "right",
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', 'Times New Roman', serif",
          fontSize: "34px",
          color: "#f7e7c8",
          marginBottom: "14px",
          lineHeight: "1.25",
          letterSpacing: "0.06em",
          fontWeight: 500,
          marginTop: 0,
        }}
      >
        Where <br /> Radiance <br /> Begins
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "'Khula', 'Segoe UI', sans-serif",
            color: "#f7e7c8",
            fontSize: "13px",
            marginRight: "15px",
            letterSpacing: "0.12em",
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          Sign up now
        </span>
        <span style={{ color: "#f7e7c8", fontSize: "14px", marginRight: "3px", lineHeight: 1 }}>→</span>
      </div>
      <div style={{ width: "200px", height: "1px", background: "#f7e7c8", opacity: 0.95 }} />

    </div>
  </div>
</section>

      {/* NEW ARRIVALS */}
      <section style={{ padding: "14px 0 14px" }}>
        <h2
          style={{
            fontFamily: "'Catamaran', sans-serif",
            fontSize: "24px",
            letterSpacing: 0,
            color: "#4b4b4b",
            margin: "0 14px 12px",
            fontWeight: 400,
          }}
        >
          NEW ARRIVALS
        </h2>

        <div style={{ padding: "0 14px" }}>
          <ProductRow
            products={newArrivals}
            loading={newArrivalsLoading}
            error={newArrivalsError}
            wishlistIds={wishlistIds}
            wishlistBusyId={wishlistBusyId}
            onWishlistToggle={handleWishlistToggle}
          />
        </div>
      </section>

      {/* SCIENCE SECTION */}
      <section style={{ padding: "0 0 14px" }}>
        <div className="flex overflow-hidden">
          <div
            style={{
              background: "linear-gradient(90deg,#efe39a,#f5eaad)",
              padding: "45px 34px 30px",
              width: "48%",
            }}
          >
            <h3
              style={{
                fontFamily: "'Klee One', cursive",
                fontSize: "31px",
                marginBottom: "12px",
                fontWeight: 400,
                color: "#595954",
                lineHeight: 1.22,
                letterSpacing: "-0.01em",
              }}
            >
              Backed by Science, Made for You
            </h3>

            <ul
              style={{
                fontSize: "13px",
                lineHeight: "1.58",
                color: "#60605c",
                fontFamily: "'Klee One', cursive",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>- Dermatologist-tested formulas</li>
              <li>- Clinically proven ingredients</li>
              <li>- No parabens, no sulfates</li>
            </ul>
          </div>

          <img
            src={SKIN_TYPE_IMAGE}
            alt="skin"
            style={{ width: "52%", objectFit: "cover", height: "258px" }}
          />
        </div>
      </section>

      {/* BESTSELLERS */}
      <section style={{ padding: "4px 14px 18px" }}>
        <h2
          style={{
            fontFamily: "'Catamaran', sans-serif",
            fontSize: "43px",
            marginBottom: "12px",
            fontWeight: 400,
            color: "#3e3e3e",
            lineHeight: 1.1,
          }}
        >
          Our Bestsellers
        </h2>

        <ProductRow
          products={bestsellers}
          loading={bestsellersLoading}
          error={bestsellersError}
          wishlistIds={wishlistIds}
          wishlistBusyId={wishlistBusyId}
          onWishlistToggle={handleWishlistToggle}
        />
      </section>

      {/* FOOTER CARD */}
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
    </div>
  );
}

export default Home;
