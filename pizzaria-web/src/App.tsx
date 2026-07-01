import { BrowserRouter } from 'react-router-dom'
import { CarrinhoProvider } from './context/CarrinhoContext'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <AppRoutes />
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
