import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserData } from '../utils/api';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const checkAuth = async () => {
    try {
      const userData = await fetchUserData();
      console.log('Fetched user data:', userData); 
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching user data:', err); 
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const refreshAuth = () => {
    checkAuth();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);