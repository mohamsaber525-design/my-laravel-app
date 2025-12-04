import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Shield, Award, Clock, Heart, Loader, Star, ChevronRight, Form } from 'lucide-react';

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        setIsLoading(true);
        // Remplacez cette URL par votre endpoint backend
        const response = await fetch('http://localhost:8000/api/trips');
        const data = await response.json();
        // Take only first 3 trips for featured section
        setTrips(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error('Error fetching trips:', err);
        // Keep empty array on error, don't show error on homepage
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedTrips();
  }, []);

  const stats = [
    { nombre: "500+", label: "Voyages organisés", icon: MapPin },
    { nombre: "15K+", label: "Clients satisfaits", icon: Users },
    { nombre: "12", label: "Régions couvertes", icon: MapPin },
    { nombre: "24/7", label: "Support client", icon: Clock }
  ];

  const features = [
    { titre: "Sécurisé", description: "Voyages certifiés et assurés", icon: Shield },
    { titre: "Qualité", description: "Service premium garanti", icon: Award },
    { titre: "Expérience", description: "15 ans d'expertise", icon: Clock },
    { titre: "Support", description: "Assistance disponible 24/7", icon: Heart }
  ];

  const testimonials = [
    { name: "Sarah M.", text: "Une expérience inoubliable dans le désert. L'organisation était parfaite !", rating: 5 },
    { name: "Ahmed K.", text: "Guides professionnels et itinéraires exceptionnels. Je recommande vivement.", rating: 5 },
    { name: "Marie L.", text: "Le meilleur voyage de ma vie. Tout était au-delà de mes attentes.", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Amélioré */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background avec overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1600')"
            }}
          />
        </div>

        {/* Contenu centré */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 mb-8">
                <Star className="w-4 h-4 text-orange-400 mr-2" />
                <span className="text-orange-200 text-sm font-medium">Élu meilleur tour opérateur 2024</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Découvrez le Maroc
                <span className="block text-orange-400 mt-2">Autrement</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
                Explorez les merveilles du royaume chérifien avec nos voyages organisés authentiques et personnalisés
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/voyages"
                  className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 flex items-center justify-center shadow-xl shadow-orange-600/30 no-underline"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Découvrir nos voyages
                </a>
                
                <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center">
                  Demander un devis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </div>
      </section>

      {/* Statistiques - Design amélioré */}
      <section className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center relative group">
                  <div className="flex justify-center mb-4">
                    <div className="bg-orange-50 p-4 rounded-xl group-hover:bg-orange-100 transition-colors">
                      <stat.icon className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                    {stat.nombre}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voyages à la une - Cards améliorées */}
      <section id="voyages" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Nos Destinations</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Voyages à la une</h2>
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
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Les voyages seront bientôt disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div key={trip.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Image */}
                  <div className="relative h-72 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                      <MapPin className="w-20 h-20 text-white opacity-30" />
                    </div>
                    
                    {/* Badge prix */}
                    {trip.price && (
                      <div className="absolute top-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg">
                        {trip.price.toLocaleString()} <span className="text-sm">MAD</span>
                      </div>
                    )}

                    {/* Rating - optionnel si disponible */}
                    {trip.rating && (
                      <div className="absolute top-4 left-4 bg-gray-900/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center">
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

                    <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg shadow-orange-600/30">
                      Voir les détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a 
              href="/voyages" 
              className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl no-underline"
            >
              Voir tous les voyages
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Points forts - Design moderne */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Pourquoi nous choisir</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Nos engagements</h2>
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

      {/* Témoignages - Nouvelle section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Témoignages</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Ce que disent nos clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Client vérifié</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Design moderne */}
      <section className="py-24 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
        {/* Pattern décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ne manquez aucune aventure
          </h2>
          <p className="text-xl text-orange-100 mb-10 leading-relaxed">
            Inscrivez-vous à notre newsletter et recevez nos meilleures offres et conseils de voyage
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-6 py-5 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-xl"
            />
            <button className="bg-gray-900 text-white px-10 py-5 rounded-xl font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 whitespace-nowrap shadow-xl flex items-center justify-center">
              S'inscrire
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <p className="text-orange-100 text-sm mt-6">
            🔒 Vos données sont protégées et ne seront jamais partagées
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;