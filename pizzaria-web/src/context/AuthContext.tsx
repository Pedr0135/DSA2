import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types'

// Usuário admin mockado para demonstração
const ADMIN_MOCK: Usuario = { id: 1, nome: 'Administrador', email: 'admin@pizzaria.com', perfil: 'ADMIN' }
const CREDENCIAIS = { email: 'admin@pizzaria.com', senha: 'admin123' }

interface AuthContextType {
  usuario: Usuario | null
  autenticado: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const salvo = sessionStorage.getItem('pizzaria_usuario')
      return salvo ? JSON.parse(salvo) : null
    } catch {
      return null
    }
  })

  const login = async (email: string, senha: string): Promise<boolean> => {
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 600))
    if (email === CREDENCIAIS.email && senha === CREDENCIAIS.senha) {
      setUsuario(ADMIN_MOCK)
      sessionStorage.setItem('pizzaria_usuario', JSON.stringify(ADMIN_MOCK))
      return true
    }
    return false
  }

  const logout = () => {
    setUsuario(null)
    sessionStorage.removeItem('pizzaria_usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, autenticado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
