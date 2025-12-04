import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, Star, Clock, CheckCircle, XCircle,
  ChevronLeft, ChevronRight, Share2, Heart, MessageCircle
} from 'lucide-react';

const TripDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [voyageurs, setVoyageurs] = useState(2);
  const [dateDepart, setDateDepart] = useState('');

  // Données du voyage
  const voyage = {
    id: 1,
    titre: "Découverte des Villes Impériales",
    destinations: "Marrakech, Fès, Rabat, Meknès",
    prix: 4500,
    duree: 8,
    maxPersonnes: 16,
    niveau: "Facile",
    note: 4.8,
    nombreAvis: 124,
    images: [
      "https://images.unsplash.com/photo-1548086449-9bbf39c41cd4?w=1200",
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200",
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200",
      "https://images.unsplash.com/photo-1585003044356-4676a1ad0a4c?w=1200"
    ],
    description: "Plongez au cœur de l'histoire marocaine avec ce circuit exceptionnel à travers les quatre villes impériales. Découvrez les médinas millénaires, les palais somptueux, et l'artisanat traditionnel qui font la richesse du patrimoine marocain.",
    descriptionLongue: "Ce voyage de 8 jours vous emmène dans un périple fascinant à travers l'histoire du Maroc. Vous explorerez les quatre villes impériales, chacune avec son caractère unique et ses trésors architecturaux. De Rabat, capitale moderne aux monuments historiques, à Fès la spirituelle avec sa médina médiévale, en passant par Meknès et ses portes monumentales, jusqu'à Marrakech la rouge et ses jardins enchanteurs.",
    
    programme: [
      {
        jour: 1,
        titre: "Arrivée à Casablanca - Transfert à Rabat",
        description: "Accueil à l'aéroport de Casablanca, visite de la Mosquée Hassan II, puis route vers Rabat. Installation à l'hôtel.",
        inclus: ["Transfert aéroport", "Visite guidée", "Dîner"]
      },
      {
        jour: 2,
        titre: "Rabat - La capitale",
        description: "Visite de la Tour Hassan, du Mausolée Mohammed V, et de la Kasbah des Oudayas. Déjeuner traditionnel dans la médina.",
        inclus: ["Petit-déjeuner", "Déjeuner", "Guide francophone"]
      },
      {
        jour: 3,
        titre: "Route vers Meknès",
        description: "Départ pour Meknès, visite de Bab Mansour, du mausolée Moulay Ismail, et des écuries royales. Excursion à Volubilis.",
        inclus: ["Tous les repas", "Transport", "Entrées sites"]
      },
      {
        jour: 4,
        titre: "Meknès - Fès",
        description: "Route vers Fès. Après-midi libre pour découvrir la ville à votre rythme.",
        inclus: ["Petit-déjeuner", "Dîner"]
      },
      {
        jour: 5,
        titre: "Fès - La ville spirituelle",
        description: "Journée complète de visite de Fès : médina, souks, tanneries, université Al Quaraouiyine, et palais royal.",
        inclus: ["Tous les repas", "Guide expert", "Entrées"]
      },
      {
        jour: 6,
        titre: "Route vers Marrakech",
        description: "Départ matinal pour Marrakech via Ifrane et les montagnes du Moyen Atlas. Arrivée en fin d'après-midi.",
        inclus: ["Petit-déjeuner", "Déjeuner en route"]
      },
      {
        jour: 7,
        titre: "Marrakech - La perle du Sud",
        description: "Visite complète : Jardins Majorelle, Palais Bahia, tombeaux Saadiens, souks, et place Jemaa el-Fna.",
        inclus: ["Tous les repas", "Guide", "Spectacle traditionnel"]
      },
      {
        jour: 8,
        titre: "Départ",
        description: "Temps libre selon l'horaire de vol. Transfert à l'aéroport.",
        inclus: ["Petit-déjeuner", "Transfert aéroport"]
      }
    ],

    inclus: [
      "Hébergement 7 nuits en hôtels 4* (base chambre double)",
      "Demi-pension (petits-déjeuners et dîners)",
      "Transport en minibus climatisé",
      "Guide francophone pendant tout le circuit",
      "Visites et entrées des sites mentionnés",
      "Eau minérale à bord du véhicule"
    ],

    nonInclus: [
      "Vols internationaux",
      "Assurance voyage",
      "Déjeuners",
      "Boissons",
      "Pourboires",
      "Dépenses personnelles"
    ],

    aReserver: [
      "Ce voyage nécessite une condition physique moyenne",
      "Prévoir des vêtements confortables et respectueux",
      "Un visa n'est pas nécessaire pour les ressortissants français",
      "Monnaie locale : Dirham marocain (MAD)"
    ],

    avis: [
      {
        id: 1,
        nom: "Sophie Martin",
        note: 5,
        date: "15 Oct 2024",
        commentaire: "Voyage absolument magnifique ! Notre guide était exceptionnel et très cultivé. Les hébergements étaient de qualité et bien situés. Je recommande vivement !",
        avatar: "SM"
      },
      {
        id: 2,
        nom: "Jean Dubois",
        note: 5,
        date: "8 Oct 2024",
        commentaire: "Une expérience inoubliable. L'organisation était parfaite, les visites passionnantes. Fès et Marrakech nous ont particulièrement marqués.",
        avatar: "JD"
      },
      {
        id: 3,
        nom: "Marie Lefebvre",
        note: 4,
        date: "2 Oct 2024",
        commentaire: "Très beau circuit, bien organisé. Seul bémol : les trajets en bus un peu longs, mais c'est la contrepartie pour voir autant de choses !",
        avatar: "ML"
      }
    ]
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'programme', label: 'Programme' },
    { id: 'inclusions', label: 'Inclus/Non inclus' },
    { id: 'infos', label: 'Infos pratiques' },
    { id: 'avis', label: `Avis (${voyage.nombreAvis})` }
  ];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % voyage.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + voyage.images.length) % voyage.images.length);
  };

  const calculerPrixTotal = () => {
    return (voyage.prix * voyageurs).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-orange-600 text-white p-2 rounded-lg font-bold text-xl">
                TM
              </div>
              <span className="text-xl font-bold text-gray-800">TouriMaroc</span>
            </a>
            <div className="flex items-center space-x-4">
              <a href="/voyages" className="text-gray-600 hover:text-orange-600">
                ← Retour aux voyages
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Galerie d'images */}
        <div className="mb-8">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
            <img
              src={voyage.images[selectedImage]}
              alt={voyage.titre}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation images */}
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

            {/* Actions */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Indicateurs */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {voyage.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === selectedImage ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Miniatures */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {voyage.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-20 rounded-lg overflow-hidden ${
                  index === selectedImage ? 'ring-4 ring-orange-500' : ''
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* En-tête */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {voyage.titre}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{voyage.destinations}</span>
                  </div>
                </div>
                <div className="flex items-center bg-orange-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-orange-500 fill-orange-500 mr-1" />
                  <span className="font-bold text-gray-900">{voyage.note}</span>
                  <span className="text-gray-600 ml-1">({voyage.nombreAvis})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Durée</p>
                    <p className="font-semibold">{voyage.duree} jours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Groupe</p>
                    <p className="font-semibold">Max {voyage.maxPersonnes}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Niveau</p>
                    <p className="font-semibold">{voyage.niveau}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Prix/pers</p>
                    <p className="font-semibold text-orange-600">{voyage.prix} MAD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                        activeTab === tab.id
                          ? 'border-orange-600 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Description */}
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 mb-4">{voyage.description}</p>
                    <p className="text-gray-600">{voyage.descriptionLongue}</p>
                  </div>
                )}

                {/* Programme */}
                {activeTab === 'programme' && (
                  <div className="space-y-6">
                    {voyage.programme.map((jour) => (
                      <div key={jour.jour} className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          Jour {jour.jour}: {jour.titre}
                        </h3>
                        <p className="text-gray-700 mb-3">{jour.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {jour.inclus.map((item, index) => (
                            <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inclusions */}
                {activeTab === 'inclusions' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg text-green-700 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Inclus dans le prix
                      </h3>
                      <ul className="space-y-2">
                        {voyage.inclus.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-red-700 mb-4 flex items-center">
                        <XCircle className="w-5 h-5 mr-2" />
                        Non inclus
                      </h3>
                      <ul className="space-y-2">
                        {voyage.nonInclus.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Infos pratiques */}
                {activeTab === 'infos' && (
                  <div className="space-y-4">
                    {voyage.aReserver.map((info, index) => (
                      <div key={index} className="flex items-start bg-blue-50 p-4 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{info}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Avis */}
                {activeTab === 'avis' && (
                  <div className="space-y-6">
                    {voyage.avis.map(avis => (
                      <div key={avis.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                              {avis.avatar}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{avis.nom}</p>
                              <p className="text-sm text-gray-500">{avis.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < avis.note
                                    ? 'text-orange-500 fill-orange-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{avis.commentaire}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">À partir de</p>
                <p className="text-4xl font-bold text-orange-600">
                  {voyage.prix.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-500">par personne</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={dateDepart}
                    onChange={(e) => setDateDepart(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de voyageurs
                  </label>
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                    <button
                      onClick={() => setVoyageurs(Math.max(1, voyageurs - 1))}
                      className="bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-lg transition"
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg">{voyageurs}</span>
                    <button
                      onClick={() => setVoyageurs(Math.min(voyage.maxPersonnes, voyageurs + 1))}
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
                  <span className="font-semibold">{voyage.prix.toLocaleString()} MAD</span>
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

              <button className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition mb-3">
                Réserver maintenant
              </button>
              <button className="w-full bg-white border-2 border-orange-600 text-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-50 transition">
                Demander un devis
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Réservation sécurisée • Annulation gratuite jusqu'à 48h avant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;