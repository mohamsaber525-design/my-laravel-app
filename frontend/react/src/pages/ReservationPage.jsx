import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Users, MapPin, Clock,
  Building2, CheckCircle, AlertCircle, ChevronRight,
  ShieldCheck, Info, Loader
} from 'lucide-react';
import { tripsAPI, reservationsAPI, authAPI } from '../services/api';
import Navbar from '../components/Navbar';

const ReservationPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('bureau');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [voyage, setVoyage] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    trip_id: tripId,
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    date_reservation: '',
    people_count: 2,
    special_requests: '',
    total_amount: 0
  });

  // Fetch trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoadingTrip(true);
        const data = await tripsAPI.getById(tripId);
        setVoyage(data);
        setFormData(prev => ({
          ...prev,
          trip_id: data.id,
          total_amount: data.price * prev.people_count
        }));
      } catch (err) {
        console.error('Error fetching trip:', err);
        setErrors({ fetch: 'Impossible de charger les informations du voyage' });
      } finally {
        setLoadingTrip(false);
      }
    };

    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = authAPI.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const userData = authAPI.getUser();
        setUser(userData);
        if (userData) {
          setFormData(prev => ({
            ...prev,
            guest_name: userData.name || '',
            guest_email: userData.email || ''
          }));
        }
      }
    };

    if (tripId) {
      fetchTrip();
      checkAuth();
    }
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePeopleChange = (increment) => {
    if (!voyage) return;
    setFormData(prev => {
      const newCount = Math.max(1, Math.min(16, prev.people_count + increment));
      return {
        ...prev,
        people_count: newCount,
        total_amount: newCount * voyage.price
      };
    });
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.date_reservation) {
      newErrors.date_reservation = 'La date de départ est requise';
    }

    if (!formData.guest_name.trim()) newErrors.guest_name = 'Le nom est requis';
    if (!formData.guest_email) newErrors.guest_email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.guest_email)) newErrors.guest_email = 'Email invalide';
    if (!formData.guest_phone) newErrors.guest_phone = 'Le téléphone est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const reservationData = {
        trip_id: formData.trip_id,
        people_count: formData.people_count,
        date_reservation: formData.date_reservation,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,
        special_requests: formData.special_requests,
        total_amount: formData.total_amount,
        payment_method: paymentMethod
      };

      // If authenticated, use the API to create the reservation
      if (isAuthenticated) {
        await reservationsAPI.create(reservationData);
      } else {
        // For guest reservations, simulate success
        console.log('Guest reservation:', reservationData);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setStep(3);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Reservation error:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la réservation' });
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = () => {
    if (voyage?.main_image) {
      return voyage.main_image.startsWith('http')
        ? voyage.main_image
        : `http://localhost:8000/storage/${voyage.main_image}`;
    }
    return "https://images.unsplash.com/photo-1548086449-9bbf39c41cd4?w=400";
  };

  if (loadingTrip) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch || !voyage) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{errors.fetch || 'Voyage non trouvé'}</p>
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

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicateur étapes */}
        {step !== 3 && (
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'
                }`}>1</div>
              <span className={`ml-2 ${step >= 1 ? 'text-orange-600' : 'text-gray-600'} font-medium`}>
                Informations
              </span>
            </div>
            <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'
                }`}>2</div>
              <span className={`ml-2 ${step >= 2 ? 'text-orange-600' : 'text-gray-600'} font-medium`}>
                Paiement
              </span>
            </div>
            <div className={`w-24 h-1 mx-4 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'
                }`}>3</div>
              <span className={`ml-2 ${step >= 3 ? 'text-orange-600' : 'text-gray-600'} font-medium`}>
                Confirmation
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* ÉTAPE 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Votre voyage</h2>
                  <div className="flex space-x-4">
                    <img src={getImageUrl()} alt={voyage.title} className="w-24 h-24 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-lg">{voyage.title}</h3>
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />{voyage.location}
                      </p>
                      <p className="text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />{voyage.duration_days} jours
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">Détails de la réservation</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de départ *
                      </label>
                      <input
                        type="date"
                        name="date_reservation"
                        value={formData.date_reservation}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border ${errors.date_reservation ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-orange-500`}
                      />
                      {errors.date_reservation && (
                        <p className="mt-2 text-sm text-red-600">{errors.date_reservation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de voyageurs *
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => handlePeopleChange(-1)}
                          className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-lg text-xl font-bold"
                        >-</button>
                        <div className="flex-1 text-center">
                          <div className="text-3xl font-bold">{formData.people_count}</div>
                          <div className="text-sm text-gray-600">personnes</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePeopleChange(1)}
                          className="bg-gray-100 hover:bg-gray-200 w-12 h-12 rounded-lg text-xl font-bold"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">Vos informations</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="guest_name"
                          value={formData.guest_name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border ${errors.guest_name ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-orange-500`}
                          placeholder="Votre nom complet"
                        />
                      </div>
                      {errors.guest_name && <p className="mt-2 text-sm text-red-600">{errors.guest_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="guest_email"
                          value={formData.guest_email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border ${errors.guest_email ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-orange-500`}
                          placeholder="vous@exemple.com"
                        />
                      </div>
                      {errors.guest_email && <p className="mt-2 text-sm text-red-600">{errors.guest_email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="guest_phone"
                          value={formData.guest_phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border ${errors.guest_phone ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-orange-500`}
                          placeholder="+212 6XX XXX XXX"
                        />
                      </div>
                      {errors.guest_phone && <p className="mt-2 text-sm text-red-600">{errors.guest_phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Demandes spéciales (optionnel)
                      </label>
                      <textarea
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Allergies, régime alimentaire..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <p className="text-red-700">{errors.submit}</p>
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 flex items-center justify-center"
                >
                  Continuer vers le paiement
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {/* ÉTAPE 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-6">Mode de paiement</h2>

                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'bureau' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                    <input
                      type="radio"
                      value="bureau"
                      checked={paymentMethod === 'bureau'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-orange-600"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <Building2 className="w-6 h-6 text-orange-600 mr-2" />
                        <span className="font-semibold">Paiement en bureau</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Réservez maintenant et payez dans nos bureaux à Marrakech.
                      </p>
                      <div className="mt-3 bg-blue-50 rounded-lg p-3">
                        <Info className="w-5 h-5 text-blue-600 inline mr-2" />
                        <span className="text-sm text-blue-900 font-semibold">Informations:</span>
                        <ul className="list-disc list-inside mt-2 text-sm text-blue-900 space-y-1">
                          <li>Acompte de 30% à la réservation</li>
                          <li>Solde 7 jours avant le départ</li>
                          <li>Annulation gratuite 48h avant</li>
                        </ul>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <ShieldCheck className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900">Réservation sécurisée</p>
                    <p className="text-sm text-green-700 mt-1">
                      Vos informations sont protégées.
                    </p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <p className="text-red-700">{errors.submit}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border-2 border-gray-300 py-4 rounded-lg font-semibold"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="flex-1 bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        Confirmation...
                      </>
                    ) : 'Confirmer la réservation'}
                  </button>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Réservation confirmée !</h2>
                <p className="text-gray-600 mb-8">
                  Un email de confirmation vous a été envoyé à {formData.guest_email}.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-left mb-8">
                  <h3 className="font-bold text-lg mb-4">Prochaines étapes:</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      <span>Consultez votre email pour les détails</span>
                    </li>
                    <li className="flex">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      <span>Rendez-vous en bureau pour l'acompte de 30%</span>
                    </li>
                    <li className="flex">
                      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      <span>Réglez le solde 7 jours avant le départ</span>
                    </li>
                  </ol>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/voyages')}
                    className="bg-white border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50"
                  >
                    Voir d'autres voyages
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
                    >
                      Mes réservations
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Voyage</span>
                  <span className="font-semibold text-right">{voyage.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix/personne</span>
                  <span className="font-semibold">{Number(voyage.price).toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voyageurs</span>
                  <span className="font-semibold">× {formData.people_count}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">{formData.total_amount.toLocaleString()} MAD</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">✓ Annulation gratuite 48h avant</p>
                <p>✓ Guide francophone inclus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;