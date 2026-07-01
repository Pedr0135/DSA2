import { Link } from 'react-router-dom'
import { Pizza, Phone, MapPin, Clock, Mail, Instagram, Facebook } from 'lucide-react'

const LINKS_NAVEGACAO = [
  { to: '/',           label: 'Início' },
  { to: '/cardapio',   label: 'Cardápio' },
  { to: '/carrinho',   label: 'Carrinho' },
  { to: '/checkout',   label: 'Finalizar Pedido' },
]

const LINKS_CATEGORIAS = [
  { to: '/cardapio', label: '🍕 Pizzas Salgadas' },
  { to: '/cardapio', label: '🍫 Pizzas Doces' },
  { to: '/cardapio', label: '🥤 Bebidas' },
  { to: '/cardapio', label: '🍰 Sobremesas' },
]

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Corpo principal */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Coluna 1 — Marca */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Pizza size={24} className="text-secondary" />
            <span>Pizzaria <span className="text-secondary">Online</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Desde 2013 levando sabor e tradição até a sua mesa. Massa artesanal,
            ingredientes frescos e muito amor em cada pizza.
          </p>
          {/* Redes sociais */}
          <div className="flex gap-3 mt-1">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-secondary transition-colors duration-200 flex items-center justify-center"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-secondary transition-colors duration-200 flex items-center justify-center"
            >
              <Facebook size={16} />
            </a>
          </div>
        </div>

        {/* Coluna 2 — Navegação */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
            Navegação
          </h3>
          <div className="flex flex-col gap-2">
            {LINKS_NAVEGACAO.map(link => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mt-3">
            Categorias
          </h3>
          <div className="flex flex-col gap-2">
            {LINKS_CATEGORIAS.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Coluna 3 — Contato */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
            Contato
          </h3>
          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <a
              href="tel:+551199990000"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Phone size={14} className="flex-shrink-0" />
              (11) 99999-0000
            </a>
            <a
              href="mailto:contato@pizzariaonline.com.br"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Mail size={14} className="flex-shrink-0" />
              contato@pizzariaonline.com.br
            </a>
            <span className="flex items-start gap-2">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" />
              Rua das Pizzas, 123 — Tatuapé<br />São Paulo — SP, 03310-000
            </span>
          </div>
        </div>

        {/* Coluna 4 — Horários e Pagamento */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400">
            Horário de Funcionamento
          </h3>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Clock size={14} className="flex-shrink-0" />
              Seg a Qui: 18h às 23h
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="flex-shrink-0" />
              Sex e Sáb: 18h às 00h
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="flex-shrink-0" />
              Domingo: 17h às 23h
            </span>
          </div>

          <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mt-3">
            Formas de Pagamento
          </h3>
          <div className="flex flex-wrap gap-2">
            {['💳 Cartão', '💵 Dinheiro', '📱 Pix'].map(forma => (
              <span
                key={forma}
                className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-lg"
              >
                {forma}
              </span>
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-500 leading-relaxed">
            Entrega grátis em pedidos acima de R$ 60,00 dentro da área de cobertura.
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Pizzaria Online. Todos os direitos reservados.</span>
          <span>Desenvolvido como projeto acadêmico — DSA2</span>
        </div>
      </div>
    </footer>
  )
}
