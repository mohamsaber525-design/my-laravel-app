import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Star, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Share2, Heart, MessageCircle, Loader
} from 'lucide-react';
import { tripsAPI } from '../services/api';
import Navbar from '../components/Navbar';

  const TripDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [voyageurs, setVoyageurs] = useState(2);
    const [dateDepart, setDateDepart] = useState('');
    const [voyage, setVoyage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteForm, setQuoteForm] = useState({
      name: '',
      email: '',
      phone: '',
      message: ''
    });

    useEffect(() => {
      const fetchTrip = async () => {
        try {
          setLoading(true);
          const data = await tripsAPI.getById(id);
          setVoyage(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching trip:', err);
          setError('Impossible de charger les détails du voyage');
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchTrip();
      }
    }, [id]);

    const defaultImages = [
    ];

    const tabs = [
      { id: 'description', label: 'Description' },
      { id: 'programme', label: 'Programme' },
      { id: 'inclusions', label: 'Inclus/Non inclus' },
      { id: 'avis', label: 'Avis' }
    ];

    const nextImage = () => {
      const images = voyage?.images || defaultImages;
      setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      const images = voyage?.images || defaultImages;
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const calculerPrixTotal = () => {
      if (!voyage) return 0;
      return (voyage.price * voyageurs).toLocaleString();
    };

    const getImages = () => {
      if (voyage?.main_image) {
        const mainImage = voyage.main_image.startsWith('http')
          ? voyage.main_image
          : `http://localhost:8000/storage/${voyage.main_image}`;
        return [mainImage, ...defaultImages.slice(1)];
      }
      return defaultImages;
    };

    if (loading) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement du voyage...</p>
          </div>
        </div>
      );
    }

    if (error || !voyage) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Voyage non trouvé'}</p>
            <button
              onClick={() => navigate('/voyages')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
            >
              Retour aux voyages
            </button>
          </div>
        </div>
      );
    }

    const images = getImages();

    const handleQuoteSubmit = (e) => {
      e.preventDefault();
      // Simulate API call
      setTimeout(() => {
        alert('Votre demande de devis a été envoyée avec succès ! Nous vous contacterons bientôt.');
        setShowQuoteModal(false);
        setQuoteForm({ name: '', email: '', phone: '', message: '' });
      }, 1000);
    };

    return (
      <div className="min-h-screen w-full bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/voyages')}
              className="text-gray-600 hover:text-orange-600 flex items-center"
            >
              ← Retour aux voyages
            </button>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={voyage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-2 h-2 rounded-full transition ${index === selectedImage ? 'bg-white w-8' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 rounded-lg overflow-hidden ${index === selectedImage ? 'ring-4 ring-orange-500' : ''}`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{voyage.title}</h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{voyage.location}</span>
                    </div>
                  </div>
                  {voyage.reviews && voyage.reviews.length > 0 && (
                    <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-orange-500 fill-orange-500 mr-1" />
                      <span className="font-bold text-gray-900">
                        {(voyage.reviews.reduce((acc, r) => acc + r.rating, 0) / voyage.reviews.length).toFixed(1)}
                      </span>
                      <span className="text-gray-600 ml-1">({voyage.reviews.length})</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Durée</p>
                      <p className="font-semibold">{voyage.duration_days} jours</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Catégorie</p>
                      <p className="font-semibold">{voyage.category?.name || 'Non spécifié'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Disponible</p>
                      <p className="font-semibold">{voyage.available ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Prix/pers</p>
                      <p className="font-semibold text-orange-600">{voyage.price} MAD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="border-b border-gray-200">
                  <div className="flex overflow-x-auto">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${activeTab === tab.id ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <p className="text-lg text-gray-700 mb-4">{voyage.short_description}</p>
                      <p className="text-gray-600">{voyage.description}</p>
                    </div>
                  )}
                  {activeTab === 'programme' && (
                    <div className="space-y-6">
                      {voyage.details && voyage.details.length > 0 ? (
                        voyage.details.map((detail, index) => (
                          <div key={detail.id || index} className="border-l-4 border-orange-500 pl-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              Jour {index + 1}: {detail.title || 'Programme du jour'}
                            </h3>
                            <p className="text-gray-700">{detail.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Le programme détaillé sera communiqué après la réservation.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'inclusions' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg text-green-700 mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Inclus dans le prix
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Hébergement pendant tout le séjour</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Transport en minibus climatisé</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Guide francophone</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-red-700 mb-4 flex items-center">
                          <XCircle className="w-5 h-5 mr-2" />
                          Non inclus
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Vols internationaux</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Assurance voyage</span>
                          </li>
                          <li className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">Dépenses personnelles</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {activeTab === 'avis' && (
                    <div className="space-y-6">
                      {voyage.reviews && voyage.reviews.length > 0 ? (
                        voyage.reviews.map(avis => (
                          <div key={avis.id} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                                  {avis.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{avis.user?.name || 'Utilisateur'}</p>
                                  <p className="text-sm text-gray-500">{new Date(avis.created_at).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < avis.rating ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{avis.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Aucun avis pour ce voyage pour le moment.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">À partir de</p>
                  <p className="text-4xl font-bold text-orange-600">{Number(voyage.price).toLocaleString()} MAD</p>
                  <p className="text-sm text-gray-500">par personne</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
                    <input
                      type="date"
                      value={dateDepart}
                      onChange={(e) => setDateDepart(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de voyageurs</label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                      <button
                        onClick={() => setVoyageurs(Math.max(1, voyageurs - 1))}
                        className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-lg transition"
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg">{voyageurs}</span>
                      <button
                        onClick={() => setVoyageurs(Math.min(20, voyageurs + 1))}
                        className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-lg transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Prix unitaire</span>
                    <span className="font-semibold">{Number(voyage.price).toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Voyageurs</span>
                    <span className="font-semibold">× {voyageurs}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-orange-600">{calculerPrixTotal()} MAD</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/reservation/${voyage.id}`)}
                  className="block w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition mb-3 text-center"
                >
                  Réserver maintenant
                </button>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full bg-white border-2 border-orange-600 text-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  Demander un devis
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Réservation sécurisée • Annulation gratuite jusqu'à 48h avant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Modal */}
        {showQuoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Demander un devis</h3>
                <button onClick={() => setShowQuoteModal(false)}>
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded-lg p-2"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full border rounded-lg p-2"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    required
                    className="w-full border rounded-lg p-2"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    rows="3"
                    className="w-full border rounded-lg p-2"
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    placeholder="Précisez vos besoins..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
                >
                  Envoyer la demande
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default TripDetailPage;