import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Loginmodal';
import Dashboard from './Dashboard';
import ProductDetail from './ProductDetails';
import OrderConfirmation from './OrderConfirmation';
import { auth } from './Firebaseconfig';
import reportWebVitals from './reportWebVitals';

// Create a context for cart functions
export const CartContext = createContext();

const Root = () => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product, quantity, color = '') => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id && item.selectedColor === color);
      if (itemInCart) {
        return prevItems.map(item =>
          item.id === product.id && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity, selectedColor: color }];
    });
    setNotification(`Added ${product.name}${color ? ` (${color})` : ''} to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const getDiscountedPrice = (product) => {
    return product.discount ? product.price * (1 - product.discount) : product.price;
  };

  const ProtectedRoute = ({ children }) => {
    const user = auth.currentUser;
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <React.StrictMode>
      <CartContext.Provider value={{ handleAddToCart, getDiscountedPrice, cartItems, setCartItems, notification }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />
            <Route
              path="/order-confirmation"
              element={<OrderConfirmation/>}
            />
          </Routes>
        </BrowserRouter>
      </CartContext.Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();