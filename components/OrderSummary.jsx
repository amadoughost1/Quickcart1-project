
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems, products } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {

      const token = await getToken()
      const { data } = await axios.get('/api/user/get-address', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message || "Failed to fetch addresses")
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong while fetching addresses")
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {

      if (!selectedAddress) {
        return toast.error('Please select an address')
      }

      // Filtrer les éléments du panier pour ne garder que ceux avec des IDs valides
      let cartItemsArray = Object.keys(cartItems)
        .filter(key => {
          // Vérifier que l'ID est un ObjectId MongoDB valide (24 caractères hexadécimaux)
          const isValidId = /^[0-9a-fA-F]{24}$/.test(key);
          if (!isValidId) {
            console.warn(`Removing invalid product ID from cart: ${key}`);
          }
          return isValidId && cartItems[key] > 0;
        })
        .map((key) => ({ product: key, quantity: cartItems[key] }));

      if (cartItemsArray.length === 0) {
        return toast.error('Your cart is empty or contains invalid items')
      }

      const token = await getToken()

      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id,
        items: cartItemsArray

      }, {
        headers: { Authorization: `Bearer ${token}` }

      })

      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        router.push('/order-placed')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Résumé de la commande
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Sélectionner l’adresse
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Selectionner l'addresse"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Ajouter une nouvelle adresse
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Code promo
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Entrer le code promo"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Appliquer
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Articles {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Frais de livraison</p>
            <p className="font-medium text-gray-800">Livraison gratuite</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Taxe (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Passer la commande
      </button>
    </div>
  );
};

export default OrderSummary;