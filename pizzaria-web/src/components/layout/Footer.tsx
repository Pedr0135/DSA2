import { Link } from 'react-router-dom'
import { Pizza, Phone, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Marca */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Pizza size={24} className="text-secondary" />
            <span>Pizzaria <span className="text-secondary">Online</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            As melhores pizzas da cidade, feitas com ingredientes frescos e muito amor.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
            Navegação
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { to: '/',         label: 'Início' },
              { to: '/cardapio', label: 'Cardápio' },
              { to: '/carrinho', label: 'Carrinho' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
            Contato
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Phone size={14} /> (11) 99999-0000
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} /> Rua das Pizzas, 123 — São Paulo
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} /> Seg–Dom: 18h às 23h
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Pizzaria Online. Desenvolvido como projeto TCC.
      </div>
    </footer>
  )
}
