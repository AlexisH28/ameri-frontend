import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

const Loader = () => (
  <div className="text-center mt-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando la aplicación...</span>
    </div>
    <p className="mt-3 text-muted">Por favor, espera un momento...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
