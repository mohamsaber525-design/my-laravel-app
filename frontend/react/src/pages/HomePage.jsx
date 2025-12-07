import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Shield, Award, Clock, Heart, Loader, Star, ChevronRight, TrendingUp, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { reviewsAPI, voyagesAPI, authAPI } from '../services/api';


const HomePage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', trip_id: '' });
  const [allTrips, setAllTrips] = useState([]); // For the dropdown in modal
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tripsData, reviewsData] = await Promise.all([
          fetch('http://localhost:8000/api/trips').then(res => res.json()),
          reviewsAPI.getAll()
        ]);

        setTrips(Array.isArray(tripsData) ? tripsData.slice(0, 3) : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        // Check auth for "Add Review" button visibility
        setIsAuthenticated(authAPI.isAuthenticated());

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenReviewModal = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      // Fetch all trips for the dropdown if not already fetched
      if (allTrips.length === 0) {
        const data = await voyagesAPI.getAll();
        setAllTrips(data);
      }
      setShowReviewModal(true);
    } catch (error) {
      console.error('Error fetching trips for modal:', error);
    }
  };
  const getImageUrl = (trip) => {
    if (trip.main_image) {
      return trip.main_image.startsWith('http')
        ? trip.main_image
        : `http://localhost:8000/storage/${trip.main_image}`;
    }
    return null;
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const addedReview = await reviewsAPI.create(newReview);
      setReviews([addedReview, ...reviews].slice(0, 3)); // Add new review to top and keep only 3
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: '', trip_id: '' });
      alert('Votre avis a été ajouté avec succès !');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de l\'ajout de l\'avis. Veuillez réessayer.');
    }
  };

  const stats = [
    { nombre: "500+", label: "Voyages organisés", icon: MapPin },
    { nombre: "15K+", label: "Clients satisfaits", icon: Users },
    { nombre: "12", label: "Régions couvertes", icon: TrendingUp },
    { nombre: "24/7", label: "Support client", icon: Clock }
  ];

  const features = [
    { titre: "Sécurisé", description: "Voyages certifiés et assurés", icon: Shield },
    { titre: "Qualité", description: "Service premium garanti", icon: Award },
    { titre: "Expérience", description: "15 ans d'expertise", icon: Clock },
    { titre: "Support", description: "Assistance disponible 24/7", icon: Heart }
  ];

  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section avec vrai background */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background image avec overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-orange-900/90">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600')"
            }}
          />
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-5 py-2 mb-8 animate-fade-in">
              <Star className="w-5 h-5 text-orange-400 mr-2 fill-current" />
              <span className="text-orange-200 text-sm font-semibold">Élu meilleur tour opérateur 2024</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Découvrez le Maroc
              <span className="block text-orange-400 mt-3">Autrement</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
              Explorez les merveilles du royaume chérifien avec nos voyages organisés authentiques
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/voyages"
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center shadow-2xl shadow-orange-600/40"
              >
                <Search className="w-5 h-5 mr-2" />
                Découvrir nos voyages
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Statistiques - Cards flottantes */}
      <section className="relative -mt-24 z-20 px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-2xl group-hover:from-orange-100 group-hover:to-orange-200 transition-all transform group-hover:scale-110 shadow-lg">
                      <stat.icon className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    {stat.nombre}
                  </div>
                  <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Voyages à la une */}
      <section id="voyages" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header centré */}
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3 block">NOS DESTINATIONS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Voyages à la une</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de voyages exceptionnels à travers le Maroc
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="animate-spin h-12 w-12 text-orange-600 mx-auto" />
              <p className="mt-4 text-gray-600">Chargement des voyages...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Les voyages seront bientôt disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div key={trip.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Image */}
                  {/* Image */}
                  <div className="relative h-72 bg-gray-200 overflow-hidden">
                    {getImageUrl(trip) ? (
                      <img
                        src={getImageUrl(trip)}
                        alt={trip.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    {/* Fallback Gradient if no image or error */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center ${getImageUrl(trip) ? 'hidden' : 'flex'}`}>
                      <MapPin className="w-20 h-20 text-white opacity-30" />
                    </div>

                    {trip.price && (
                      <div className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-xl">
                        {trip.price.toLocaleString()} <span className="text-sm">MAD</span>
                      </div>
                    )}

                    {trip.rating && (
                      <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-full flex items-center shadow-lg">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        <span className="text-sm font-semibold">{trip.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {trip.title}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                      <span className="text-sm font-medium">{trip.location}</span>
                    </div>

                    {trip.duration_days && (
                      <div className="flex items-center text-gray-600 mb-6 bg-gray-50 rounded-lg p-3">
                        <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                        <span className="text-sm font-medium">
                          {trip.duration_days} jour{trip.duration_days > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/voyage/${trip.id}`)}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg shadow-orange-600/30"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/voyages"
              className="inline-flex items-center from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-xl"
            >
              Voir tous les voyages
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Section Engagements */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3 block">POURQUOI NOUS CHOISIR</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Nos engagements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl group-hover:from-orange-600 group-hover:to-orange-500 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                    <feature.icon className="w-10 h-10 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.titre}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-3 block">TÉMOIGNAGES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Ce que disent nos clients</h2>
            <button
              onClick={handleOpenReviewModal}
              className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Ajouter un avis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.user?.name ? review.user.name[0] : 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.user?.name || 'Anonyme'}</p>
                      <p className="text-sm text-gray-500">Client vérifié</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Modal Ajouter Avis */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Ajouter un avis</h3>
              <button onClick={() => setShowReviewModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Voyage concerné</label>
                <select
                  required
                  className="w-full border rounded-lg p-2"
                  value={newReview.trip_id}
                  onChange={(e) => setNewReview({ ...newReview, trip_id: e.target.value })}
                >
                  <option value="">Sélectionnez un voyage</option>
                  {allTrips.map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`focus:outline-none ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Commentaire</label>
                <textarea
                  required
                  rows="4"
                  className="w-full border rounded-lg p-2"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Partagez votre expérience..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
              >
                Publier l'avis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;