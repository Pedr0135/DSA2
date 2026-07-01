import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Produto } from '../../types'
import { ProdutoCard } from './ProdutoCard'
import { Button } from '../common/Button'

interface Props {
  produtos: Produto[]
}

export function SecaoDestaques({ produtos }: Props) {
  const navigate = useNavigate()

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* Cabeçalho */}
      <div className="flex items-end justify-between mb-8">
        <div className="flex flex-col gap-1">
          <span className="text-secondary text-sm font-semibold uppercase tracking-wider">
            Mais pedidos
          </span>
          <h2 className="text-3xl font-extrabold text-brand-dark">
            Destaques da Casa
          </h2>
          <p className="text-brand-gray text-sm mt-1">
            As favoritas dos nossos clientes, preparadas com ingredientes selecionados.
          </p>
        </div>
        <Button
          variante="ghost"
          tamanho="sm"
          onClick={() => navigate('/cardapio')}
          className="hidden md:inline-flex"
        >
          Ver todos
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map(produto => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>

      {/* CTA mobile */}
      <div className="mt-8 flex justify-center md:hidden">
        <Button variante="secondary" onClick={() => navigate('/cardapio')}>
          Ver cardápio completo
          <ChevronRight size={16} />
        </Button>
      </div>
    </section>
  )
}
