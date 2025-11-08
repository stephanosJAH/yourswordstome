import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, signInWithGoogle, signOut } from '../services/authService';
import { getUserData } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {

        setUser(firebaseUser);
        // Cargar datos adicionales de Firestore
        try {
          const data = await getUserData(firebaseUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        console.log('Refrescando datos del usuario...');
        const data = await getUserData(user.uid);
        console.log('Datos actualizados:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error al refrescar datos:', error);
      }
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
