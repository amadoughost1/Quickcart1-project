"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "XOF";
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Fonction pour nettoyer le panier des IDs invalides
  const cleanCartItems = (items) => {
    const cleaned = {};
    for (const key in items) {
      // Vérifier que l'ID est un ObjectId MongoDB valide (24 caractères hexadécimaux)
      if (/^[0-9a-fA-F]{24}$/.test(key) && items[key] > 0) {
        cleaned[key] = items[key];
      } else {
        console.warn(`Removing invalid cart item: ${key}`);
      }
    }
    return cleaned;
  };

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products);
      } else {
        // Si l'API échoue, utiliser les données factices
        console.warn('API failed, using dummy data:', data.message);
        setProducts(productsDummyData);
      }
    } catch (error) {
      console.warn('API error, using dummy data:', error.message);
      // En cas d'erreur, utiliser les données factices
      setProducts(productsDummyData);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }

      const token = await getToken();

      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        // Nettoyer le panier des IDs invalides
        const cleanedCart = cleanCartItems(data.user.cartItems || {});
        setCartItems(cleanedCart);
      } else {
        // Si l'API échoue, utiliser les données factices
        console.warn('User API failed, using dummy data:', data.message);
        setUserData(userDummyData);
        setCartItems(userDummyData.cartItems || {});
      }
    } catch (error) {
      console.warn('User API error, using dummy data:', error.message);
      // En cas d'erreur, utiliser les données factices
      setUserData(userDummyData);
      setCartItems(userDummyData.cartItems || {});
    }
  };

  const addToCart = async (itemId) => {
    // Vérifier que l'ID est valide avant d'ajouter au panier
    if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
      console.warn(`Cannot add invalid product ID to cart: ${itemId}`);
      toast.error("Invalid product ID");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added to cart");
      } catch (error) {
        console.warn('Cart update failed:', error.message);
        // Continuer même si la mise à jour du panier échoue
        toast.success("Item added to cart (local only)");
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    // Vérifier que l'ID est valide
    if (!/^[0-9a-fA-F]{24}$/.test(itemId)) {
      console.warn(`Cannot update invalid product ID: ${itemId}`);
      toast.error("Invalid product ID");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cart updated");
      } catch (error) {
        console.warn('Cart update failed:', error.message);
        // Continuer même si la mise à jour du panier échoue
        toast.success("Cart updated (local only)");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0 && itemInfo && itemInfo.offerPrice) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
