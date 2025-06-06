import React from 'react';
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import './styles/globals.css'; // Optional, if you have global styles

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
