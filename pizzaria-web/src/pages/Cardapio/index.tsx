import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { PizzaCard } from '../../components/features/PizzaCard'
import { produtoService } from '../../services/produtoService'

const categorias = produtoService.listarCategorias()
const todosProdutos = produtoService.listarTodos()

const COR_CATEGORIA: Record<number, string> = {
  1: 'bg-orange-100 text-orange-700 border-orange-200',
  2: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  3: 'bg-green-100 text-green-700 border-green-200',
  4: 'bg-pink-100  text-pink-700  border-pink-200',
}

const COR_ATIVA: Record<number, string> = {
  1: 'bg-orange-500 text-white border-orange-500',
  2: 'bg-yellow-500 text-white border-yellow-500',
  3: 'bg-green-600  text-white border-green-600',
  4: 'bg-pink-500   text-white border-pink-500',
}

export default function Cardapio() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null)
  const [busca, setBusca] = useState('')

  const produtosFiltrados = useMemo(() => {
    return todosProdutos.filter(p => {
      const matchCategoria = categoriaAtiva === null || p.categoriaId === categoriaAtiva
      const matchBusca =
        busca.trim() === '' ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        (p.ingredientes ?? []).some(i => i.toLowerCase().includes(busca.toLowerCase()))
      return matchCategoria && matchBusca
    })
  }, [categoriaAtiva, busca])

  const limparFiltros = () => {
    setCategoriaAtiva(null)
    setBusca('')
  }

  const temFiltroAtivo = categoriaAtiva !== null || busca.trim() !== ''

  return (
    <Layout>
      {/* Hero do cardápio */}
      <section className="bg-brand-dark relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80')" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-14 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-white">
            Nosso <span className="text-secondary">Cardápio</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-lg leading-relaxed">
            {todosProdutos.length} opções de pizzas artesanais organizadas por categoria.
            Massa fermentada, ingredientes frescos e muito sabor em cada pedido.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="sticky top-16 z-40 bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">

          {/* Busca */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
            <input
              type="text"
              placeholder="Buscar por nome ou ingrediente..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-primary"
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filtro por categoria */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={14} className="text-brand-gray flex-shrink-0" />

            <button
              onClick={() => setCategoriaAtiva(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                categoriaAtiva === null
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-gray border-gray-200 hover:border-brand-dark hover:text-brand-dark'
              }`}
            >
              Todas
            </button>

            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id === categoriaAtiva ? null : cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  categoriaAtiva === cat.id
                    ? COR_ATIVA[cat.id]
                    : `${COR_CATEGORIA[cat.id]} hover:opacity-80`
                }`}
              >
                {cat.icone} {cat.nome}
              </button>
            ))}

            {temFiltroAtivo && (
              <button
                onClick={limparFiltros}
                className="text-xs text-primary hover:underline flex items-center gap-1 ml-1"
              >
                <X size={12} />
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Resultado da busca */}
        {temFiltroAtivo && (
          <p className="text-sm text-brand-gray mb-6">
            {produtosFiltrados.length === 0
              ? 'Nenhuma pizza encontrada para os filtros aplicados.'
              : `${produtosFiltrados.length} pizza${produtosFiltrados.length > 1 ? 's' : ''} encontrada${produtosFiltrados.length > 1 ? 's' : ''}`}
          </p>
        )}

        {/* Sem resultados */}
        {produtosFiltrados.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-5xl">🍕</span>
            <p className="text-brand-dark font-semibold">Nenhuma pizza encontrada</p>
            <p className="text-brand-gray text-sm">Tente outro termo ou remova os filtros.</p>
            <button onClick={limparFiltros} className="text-primary text-sm font-semibold hover:underline">
              Ver todas as pizzas
            </button>
          </div>
        )}

        {/* Listagem por categoria (sem filtro ativo) */}
        {!temFiltroAtivo && categorias.map(cat => {
          const pizzasDaCategoria = todosProdutos.filter(p => p.categoriaId === cat.id)
          if (pizzasDaCategoria.length === 0) return null

          return (
            <section key={cat.id} className="mb-14">
              {/* Cabeçalho da categoria */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{cat.icone}</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-dark">{cat.nome}</h2>
                  <p className="text-xs text-brand-gray mt-0.5">
                    {pizzasDaCategoria.length} opção{pizzasDaCategoria.length > 1 ? 'ões' : ''}
                  </p>
                </div>
                <div className="flex-1 h-px bg-orange-100 ml-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {pizzasDaCategoria.map(produto => (
                  <PizzaCard key={produto.id} produto={produto} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Listagem filtrada (com filtro ativo) */}
        {temFiltroAtivo && produtosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {produtosFiltrados.map(produto => (
              <PizzaCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
