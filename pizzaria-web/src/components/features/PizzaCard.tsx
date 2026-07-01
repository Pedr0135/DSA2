import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Star, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { Produto } from '../../types'
import { formatarMoeda } from '../../utils/formatters'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

interface Props {
  produto: Produto
}

export function PizzaCard({ produto }: Props) {
  const navigate = useNavigate()
  const [ingredientesAbertos, setIngredientesAbertos] = useState(false)
  const menorPreco = Math.min(...produto.tamanhos.map(t => t.preco))

  return (
    <div className="card group flex flex-col">
      {/* Imagem */}
      <div
        className="relative overflow-hidden cursor-pointer"
        onClick={() => navigate(`/produto/${produto.id}`)}
      >
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges sobrepostos */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {produto.destaque && <Badge variante="destaque" />}
        </div>

        {/* Avaliação */}
        {produto.avaliacao && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            <Star size={12} className="text-secondary fill-secondary" />
            <span className="text-xs font-bold text-brand-dark">{produto.avaliacao.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Nome e descrição */}
        <div className="flex-1">
          <h3
            className="font-bold text-brand-dark cursor-pointer hover:text-primary transition-colors duration-200"
            onClick={() => navigate(`/produto/${produto.id}`)}
          >
            {produto.nome}
          </h3>
          <p className="text-sm text-brand-gray mt-1 line-clamp-2 leading-relaxed">
            {produto.descricao}
          </p>
        </div>

        {/* Tempo de preparo */}
        {produto.tempoPreparo && (
          <div className="flex items-center gap-1.5 text-xs text-brand-gray">
            <Clock size={12} className="text-secondary" />
            <span>Pronto em aprox. <strong className="text-brand-dark">{produto.tempoPreparo} min</strong></span>
          </div>
        )}

        {/* Ingredientes expansível */}
        {produto.ingredientes && produto.ingredientes.length > 0 && (
          <div className="border-t border-orange-50 pt-2">
            <button
              onClick={() => setIngredientesAbertos(v => !v)}
              className="flex items-center gap-1 text-xs text-brand-gray hover:text-primary transition-colors duration-200 w-full text-left"
            >
              {ingredientesAbertos ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {ingredientesAbertos ? 'Ocultar ingredientes' : 'Ver ingredientes'}
            </button>

            {ingredientesAbertos && (
              <div className="mt-2 flex flex-wrap gap-1">
                {produto.ingredientes.map(ing => (
                  <span
                    key={ing}
                    className="text-xs bg-orange-50 text-brand-gray px-2 py-0.5 rounded-full border border-orange-100"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preço e ação */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-brand-gray">A partir de</span>
            <p className="font-extrabold text-primary text-lg leading-tight">
              {formatarMoeda(menorPreco)}
            </p>
          </div>
          <Button
            tamanho="sm"
            onClick={() => navigate(`/produto/${produto.id}`)}
            aria-label={`Pedir ${produto.nome}`}
          >
            <ShoppingCart size={15} />
            Pedir
          </Button>
        </div>
      </div>
    </div>
  )
}
