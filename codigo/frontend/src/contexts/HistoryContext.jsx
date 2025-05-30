import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const HistoryContext = createContext();

// History storage key
const HISTORY_STORAGE_KEY = 'cnpj_history';
const MAX_HISTORY_ITEMS = 10;

// Provider component
export const HistoryProvider = ({ children }) => {
  // State to store history items
  const [historyItems, setHistoryItems] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistoryItems(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyItems));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }, [historyItems]);

  // Add item to history
  const addToHistory = (item) => {
    setHistoryItems(prevItems => {
      // Check if item already exists in history
      const existingItemIndex = prevItems.findIndex(
        prevItem => prevItem.cnpj === item.cnpj
      );

      // If item exists, remove it (will be re-added at the beginning)
      const filteredItems = existingItemIndex >= 0
        ? prevItems.filter((_, index) => index !== existingItemIndex)
        : prevItems;

      // Add new item at the beginning and limit to max items
      return [item, ...filteredItems].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  // Clear history
  const clearHistory = () => {
    setHistoryItems([]);
  };

  // Context value
  const contextValue = {
    historyItems,
    addToHistory,
    clearHistory
  };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to use the history context
export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};