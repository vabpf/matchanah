import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import QRPayment from './pages/QRPayment'
import OrderSuccess from './pages/OrderSuccess'
import Account from './pages/Account'
import ProductDetail from './pages/ProductDetail'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminOrderDetail from './pages/AdminOrderDetail'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import './styles/index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart" element={<CartPage />} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/qr-payment" 
                element={
                  <ProtectedRoute>
                    <QRPayment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/order-success" 
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders/:orderId" 
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders/:orderId" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminOrderDetail />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}
export default App
