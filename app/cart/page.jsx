'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

const Cart = () => {

  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount, setCartItems } = useAppContext();

  // Fonction pour nettoyer le panier des éléments invalides
  const cleanCart = () => {
    const cleaned = {};
    for (const itemId in cartItems) {
      // Vérifier que l'ID est un ObjectId MongoDB valide et que le produit existe
      if (/^[0-9a-fA-F]{24}$/.test(itemId) && products.find(p => p._id === itemId)) {
        cleaned[itemId] = cartItems[itemId];
      }
    }
    setCartItems(cleaned);
    toast.success("Cart cleaned of invalid items");
  };

  if (Object.keys(cartItems).length === 0) {
    return (
      <>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 min-h-screen">
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-medium text-gray-800 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits à votre panier pour commencer !</p>
            <button onClick={() => router.push('/all-products')} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
              Continuer vos achats
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-gray-800">Panier</h1>
                <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Articles</p>
              </div>
              <button
                onClick={cleanCart}
                className="text-sm text-orange-600 hover:text-orange-700 underline"
              >
                Supprimer les articles invalides
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="text-left">
                  <tr>
                    <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Détails du produit
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Prix
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Quantité
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                      Sous-total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    const product = products.find(product => product._id === itemId);

                    if (!product || cartItems[itemId] <= 0 || !product.image || !Array.isArray(product.image) || product.image.length === 0) return null;

                    return (
                      <tr key={itemId}>
                        <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                          <div>
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                              <Image
                                src={product.image[0]}
                                alt={product.name || 'Product image'}
                                className="w-16 h-auto object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className="md:hidden text-xs text-orange-600 mt-1"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Supprimer
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800">{product.name}</p>
                            <button
                              className="text-xs text-orange-600 mt-1"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600">${product.offerPrice}</td>
                        <td className="py-4 md:px-4 px-1">
                          <div className="flex items-center md:gap-2 gap-1">
                            <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                              <Image
                                src={assets.decrease_arrow}
                                alt="decrease_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                            <input onChange={e => updateCartQuantity(product._id, Number(e.target.value))} type="number" value={cartItems[itemId]} className="w-8 border text-center appearance-none"></input>
                            <button onClick={() => addToCart(product._id)}>
                              <Image
                                src={assets.increase_arrow}
                                alt="increase_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600">${(product.offerPrice * cartItems[itemId]).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600">
              <Image
                className="group-hover:-translate-x-1 transition"
                src={assets.arrow_right_icon_colored}
                alt="arrow_right_icon_colored"
              />
              Continuer vos achats
            </button>
          </div>
          <OrderSummary />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
