import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Produto } from '../../types'
import { formatarMoeda } from '../../utils/formatters'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

interface Props {
  produto: Produto
}

export function ProdutoCard({ produto }: Props) {
  const navigate = useNavigate()
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
        {produto.destaque && (
          <div className="absolute top-3 left-3">
            <Badge variante="destaque" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3
            className="font-semibold text-brand-dark cursor-pointer hover:text-primary transition-colors duration-200"
            onClick={() => navigate(`/produto/${produto.id}`)}
          >
            {produto.nome}
          </h3>
          <p className="text-sm text-brand-gray mt-1 line-clamp-2">
            {produto.descricao}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-gray">A partir de</span>
            <p className="font-bold text-primary text-lg">
              {formatarMoeda(menorPreco)}
            </p>
          </div>
          <Button
            tamanho="sm"
            onClick={() => navigate(`/produto/${produto.id}`)}
            aria-label={`Ver detalhes de ${produto.nome}`}
          >
            <ShoppingCart size={16} />
            Pedir
          </Button>
        </div>
      </div>
    </div>
  )
}
