import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
       Abonnez-vous maintenant et bénéficiez de -20 % sur votre première commande !
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8">
        Vous cherchez un moyen simple, rapide et fiable pour faire vos achats en ligne ?
        Avec Senshop, découvrez un univers d’achats pratiques :

Produits variés : mode, beauté, électro, maison, alimentation et plus encore.
 Achat express avec QuickCart : ajoutez au panier et commandez en quelques clics.
Livraison rapide & sécurisée partout au Sénégal.
Paiement flexible : Mobile Money, Carte bancaire, ou Espèces à la livraison.
      </p>
      <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12">
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Entrez votre adresse e-mail"
        />
        <button className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none">
          S’abonner
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
