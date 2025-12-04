import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Star, Loader } from 'lucide-react';
import { tripsAPI } from '../services/api';

const VoyagesPage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const data = await tripsAPI.getAll();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Erreur lors du chargement des voyages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip =>
    trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-orange-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des voyages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Tous nos voyages</h1>
          <p className="text-lg text-orange-100">Découvrez notre collection de voyages au Maroc</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un voyage ou une destination..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              <span className="font-bold text-gray-900">{filteredTrips.length}</span> voyages trouvés
            </p>
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun voyage trouvé</h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Essayez avec d\'autres mots-clés'
                : 'Les voyages seront bientôt disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Image placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white opacity-50" />
                  </div>
                  {trip.price && (
                    <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                      {trip.price} MAD
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{trip.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    {trip.duration_days && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {trip.duration_days} jour{trip.duration_days > 1 ? 's' : ''}
                      </div>
                    )}
                    {trip.category && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {trip.category.name}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 border-2 border-orange-600 text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 transition text-sm">
                      Voir détails
                    </button>
                    <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition text-sm">
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoyagesPage;
