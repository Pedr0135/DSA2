import { useNavigate } from 'react-router-dom'
import { ChevronRight, Pizza } from 'lucide-react'
import { Button } from '../common/Button'

export function SecaoCTA() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-primary py-16">
      {/* Decoração de fundo */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-10 w-80 h-80 rounded-full bg-white/5" />

      <div className="relative max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Texto */}
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white/80">
            <Pizza size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Peça agora
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Sua pizza favorita a{' '}
            <span className="text-secondary">um clique</span> de distância.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Escolha entre mais de 10 sabores, personalize o tamanho e receba em casa
            em até 45 minutos. Entrega grátis nos pedidos acima de R$ 60.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Button
            tamanho="lg"
            variante="secondary"
            onClick={() => navigate('/cardapio')}
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            Ver Cardápio
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  )
}
