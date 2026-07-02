import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types'

const USUARIOS_MOCK: (Usuario & { senha: string })[] = [
  { id: 1, nome: 'Administrador',  email: 'admin@pizzaria.com',  senha: 'admin123',  perfil: 'ADMIN'     },
  { id: 2, nome: 'Maria Cliente',  email: 'maria@email.com',     senha: 'cliente123', perfil: 'ATENDENTE' },
]

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
    await new Promise(r => setTimeout(r, 800))
    const encontrado = USUARIOS_MOCK.find(u => u.email === email && u.senha === senha)
    if (encontrado) {
      const { senha: _, ...usuario } = encontrado
      setUsuario(usuario)
      sessionStorage.setItem('pizzaria_usuario', JSON.stringify(usuario))
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
