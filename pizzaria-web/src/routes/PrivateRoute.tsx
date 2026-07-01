import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth()
  return autenticado ? <>{children}</> : <Navigate to="/login" replace />
}
