import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { authAPI } from '../services/api';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      const user = JSON.parse(localStorage.getItem('user'));
      setIsAdmin(user?.role === 'admin');
      setUserName(user?.name || '');
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
      setShowUserMenu(false);
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
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-2 rounded-lg font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                TM
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                TM
              </span>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
              >
                Accueil
              </Link>
              <Link
                to="/voyages"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/voyages')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
              >
                Voyages
              </Link>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-700">{userName}</span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{userName}</p>
                          <p className="text-xs text-gray-500">{isAdmin ? 'Administrateur' : 'Client'}</p>
                        </div>

                        <Link
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-3" />
                          Mon Tableau de Bord
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Administration
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 font-medium hover:text-orange-600 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Menu Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* User Info Mobile */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Administrateur' : 'Client'}</p>
                  </div>
                </div>
              )}

              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>

              <Link
                to="/voyages"
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive('/voyages')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                Voyages
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${isActive('/dashboard')
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    Mon Tableau de Bord
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${isActive('/admin')
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      Administration
                    </Link>
                  )}

                  <button
                    onClick={handleAuthClick}
                    className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center rounded-lg font-medium border-2 border-orange-600 text-orange-600 hover:bg-orange-50 transition-all"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center rounded-lg font-medium bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 transition-all shadow-md"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;