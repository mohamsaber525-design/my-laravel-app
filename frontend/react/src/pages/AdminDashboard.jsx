import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, MapPin, Users, Calendar, Plus, Edit, Trash2,
    Search, Filter, CheckCircle, XCircle, Clock, DollarSign,
    Eye, Mail, Phone, Settings, LogOut, Menu, X, ChevronDown,
    TrendingUp, Package
} from 'lucide-react';
import { statsAPI, voyagesAPI, usersAPI, reservationsAPI, authAPI, categoriesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [showAddTripModal, setShowAddTripModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [statsData, setStatsData] = useState({
        total_trips: 0,
        total_users: 0,
        total_reservations: 0,
        total_revenue: 0
    });
    const [trips, setTrips] = useState([]);
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchStats = async () => {
        try {
            const stats = await statsAPI.getDashboardStats();
            setStatsData(stats);
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [stats, tripsData, usersData, reservationsData, categoriesData] = await Promise.all([
                    statsAPI.getDashboardStats(),
                    voyagesAPI.getAll(),
                    usersAPI.getAll(),
                    reservationsAPI.getAll(),
                    categoriesAPI.getAll()
                ]);

                console.log('Dashboard Data:', { stats, tripsData, usersData, reservationsData, categoriesData });

                setStatsData(stats || { total_trips: 0, total_users: 0, total_reservations: 0, total_revenue: 0 });
                setTrips(tripsData || []);
                setUsers(usersData || []);
                setReservations(reservationsData || []);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        await authAPI.logout();
        navigate('/login');
    };

    const statsDisplay = [
        { label: 'Total Voyages', value: statsData?.total_trips || 0, icon: MapPin, color: 'blue', change: '' },
        { label: 'Utilisateurs', value: statsData?.total_users || 0, icon: Users, color: 'green', change: '' },
        { label: 'Réservations', value: statsData?.total_reservations || 0, icon: Calendar, color: 'orange', change: '' },
        { label: 'Revenus', value: `${statsData?.total_revenue || 0} MAD`, icon: DollarSign, color: 'purple', change: '' }
    ];

    const [newTrip, setNewTrip] = useState({
        title: '',
        slug: '',
        location: '',
        price: '',
        duration_days: '',
        short_description: '',
        description: '',
        available: true,
        category_id: '',
        main_image: null
    });

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'confirmed': case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (statut) => {
        switch (statut) {
            case 'confirmed': return 'Confirmée';
            case 'pending': return 'En attente';
            case 'cancelled': return 'Annulée';
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            default: return statut;
        }
    };

    const handleAddTrip = async () => {
        try {
            const formData = new FormData();
            formData.append('title', newTrip.title);

            // Generate slug from title if not provided
            const slug = newTrip.slug || newTrip.title.toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/-+/g, '-'); // Remove duplicate -

            formData.append('slug', slug);
            formData.append('location', newTrip.location);
            formData.append('price', newTrip.price);
            formData.append('duration_days', newTrip.duration_days);
            formData.append('short_description', newTrip.short_description);
            formData.append('description', newTrip.description);
            formData.append('available', newTrip.available ? '1' : '0');
            formData.append('category_id', newTrip.category_id);

            if (newTrip.main_image) {
                formData.append('main_image', newTrip.main_image);
            }

            await voyagesAPI.create(formData);
            const updatedTrips = await voyagesAPI.getAll();
            setTrips(updatedTrips);
            fetchStats();
            setShowAddTripModal(false);
            setNewTrip({
                title: '', slug: '', location: '', price: '', duration_days: '',
                short_description: '', description: '', available: true, category_id: '', main_image: null
            });
        } catch (error) {
            console.error('Error adding trip:', error);
            alert('Erreur lors de l\'ajout du voyage: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteTrip = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) {
            try {
                await voyagesAPI.delete(id);
                setTrips(trips.filter(t => t.id !== id));
                fetchStats();
            } catch (error) {
                console.error('Error deleting trip:', error);
                alert('Erreur lors de la suppression du voyage');
            }
        }
    };

    const handleUpdateReservationStatus = async (id, newStatus) => {
        try {
            await reservationsAPI.updateStatus(id, newStatus);
            setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 flex-shrink-0 overflow-hidden`}>
                <div className="h-screen px-3 py-4 overflow-y-auto w-64">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center space-x-2">
                            <div className="bg-orange-600 text-white p-2 rounded-lg font-bold">TM</div>
                            <span className="text-xl font-bold text-white">Admin</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Vue d'ensemble
                        </button>

                        <button
                            onClick={() => setActiveTab('trips')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'trips' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <MapPin className="w-5 h-5 mr-3" />
                            Voyages
                        </button>

                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'users' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <Users className="w-5 h-5 mr-3" />
                            Utilisateurs
                        </button>

                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'reservations' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <Calendar className="w-5 h-5 mr-3" />
                            Réservations
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <Settings className="w-5 h-5 mr-3" />
                            Paramètres
                        </button>
                    </nav>

                    <div className="absolute bottom-4 left-0 right-0 px-3">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {activeTab === 'overview' && 'Vue d\'ensemble'}
                                    {activeTab === 'trips' && 'Gestion des Voyages'}
                                    {activeTab === 'users' && 'Gestion des Utilisateurs'}
                                    {activeTab === 'reservations' && 'Gestion des Réservations'}
                                    {activeTab === 'settings' && 'Paramètres'}
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a href="/" className="text-gray-600 hover:text-orange-600">
                                    Voir le site
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto">
                    {/* VUE D'ENSEMBLE */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {statsDisplay.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                                        </div>
                                        <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Réservations récentes */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Réservations récentes</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">Client</th>
                                                <th className="text-left py-3 px-4">Voyage</th>
                                                <th className="text-left py-3 px-4">Date</th>
                                                <th className="text-left py-3 px-4">Montant</th>
                                                <th className="text-left py-3 px-4">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.slice(0, 5).map(res => (
                                                <tr key={res.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">{res.user?.name || res.client}</td>
                                                    <td className="py-3 px-4">{res.trip?.title || res.voyage}</td>
                                                    <td className="py-3 px-4">{res.created_at ? new Date(res.created_at).toLocaleDateString() : res.date}</td>
                                                    <td className="py-3 px-4 font-semibold">{res.total_amount || res.total_price || res.montant} MAD</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(res.status || res.statut)}`}>
                                                            {getStatusLabel(res.status || res.statut)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GESTION VOYAGES */}
                    {activeTab === 'trips' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un voyage..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowAddTripModal(true)}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 flex items-center"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Ajouter un voyage
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Voyage</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Destination</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Prix</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Durée</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Réservations</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Statut</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trips.map(trip => (
                                                <tr key={trip.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-4 px-6 font-semibold">{trip.title || trip.titre}</td>
                                                    <td className="py-4 px-6">{trip.destination || trip.location}</td>
                                                    <td className="py-4 px-6 whitespace-nowrap">{trip.price || trip.prix} MAD</td>
                                                    <td className="py-4 px-6 whitespace-nowrap">{trip.duration_days || trip.duration || trip.duree} jours</td>
                                                    <td className="py-4 px-6 text-center">{trip.reservations_count || trip.reservations || 0}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(trip.status || trip.statut || (trip.available ? 'active' : 'inactive'))}`}>
                                                            {getStatusLabel(trip.status || trip.statut || (trip.available ? 'Active' : 'Inactive'))}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTrip(trip.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GESTION UTILISATEURS */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un utilisateur..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Nom</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Email</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Téléphone</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Rôle</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Réservations</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Statut</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-4 px-6 font-semibold">{user.name || user.nom}</td>
                                                    <td className="py-4 px-6">{user.email}</td>
                                                    <td className="py-4 px-6">{user.phone || '-'}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {user.role === 'admin' ? 'Admin' : 'Client'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">{user.reservations_count || user.reservations || 0}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(user.status || user.statut || 'active')}`}>
                                                            {getStatusLabel(user.status || user.statut || 'active')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex space-x-2">
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            <button className="text-orange-600 hover:text-orange-800">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GESTION RÉSERVATIONS */}
                    {activeTab === 'reservations' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher une réservation..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                                    <option>Tous les statuts</option>
                                    <option>Confirmées</option>
                                    <option>En attente</option>
                                    <option>Annulées</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">ID</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Client</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Voyage</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Date</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Personnes</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Montant</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Statut</th>
                                                <th className="text-left py-4 px-6 whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reservations.map(res => (
                                                <tr key={res.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-4 px-6">#{res.id}</td>
                                                    <td className="py-4 px-6 font-semibold">{res.user?.name || res.client}</td>
                                                    <td className="py-4 px-6">{res.trip?.title || res.voyage}</td>
                                                    <td className="py-4 px-6 whitespace-nowrap">{res.created_at ? new Date(res.created_at).toLocaleDateString() : res.date}</td>
                                                    <td className="py-4 px-6 text-center">{res.guests || res.personnes}</td>
                                                    <td className="py-4 px-6 font-semibold whitespace-nowrap">{res.total_amount || res.total_price || res.montant} MAD</td>
                                                    <td className="py-4 px-6">
                                                        <select
                                                            value={res.status || res.statut}
                                                            onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(res.status || res.statut)}`}
                                                        >
                                                            <option value="pending">En attente</option>
                                                            <option value="confirmed">Confirmée</option>
                                                            <option value="cancelled">Annulée</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Ajouter Voyage */}
            {showAddTripModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Ajouter un voyage</h2>
                            <button onClick={() => setShowAddTripModal(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Titre *</label>
                                <input
                                    type="text"
                                    value={newTrip.title}
                                    onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Ex: Circuit des Villes Impériales"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Slug (optionnel)</label>
                                <input
                                    type="text"
                                    value={newTrip.slug}
                                    onChange={(e) => setNewTrip({ ...newTrip, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="ex: circuit-villes-imperiales"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Catégorie *</label>
                                    <select
                                        value={newTrip.category_id}
                                        onChange={(e) => setNewTrip({ ...newTrip, category_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Destination *</label>
                                    <input
                                        type="text"
                                        value={newTrip.location}
                                        onChange={(e) => setNewTrip({ ...newTrip, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ex: Marrakech"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Prix (MAD) *</label>
                                    <input
                                        type="number"
                                        value={newTrip.price}
                                        onChange={(e) => setNewTrip({ ...newTrip, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="4500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Durée (jours) *</label>
                                    <input
                                        type="number"
                                        value={newTrip.duration_days}
                                        onChange={(e) => setNewTrip({ ...newTrip, duration_days: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="8"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Image principale *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewTrip({ ...newTrip, main_image: e.target.files[0] })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description courte</label>
                                <textarea
                                    value={newTrip.short_description}
                                    onChange={(e) => setNewTrip({ ...newTrip, short_description: e.target.value })}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Résumé du voyage..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description complète</label>
                                <textarea
                                    value={newTrip.description}
                                    onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Détails du voyage..."
                                ></textarea>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={newTrip.available}
                                    onChange={(e) => setNewTrip({ ...newTrip, available: e.target.checked })}
                                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="available" className="text-sm font-medium text-gray-700">Voyage disponible</label>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={() => setShowAddTripModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleAddTrip}
                                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;