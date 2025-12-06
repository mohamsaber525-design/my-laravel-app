// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colonne 1 - À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-600 text-white p-2 rounded-lg font-bold">
                TM
              </div>
              <span className="text-xl font-bold text-white">TouriMaroc</span>
            </div>
            <p className="text-sm">
              Votre partenaire de confiance pour découvrir les merveilles du Maroc.
              Voyages authentiques et expériences inoubliables.
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/voyages" className="hover:text-orange-500 transition">
                  Nos voyages
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition">
                  Mon compte
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Marrakech
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Désert du Sahara
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Montagnes de l'Atlas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Villes Impériales
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 +212 5XX XXX XXX</li>
              <li>✉️ contact@tourimaroc.ma</li>
              <li>📍 Marrakech, Maroc</li>
              <li className="pt-2">
                <div className="flex space-x-3">
                  <a href="#" className="hover:text-orange-500 transition">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-orange-500 transition">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-orange-500 transition">
                    Twitter
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TouriMaroc. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-orange-500 transition">
              Politique de confidentialité
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition">
              Conditions d'utilisation
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;