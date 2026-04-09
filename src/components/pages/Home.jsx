import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "../header/Navbar";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function resolveImageUrl(src) {
  if (!src) return "/products-grey.png";
  if (src.startsWith("http")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

function mapProductToCard(p) {
  const badge = p.isBestSeller
    ? "Bestseller"
    : p.isNewArrival
      ? "New Arrival"
      : "Featured";
  const type = p.category?.trim() || "For All Types";
  const priceNum = typeof p.price === "number" ? p.price : Number(p.price);
  const price = Number.isFinite(priceNum) ? `$${priceNum.toFixed(2)}` : String(p.price ?? "");
  const ratingVal = typeof p.rating === "number" ? p.rating : Number(p.rating) || 0;
  const numReviews = typeof p.numReviews === "number" ? p.numReviews : Number(p.numReviews) || 0;
  const ratingLabel =
    numReviews > 0
      ? `${ratingVal.toFixed(1)} (${numReviews.toLocaleString()})`
      : numReviews === 0 && ratingVal > 0
        ? `${ratingVal.toFixed(1)}`
        : "No reviews yet";
  const image = resolveImageUrl(p.images?.[0]);
  const cta = p.isBestSeller ? "Select Size" : "Add";
  return {
    id: p._id,
    badge,
    name: p.name,
    type,
    price,
    originalPrice: null,
    rating: ratingLabel,
    ratingVal,
    image,
    cta,
  };
}

function Home() {
  const newArrivalsRef = useRef(null);
  const navbarRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistBusyId, setWishlistBusyId] = useState(null);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/wishlist`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setWishlistIds(Array.isArray(data.wishlistIds) ? data.wishlistIds : []);
    } catch {
      /* not logged in or network */
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

  const loadNewArrivals = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products/new-arrivals`);
      if (!res.ok) throw new Error(`Could not load new arrivals (${res.status})`);
      const data = await res.json();
      const list = Array.isArray(data) ? data.map(mapProductToCard) : [];
      setProducts(list);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewArrivals();
  }, [loadNewArrivals]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (!newArrivalsRef.current || !navbarRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          navbarRef.current.classList.add("navbar-inverted");
        } else {
          navbarRef.current.classList.remove("navbar-inverted");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(newArrivalsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero — tall scroll area; bg-fixed keeps image visible longer while scrolling (desktop) */}
      <div className="relative w-full min-h-[240vh] bg-[url('/1.png')] bg-cover bg-center bg-no-repeat md:bg-fixed">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex flex-col min-h-[240vh]">
          <div ref={navbarRef} className="navbar-base">
            <Navbar />
          </div>

          {/* Two distinct sections: "Glow" | "From Within" */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-32 pt-8">
            <div className="flex w-full max-w-4xl flex-col items-stretch justify-center gap-6 text-white md:flex-row md:items-center md:gap-0 md:py-12">
              <div className="flex flex-1 flex-col items-center justify-center border-b border-white/35 pb-6 md:border-b-0 md:items-end md:border-r md:border-white/40 md:pb-0 md:pr-10">
                <span className="text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl md:leading-none">
                  Glow
                </span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center pt-2 md:items-start md:pt-0 md:pl-10">
                <span className="text-5xl font-bold tracking-tight sm:text-6xl md:text-8xl md:leading-none opacity-95">
                  From Within
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
<div
  ref={newArrivalsRef}
  className="w-full py-8 px-6"
  style={{ background: "#f5f2ed" }}
>
  <h2 className="text-sm font-semibold tracking-wide text-black mb-5">
    New Arrivals
  </h2>

  {/* Horizontal scrollable card row — comfortable gap between cards */}
  <div className="flex gap-6 overflow-x-auto pb-2 px-1 scrollbar-hide">
    {loading && (
      <p className="text-sm text-gray-500 py-4">Loading new arrivals…</p>
    )}
    {!loading && fetchError && (
      <p className="text-sm text-red-600 py-4">{fetchError}</p>
    )}
    {!loading && !fetchError && products.length === 0 && (
      <p className="text-sm text-gray-500 py-4">No new arrivals yet.</p>
    )}
    {!loading &&
      !fetchError &&
      products.map((product) => {
        const fullStars = Math.min(5, Math.max(0, Math.round(product.ratingVal || 0)));
        const inWishlist = wishlistIds.includes(String(product.id));
        return (
      <div
        key={product.id}
        className="min-w-[240px] shrink-0 flex flex-col justify-between p-3 pt-9 relative overflow-visible"
        style={{ background: "#f0ede7" }}
      >
        {/* Badge — top left of card */}
        <p className="absolute top-2 left-2 z-10 max-w-[calc(100%-3rem)] text-[10px] font-semibold tracking-widest uppercase text-gray-600">
          {product.badge}
        </p>

        {/* Product image + wishlist heart pinned to top-right of image area */}
        <div className="relative mt-7 w-full h-[220px] flex items-center justify-center overflow-hidden">
          <button
            type="button"
            onClick={(e) => handleWishlistToggle(e, product.id)}
            disabled={wishlistBusyId === String(product.id)}
            className="absolute top-1 right-1 z-30 cursor-pointer border-none bg-transparent p-0 shadow-none outline-none focus-visible:ring-2 focus-visible:ring-black/25 rounded disabled:opacity-50"
            aria-pressed={inWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={inWishlist ? "#e11d48" : "none"}
              stroke={inWishlist ? "#e11d48" : "#111"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[200px] max-w-full object-contain"
          />
        </div>

        {/* Footer Info */}
        <div className="mt-4">
          <p className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
            {product.type}
          </p>
          <p className="text-xs font-semibold tracking-wide uppercase text-black mb-2 leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-[11px] ${i <= fullStars ? "text-black" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
            <span className="text-[11px] text-gray-500 ml-1">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-black">{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <button className="text-[10px] font-semibold tracking-widest uppercase border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors">
              {product.cta}
            </button>
          </div>
        </div>
      </div>
        );
      })}
  </div>
</div>
      {/* Navbar Styling */}
      <style>{`
        .navbar-base {
          position: sticky;
          top: 0;
          z-50;
          background: transparent;
          transition: background-color 0.4s ease;
        }

        .navbar-base.navbar-inverted {
          background-color: #1a1a1a;
        }

        .navbar-base.navbar-inverted :is(a, button, span, div) {
          color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}

export default Home;