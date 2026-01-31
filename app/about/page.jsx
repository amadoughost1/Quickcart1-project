'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-12 pb-20">
        <div className="text-center mb-12">
          <p className="text-3xl font-medium">À propos de <span className="text-orange-600">Nous</span></p>
          <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto mt-2"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <Image src={assets.about_image || assets.logo} alt="About Us" className="rounded-lg shadow-md w-full" />
          </div>
          
          <div className="w-full md:w-1/2 text-gray-600 leading-relaxed">
            <p className="mb-4">
              Bienvenue sur notre plateforme. Nous nous engageons à offrir les meilleurs produits 
              avec un focus sur la qualité, la durabilité et l'innovation.
            </p>
            <p className="mb-6">
              Notre mission est de connecter les créateurs et les clients à travers une expérience 
              d'achat fluide et sécurisée. Chaque produit est sélectionné avec soin pour répondre 
              à vos attentes les plus exigeantes.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="border p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900">10k+</h4>
                  <p className="text-sm">Produits Vendus</p>
               </div>
               <div className="border p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900">5k+</h4>
                  <p className="text-sm">Clients Heureux</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;