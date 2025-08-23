import { Routes, Route } from 'react-router-dom'
import NotificationToaster from './components/ui/NotificationToaster'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Details from './pages/Detail'
import Profile from './pages/Profile'
import BrandPage from './pages/Brand'
import ComparePage from './pages/Compare'
import FeaturesPage from './pages/FeaturesPage'
import ProductsPage from './pages/ProductPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/evs/:slug" element={<Details />} />
        <Route path="/cars/:slug" element={<BrandPage />} />
        <Route path="/cars" element={<ProductsPage/>} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
      <NotificationToaster />
    </>
  )
}
