import { Routes, Route } from 'react-router-dom'
import AdminRouteGuard from '@/components/AdminRouteGuard'
import AdminLayout from '@/layouts/AdminLayout'
import ShopLayout from '@/layouts/ShopLayout'
import AdminCategories from '@/pages/AdminCategories'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminLogin from '@/pages/AdminLogin'
import AdminOrders from '@/pages/AdminOrders'
import AdminProductEdit from '@/pages/AdminProductEdit'
import AdminProductNew from '@/pages/AdminProductNew'
import AdminBulkImport from '@/pages/AdminBulkImport'
import AdminProducts from '@/pages/AdminProducts'
import Cart, { CartRedirect } from '@/pages/Cart'
import Home from '@/pages/Home'
import ProductDetail from '@/pages/ProductDetail'
import ShopStorefront from '@/pages/ShopStorefront'

function App() {
  return (
    <Routes>
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop/:slug" element={<ShopStorefront />} />
        <Route path="/shop/:slug/product/:productId" element={<ProductDetail />} />
        <Route path="/cart/:slug" element={<Cart />} />
        <Route path="/cart" element={<CartRedirect />} />
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
        <Route path="products/import" element={<AdminBulkImport />} />
        <Route path="products/:id/edit" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  )
}

export default App
