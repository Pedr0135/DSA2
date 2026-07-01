import { useNavigate } from 'react-router-dom'
import { Tag, Clock } from 'lucide-react'
import { Button } from '../common/Button'
import { formatarMoeda } from '../../utils/formatters'

interface Promocao {
  id: number
  titulo: string
  descricao: string
  precoOriginal: number
  precoPromocional: number
  validade: string
  imagem: string
  tag: string
}

const PROMOCOES: Promocao[] = [
  {
    id: 1,
    titulo: 'Combo Família Feliz',
    descricao: '2 pizzas grandes + 2 refrigerantes 350ml. Escolha os sabores que quiser.',
    precoOriginal: 129.80,
    precoPromocional: 99.90,
    validade: 'Válido de seg a qui',
    imagem: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80',
    tag: '🔥 Mais vendido',
  },
  {
    id: 2,
    titulo: 'Pizza + Sobremesa',
    descricao: 'Qualquer pizza média + uma pizza doce Romeu e Julieta média por um preço especial.',
    precoOriginal: 77.80,
    precoPromocional: 59.90,
    validade: 'Somente às sextas',
    imagem: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80',
    tag: '🍫 Novidade',
  },
  {
    id: 3,
    titulo: 'Terça do Calabresa',
    descricao: 'Pizza de Calabresa grande com 30% de desconto toda terça-feira. Não perca!',
    precoOriginal: 51.90,
    precoPromocional: 36.90,
    validade: 'Toda terça-feira',
    imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    tag: '⚡ Oferta relâmpago',
  },
]

export function SecaoPromocoes() {
  const navigate = useNavigate()
  const desconto = (original: number, promocional: number) =>
    Math.round(((original - promocional) / original) * 100)

  return (
    <section className="bg-cream-dark py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-1 mb-8">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Tag size={14} />
            Promoções da semana
          </span>
          <h2 className="text-3xl font-extrabold text-brand-dark">
            Ofertas Imperdíveis
          </h2>
          <p className="text-brand-gray text-sm mt-1">
            Aproveite antes que acabe. Promoções por tempo limitado.
          </p>
        </div>

        {/* Cards de promoção */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROMOCOES.map(promo => (
            <div key={promo.id} className="card group flex flex-col overflow-hidden">
              {/* Imagem */}
              <div className="relative overflow-hidden">
                <img
                  src={promo.imagem}
                  alt={promo.titulo}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Badge de desconto */}
                <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg">
                  -{desconto(promo.precoOriginal, promo.precoPromocional)}%
                </div>
                {/* Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-semibold px-2 py-1 rounded-lg">
                  {promo.tag}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                  <h3 className="font-bold text-brand-dark">{promo.titulo}</h3>
                  <p className="text-sm text-brand-gray mt-1 leading-relaxed">
                    {promo.descricao}
                  </p>
                </div>

                {/* Preços */}
                <div className="flex items-end gap-2">
                  <span className="text-xl font-extrabold text-primary">
                    {formatarMoeda(promo.precoPromocional)}
                  </span>
                  <span className="text-sm text-brand-gray line-through mb-0.5">
                    {formatarMoeda(promo.precoOriginal)}
                  </span>
                </div>

                {/* Validade */}
                <span className="flex items-center gap-1.5 text-xs text-brand-gray">
                  <Clock size={12} />
                  {promo.validade}
                </span>

                <Button tamanho="sm" onClick={() => navigate('/cardapio')}>
                  Aproveitar oferta
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
