import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ShopStorefront from './pages/ShopStorefront'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminProductNew from './pages/AdminProductNew'
import AdminProductEdit from './pages/AdminProductEdit'
import AdminOrders from './pages/AdminOrders'
import AdminCategories from './pages/AdminCategories'
import AdminRouteGuard from './components/AdminRouteGuard'
import AdminLayout from './layouts/AdminLayout'
import ShopLayout from './layouts/ShopLayout'

function App() {
  return (
    <Routes>
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:slug" element={<ShopStorefront />} />
        <Route path="/shop/:slug/product/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRouteGuard>
            <AdminLayout />
          </AdminRouteGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductNew />} />
        <Route path="products/:id/edit" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  )
}

export default App
