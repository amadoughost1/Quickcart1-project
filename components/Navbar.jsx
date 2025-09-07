"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton, UserProfile } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Accueil
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Boutique
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          À propos
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Tableau de bord vendeur</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4">
        {/* <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" /> */}

        {user ? (
          <>
            <button
              onClick={() => router.push("/cart")}
              className="hover:text-gray-900 transition flex items-center gap-1 relative"
            >
              <Image src={assets.cart_icon} alt="Cart icon" className="w-5 h-5" />
              <span className="text-sm">Panier</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Mon compte
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Tableau de bord vendeur</button>}
        {user ? (
          <button
            onClick={() => router.push("/cart")}
            className="hover:text-gray-900 transition flex items-center gap-1 relative"
          >
            <Image src={assets.cart_icon} alt="Cart icon" className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Mon compte
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;