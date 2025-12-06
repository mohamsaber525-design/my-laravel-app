import React, { useState, useEffect } from 'react';
import {
  MapPin, Calendar, Users, DollarSign, Star,
  Eye, CheckCircle, XCircle, AlertCircle, Clock, ChevronRight
} from 'lucide-react';
import { reservationsAPI, authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rapides');
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const user = authAPI.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUserData(user);

        const data = await reservationsAPI.getMyReservations();
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Erreur lors du chargement');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const stats = [
    { label: "Voyages réservés", valeur: reservations.length, icon: MapPin },
    { label: "Confirmées", valeur: reservations.filter(r => r.status === 'confirmed').length, icon: CheckCircle },
    { label: "En attente", valeur: reservations.filter(r => r.status === 'pending').length, icon: Clock },
    { label: "Points fidélité", valeur: reservations.length * 100, icon: Star }
  ];

  const actionsRapides = [
    {
      titre: "Réserver un voyage",
      description: "Explorer notre sélection de voyages",
      action: "Voir",
      onClick: () => navigate('/voyages')
    },
    {
      titre: "Mes réservations",
      description: "Voir toutes mes réservations",
      action: "Voir",
      onClick: () => setActiveTab('cours')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'rapides', label: 'Actions rapides' },
    { id: 'cours', label: 'Mes réservations' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      {/* Full-width header */}
      <section className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Bonjour, {userData?.name || 'Voyageur'} !
          </h1>
          <p className="text-orange-100 text-lg">
            Gérez vos réservations et découvrez de nouveaux voyages
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <stat.icon className="w-8 h-8 text-orange-600 mb-2" />
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.valeur}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'rapides' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
              <div className="space-y-4">
                {actionsRapides.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.onClick}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-orange-300 hover:bg-orange-50 transition cursor-pointer"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.titre}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <button className="text-orange-600 font-semibold flex items-center">
                      {action.action}
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cours' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                Vos réservations ({reservations.length})
              </h2>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
                  <p className="text-gray-600 mb-6">Vous n'avez pas encore de réservations</p>
                  <button
                    onClick={() => navigate('/voyages')}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
                  >
                    Découvrir nos voyages
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reservations.map(reservation => (
                    <div
                      key={reservation.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="p-4">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getStatusColor(reservation.status)}`}>
                          {reservation.status === 'confirmed' ? 'Confirmé' :
                            reservation.status === 'pending' ? 'En attente' : 'Annulé'}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">
                          {reservation.trip?.title || 'Voyage'}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {reservation.date_reservation}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {reservation.people_count} personne(s)
                          </div>
                        </div>
                        <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;