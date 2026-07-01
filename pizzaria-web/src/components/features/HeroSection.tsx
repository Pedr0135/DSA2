import { useNavigate } from 'react-router-dom'
import { ChevronRight, Clock, Star, Truck } from 'lucide-react'
import { Button } from '../common/Button'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[580px] flex items-center overflow-hidden bg-brand-dark">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80')",
        }}
      />
      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="max-w-xl flex flex-col gap-6">
          {/* Badge de destaque */}
          <span className="inline-flex items-center gap-2 bg-secondary/20 text-secondary border border-secondary/30 px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
            <Star size={14} fill="currentColor" />
            Mais de 10 anos de tradição
          </span>

          {/* Título e slogan */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              A pizza que você{' '}
              <span className="text-secondary">sempre quis</span>{' '}
              está aqui.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Ingredientes frescos, massa artesanal e muito amor em cada fatia.
              Entregamos em até 45 minutos na sua porta.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button tamanho="lg" onClick={() => navigate('/cardapio')}>
              Ver Cardápio
              <ChevronRight size={18} />
            </Button>
            <Button tamanho="lg" variante="secondary" onClick={() => navigate('/cardapio')}>
              Promoções
            </Button>
          </div>

          {/* Diferenciais */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { icon: <Truck size={16} />, texto: 'Entrega grátis acima de R$ 60' },
              { icon: <Clock size={16} />, texto: 'Até 45 min na sua porta' },
              { icon: <Star size={16} />, texto: '4,9 ★ de avaliação média' },
            ].map(item => (
              <span key={item.texto} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-secondary">{item.icon}</span>
                {item.texto}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
