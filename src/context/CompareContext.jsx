import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const { addToast } = useToast();
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (product) => {
    if (!product || !product.id) return;
    const exists = compareList.some(p => p.id === product.id);
    if (exists) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
      addToast(`Removed "${product.name.slice(0, 20)}..." from comparison`, 'info');
    } else {
      if (compareList.length >= 4) {
        addToast('You can compare up to 4 medical devices at a time.', 'warning');
        return;
      }
      setCompareList(prev => [...prev, product]);
      addToast(`Added "${product.name.slice(0, 20)}..." to comparison!`);
      setIsCompareModalOpen(true);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareModalOpen(false);
  };

  const isInCompare = (productId) => {
    return compareList.some(p => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        compareCount: compareList.length,
        isCompareModalOpen,
        openCompareModal: () => setIsCompareModalOpen(true),
        closeCompareModal: () => setIsCompareModalOpen(false),
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
