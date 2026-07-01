import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { lazy, Suspense } from 'react'

const Home         = lazy(() => import('../pages/Home'))
const Cardapio     = lazy(() => import('../pages/Cardapio'))
const Produto      = lazy(() => import('../pages/Produto'))
const Carrinho     = lazy(() => import('../pages/Carrinho'))
const Checkout     = lazy(() => import('../pages/Checkout'))
const Confirmacao  = lazy(() => import('../pages/Confirmacao'))
const Login        = lazy(() => import('../pages/Login'))
const Dashboard    = lazy(() => import('../pages/admin/Dashboard'))
const PedidosAdmin = lazy(() => import('../pages/admin/Pedidos'))
const CardapioAdmin= lazy(() => import('../pages/admin/Cardapio'))

function Carregando() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/cardapio"      element={<Cardapio />} />
        <Route path="/produto/:id"   element={<Produto />} />
        <Route path="/carrinho"      element={<Carrinho />} />
        <Route path="/checkout"      element={<Checkout />} />
        <Route path="/confirmacao/:id" element={<Confirmacao />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/pedidos" element={<PrivateRoute><PedidosAdmin /></PrivateRoute>} />
        <Route path="/admin/cardapio" element={<PrivateRoute><CardapioAdmin /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
