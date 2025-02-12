//finance-manager\client\src\App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';

function App() {
  return (

    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-transaction"
            element={
              <PrivateRoute>
                <AddTransaction />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-transaction/:id"
            element={
              <PrivateRoute>
                <EditTransaction />
              </PrivateRoute>
            }
            />
        </Routes>
      </div>
    </Router>

  );
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

export default App;