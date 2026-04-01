import { useEffect, useRef } from "react";
import Navbar from "../header/Navbar";

function Home() {
  const newArrivalsRef = useRef(null);
  const navbarRef = useRef(null);

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

  const products = [
    { id: 1, badge: "Bestseller", name: "Product One", type: "For All Types", price: "$34", originalPrice: null, rating: "4.4 (3,567)", image: "/hair.png", cta: "Select Size" },
    { id: 2, badge: "Bestseller", name: "Product Two", type: "For All Types", price: "$34", originalPrice: null, rating: "4.4 (3,668)", image: "/product2.png", cta: "Select Size" },
    { id: 3, badge: "New Arrival", name: "Product Three", type: "For All Types", price: "$160", originalPrice: "$178", rating: "4.4 (1,461)", image: "/product3.png", cta: "Add" },
    { id: 4, badge: "New Arrival", name: "Product Four", type: "For All Types", price: "$92", originalPrice: "$102", rating: "4.4 (2,052)", image: "/product4.png", cta: "Add" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-[url('/1.png')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <div ref={navbarRef} className="navbar-base">
            <Navbar />
          </div>

          <div className="flex-1 flex items-center justify-center text-white text-4xl font-bold">
            Welcome to Our Store
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

  {/* Horizontal scrollable card row */}
  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
    {products.map((product) => (
      <div
        key={product.id}
        className="min-w-[240px] flex-1 flex flex-col justify-between p-3 relative"
        style={{ background: "#f0ede7" }}
      >
        {/* Badge */}
        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-2">
          {product.badge}
        </p>

        {/* Wishlist Heart */}
        <button className="absolute top-3 right-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"/>
          </svg>
        </button>

        {/* Product Image */}
        <div className="w-full h-[220px] flex items-center justify-center overflow-hidden">
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
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[11px]">★★★★</span>
            <span className="text-[11px] text-gray-300">★</span>
            <span className="text-[11px] text-gray-500">{product.rating}</span>
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
    ))}
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