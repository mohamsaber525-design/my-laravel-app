import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TripDetailPage from './pages/TripDetailPage';
import HomePage from './pages/HomePage';
import VoyagesPage from './pages/VoyagesPage';
import DashboardPage from './pages/DashboardPage';
import ReservationPage from './pages/ReservationPage';
import './App.css';



function App() {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col">
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/voyages" element={<VoyagesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reservation/:tripId" element={<ReservationPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/voyage/:id" element={<TripDetailPage />} />
          </Routes>
        </main>
        <Footer />

      </div>
    </Router>
  );
}

export default App;