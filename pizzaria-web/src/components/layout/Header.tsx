import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Pizza, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCarrinho } from '../../hooks/useCarrinho'

const links = [
  { to: '/',         label: 'Início' },
  { to: '/cardapio', label: 'Cardápio' },
]

export function Header() {
  const { totalItens } = useCarrinho()
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Pizza size={28} />
          <span>Pizzaria <span className="text-secondary">Online</span></span>
        </Link>

        {/* Navegação desktop */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-brand-gray hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {/* Carrinho */}
          <button
            onClick={() => navigate('/carrinho')}
            aria-label={`Carrinho com ${totalItens} itens`}
            className="relative p-2 text-brand-gray hover:text-primary transition-colors duration-200"
          >
            <ShoppingCart size={24} />
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItens > 9 ? '9+' : totalItens}
              </span>
            )}
          </button>

        {/* Menu mobile */}
          <button
            onClick={() => setMenuAberto(v => !v)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
            className="md:hidden p-2 text-brand-gray hover:text-primary transition-colors duration-200"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {menuAberto && (
        <nav
          aria-label="Menu mobile"
          className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3"
        >
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-2 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-brand-gray'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
