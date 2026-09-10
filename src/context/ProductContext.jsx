import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../data/seedData';
import { api } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [categories, setCategories] = useState(SEED_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live products & categories from Backend API
  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        api.products.getAll().catch(() => null),
        api.categories.getAll().catch(() => null)
      ]);

      if (Array.isArray(prodsData) && prodsData.length > 0) {
        setProducts(prodsData);
      }
      if (Array.isArray(catsData) && catsData.length > 0) {
        setCategories(catsData);
      }
    } catch (err) {
      console.warn('Backend API connection notice (using local catalog):', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Product CRUD actions wired to backend API
  const addProduct = async (productData) => {
    const created = await api.products.create(productData);
    setProducts(prev => [created, ...prev]);
    return created;
  };

  const updateProduct = async (id, productData) => {
    const updated = await api.products.update(id, productData);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProduct = async (id) => {
    await api.products.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addCategory = async (categoryData) => {
    const created = await api.categories.create(categoryData);
    setCategories(prev => [...prev, created]);
    return created;
  };

  const deleteCategory = async (id) => {
    await api.categories.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredProducts,
        selectedProduct,
        isQuickViewOpen,
        isLoading,
        openQuickView,
        closeQuickView,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
