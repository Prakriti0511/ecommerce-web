import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

const CartContext = createContext(null);

const EMPTY_CART = { items: [], itemCount: 0, total: 0 };

export function CartProvider({ children }) {
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(true);
  const [busyProductId, setBusyProductId] = useState(null);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, { credentials: "include" });
      if (res.status === 401) {
        setCart(EMPTY_CART);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setCart({
        items: Array.isArray(data.items) ? data.items : [],
        itemCount: Number(data.itemCount) || 0,
        total: Number(data.total) || 0,
      });
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const getItemQuantity = useCallback(
    (productId) => {
      const id = String(productId);
      const item = cart.items.find((i) => i.productId === id);
      return item?.quantity ?? 0;
    },
    [cart.items]
  );

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const id = String(productId);
    setBusyProductId(id);
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (res.status === 401) {
        return { ok: false, needsAuth: true };
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, message: err.message || "Could not add to cart" };
      }
      const data = await res.json();
      setCart({
        items: Array.isArray(data.items) ? data.items : [],
        itemCount: Number(data.itemCount) || 0,
        total: Number(data.total) || 0,
      });
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not reach the server" };
    } finally {
      setBusyProductId(null);
    }
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const id = String(productId);
    setBusyProductId(id);
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (res.status === 401) {
        return { ok: false, needsAuth: true };
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, message: err.message || "Could not update cart" };
      }
      const data = await res.json();
      setCart({
        items: Array.isArray(data.items) ? data.items : [],
        itemCount: Number(data.itemCount) || 0,
        total: Number(data.total) || 0,
      });
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not reach the server" };
    } finally {
      setBusyProductId(null);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const id = String(productId);
    setBusyProductId(id);
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      if (res.status === 401) {
        return { ok: false, needsAuth: true };
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, message: err.message || "Could not remove item" };
      }
      const data = await res.json();
      setCart({
        items: Array.isArray(data.items) ? data.items : [],
        itemCount: Number(data.itemCount) || 0,
        total: Number(data.total) || 0,
      });
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not reach the server" };
    } finally {
      setBusyProductId(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      busyProductId,
      itemCount: cart.itemCount,
      loadCart,
      getItemQuantity,
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [cart, loading, busyProductId, loadCart, getItemQuantity, addToCart, updateQuantity, removeFromCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
