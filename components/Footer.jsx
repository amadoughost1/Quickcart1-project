import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Senshop est votre boutique en ligne rapide et pratique. Retrouvez une large sélection de
             produits du quotidien : mode, accessoires, beauté, maison, alimentation, et bien plus encore.
              Avec notre système QuickCart, commandez en quelques clics, payez facilement (Mobile Money, carte ou espèces)
               et profitez d’une livraison rapide et sécurisée partout au Sénégal et dans le monde entier.
          </p>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Contactez-nous</h2>
            <div className="text-sm space-y-2">
              <p>+221776417418</p>
              <p>contact@senshop.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Droits d’auteur 2025 © Ahmedu Niang. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;