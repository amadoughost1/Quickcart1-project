'use client'
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  // 1. Créer une référence pour le formulaire
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    // 2. Ta configuration EmailJS (À REMPLACER)
    const SERVICE_ID = "service_abc123"; 
    const TEMPLATE_ID = "template_7vf23rq";
    const PUBLIC_KEY = "_yOiZ-1QUE-blHPKs";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          alert("Génial ! Ton message a été envoyé.");
          form.current.reset(); // Vide le formulaire après envoi
          setIsSending(false);
      }, (error) => {
          alert("Oups... Une erreur est survenue.");
          console.error(error.text);
          setIsSending(false);
      });
  };

  return (
    <>
      <Navbar />
      <section className="px-6 md:px-16 lg:px-32 py-16 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Contactez-<span className="text-orange-600">Nous</span></h1>
          <p className="text-gray-500 mt-2">Nous vous répondrons dans les plus brefs délais.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {/* L'attribut ref={form} est crucial ici */}
          <form ref={form} onSubmit={handleSendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nom Complet</label>
                <input name="user_name" type="text" required placeholder="Ex: Jean Dupont" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Votre Email</label>
                <input name="user_email" type="email" required placeholder="jean@example.com"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sujet</label>
              <input name="subject" type="text" required placeholder="Comment pouvons-nous vous aider ?"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea name="message" rows="5" required placeholder="Votre message ici..."
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSending}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all 
                ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-md'}`}
            >
              {isSending ? "Envoi en cours..." : "Envoyer le Message"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;