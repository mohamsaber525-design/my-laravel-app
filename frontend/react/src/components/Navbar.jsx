import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, [location]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* NAV FULL WIDTH FIXED */}
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        {/* CONTENU CENTRÉ */}
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-600 text-white p-2 rounded-lg font-bold text-xl">
              TM
            </div>
            <span className="text-xl font-bold text-gray-800">
              TouriMaroc
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex space-xl-8">
            <Link
              to="/"
              className={`${isActive('/') ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'} transition`}
            >
              Accueil
            </Link>
            <Link
              to="/voyages"
              className={`${isActive('/voyages') ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'} transition`}
            >
              Voyages
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`${isActive('/dashboard') ? 'text-orange-600 font-medium' : 'text-gray-600 hover:text-orange-600'} transition`}
              >
                Mon Tableau de Bord
              </Link>
            )}
          </div>

          {/* Connexion / Déconnexion */}
          <div className="hidden md:block">
            <button
              onClick={handleAuthClick}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </>
              ) : (
                'Connexion'
              )}
            </button>
          </div>

          {/* Menu Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className={`block ${isActive('/') ? 'text-orange-600 font-medium' : 'text-gray-600'}`}
              onClick={() => setMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/voyages"
              className={`block ${isActive('/voyages') ? 'text-orange-600 font-medium' : 'text-gray-600'}`}
              onClick={() => setMenuOpen(false)}
            >
              Voyages
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`block ${isActive('/dashboard') ? 'text-orange-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setMenuOpen(false)}
              >
                Mon Tableau de Bord
              </Link>
            )}
            <button
              onClick={handleAuthClick}
              className="w-full bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center justify-center"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </>
              ) : (
                'Connexion'
              )}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
