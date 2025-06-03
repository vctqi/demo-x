import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
const AppContext = createContext();

/**
 * Custom hook to use the app context
 */
export const useAppContext = () => {
  return useContext(AppContext);
};

/**
 * Provider component for the app context
 */
export const AppProvider = ({ children }) => {
  // State for the company data
  const [companyData, setCompanyData] = useState(null);
  
  // State for the risk analysis
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  
  // State for loading indicators
  const [loading, setLoading] = useState({
    companyData: false,
    riskAnalysis: false,
  });
  
  // State for errors
  const [error, setError] = useState({
    companyData: null,
    riskAnalysis: null,
  });
  
  // State for consultation history
  const [history, setHistory] = useState([]);
  
  // Session ID for the user
  const [sessionId, setSessionId] = useState('');
  
  // Initialize session ID on component mount
  useEffect(() => {
    // Check if we already have a session ID in localStorage
    const storedSessionId = localStorage.getItem('sessionId');
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // Generate a new session ID
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);
  
  // Clear all data
  const clearData = () => {
    setCompanyData(null);
    setRiskAnalysis(null);
    setError({
      companyData: null,
      riskAnalysis: null,
    });
  };
  
  // Context value
  const value = {
    companyData,
    setCompanyData,
    riskAnalysis,
    setRiskAnalysis,
    loading,
    setLoading,
    error,
    setError,
    history,
    setHistory,
    sessionId,
    clearData,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};