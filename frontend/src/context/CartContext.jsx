import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const createEmptyLocalCart = () => ({
  items: [],
  total_price: 0,
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  // Track if merge has been attempted to prevent duplicate runs (e.g., strict mode)
  const hasMerged = useRef(false);

  const calculateLocalCartTotals = (items) => {
    const total_price = items.reduce(
      (sum, item) => sum + (item.product_price || 0) * item.quantity,
      0,
    );
    return { items, total_price };
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      // Guest: load from localStorage
      const localCartData = localStorage.getItem("local_cart");
      if (localCartData) {
        try {
          setCart(JSON.parse(localCartData));
        } catch (e) {
          setCart(createEmptyLocalCart());
        }
      } else {
        setCart(createEmptyLocalCart());
      }
      return;
    }

    // Authenticated: fetch from backend
    setLoading(true);
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Merge local guest cart into backend cart (runs once after login)
  const mergeLocalCartIntoBackend = async () => {
    const localCartRaw = localStorage.getItem("local_cart");
    if (!localCartRaw) return false;

    let localCart;
    try {
      localCart = JSON.parse(localCartRaw);
    } catch (e) {
      return false;
    }

    if (!localCart.items || localCart.items.length === 0) {
      return false;
    }

    // Add each guest item to the backend cart sequentially
    for (const item of localCart.items) {
      try {
        await cartAPI.addToCart(item.product_id, item.quantity);
      } catch (err) {
        // Continue merging other items even if one fails
      }
    }

    // Clear local storage after successful merge (even if some items failed, avoid re-merging)
    localStorage.removeItem("local_cart");
    return true;
  };

  // Sync cart based on auth state, and merge guest cart when becoming authenticated
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        // Only merge once per authentication session
        if (!hasMerged.current) {
          hasMerged.current = true;
          await mergeLocalCartIntoBackend();
        }
        // Fetch the updated backend cart (includes merged items + existing backend items)
        await fetchCart();
      } else {
        // Guest: load local cart directly
        fetchCart();
        // Reset merge flag for next login cycle
        hasMerged.current = false;
      }
    };

    syncCart();
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    // Guest track
    if (!isAuthenticated) {
      const currentCart = cart || createEmptyLocalCart();
      const targetProductId = product.id || product.product_id || product;

      if (!targetProductId) {
        return;
      }

      const existingItemIndex = currentCart.items.findIndex((item) => {
        const itemAllocatedId = item.product_id || item.id || item.product?.id;
        return itemAllocatedId === targetProductId;
      });

      let updatedItems = [...currentCart.items];

      if (existingItemIndex > -1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        const fallbackName =
          product.name ||
          product.title ||
          product.product_name ||
          "قطعه سفارشی";
        const fallbackPrice = product.price || product.product_price || 0;
        const fallbackImage = product.image || product.product_image || null;

        updatedItems.push({
          id: targetProductId,
          product_id: targetProductId,
          product_name: fallbackName,
          product_price: Number(fallbackPrice),
          product_image: fallbackImage,
          quantity: quantity,
        });
      }

      const updatedCart = calculateLocalCartTotals(updatedItems);
      localStorage.setItem("local_cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      return;
    }

    // Authenticated track
    try {
      const productId = product.id || product.product_id || product;
      const updatedCart = await cartAPI.addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      throw error;
    }
  };

  const clearLocalCart = () => {
    localStorage.removeItem("local_cart");
    setCart(createEmptyLocalCart());
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, fetchCart, clearLocalCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
