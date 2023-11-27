import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import ChatGpt from './components/ChatGpt'
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Link } from 'react-router-dom';
import Navbar from './components/navbar'
import Quiz from './pages/Quiz';
import React, { useState, useEffect } from 'react';
import Profile from './pages/Profile';


const PrivateRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/protected-route`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setIsAuthenticated(response.ok);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} isAuthenticated={isAuthenticated} />} />
          <Route path="/quiz" element={<PrivateRoute element={<Quiz />} isAuthenticated={isAuthenticated} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App