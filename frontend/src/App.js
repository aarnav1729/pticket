// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FormView from './views/FormView';
import ManagerialView from './views/ManagerialView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';
import ResolvedTicketsView from './views/ResolvedTicketsView';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<FormView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/managerial" element={<ManagerialView />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/resolved-tickets" element={<ResolvedTicketsView />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;