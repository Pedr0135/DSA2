import { useState, useMemo } from 'react'
import produtosData  from '../../../data/produtos.json'
import categoriasData from '../../../data/categorias.json'
import { formatarMoeda, nomeTamanho } from '../../../utils/formatters'
import type { Produto, ProdutoTamanho } from '../../../types'

// ── tipos locais ─────────────────────────────────────────────────────────────
type ProdutoLocal = Produto & { ativo: boolean }

// ── estado inicial a partir do JSON ─────────────────────────────────────────
const dadosIniciais: ProdutoLocal[] = (produtosData as ProdutoLocal[])

// ── helpers ──────────────────────────────────────────────────────────────────
function precoMin(tamanhos: ProdutoTamanho[]) {
  return Math.min(...tamanhos.map(t => t.preco))
}

function precoMax(tamanhos: ProdutoTamanho[]) {
  return Math.max(...tamanhos.map(t => t.preco))
}

function nomeCat(id: number) {
  return categoriasData.find(c => c.id === id)?.nome ?? '—'
}

function iconeCat(id: number) {
  return categoriasData.find(c => c.id === id)?.icone ?? ''
}

// ── Modal de confirmação de exclusão ─────────────────────────────────────────
function ModalExcluir({
  produto, onConfirmar, onCancelar,
}: { produto: ProdutoLocal; onConfirmar: () => void; onCancelar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl shrink-0">🗑️</span>
          <div>
            <p className="font-bold text-brand-dark">Excluir produto</p>
            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Tem certeza que deseja excluir <span className="font-semibold text-brand-dark">"{produto.nome}"</span>?
        </p>
        <div className="flex gap-3 mt-1">
          <button onClick={onCancelar}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirmar}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal de edição ───────────────────────────────────────────────────────────
function ModalEditar({
  produto, onSalvar, onCancelar,
}: { produto: ProdutoLocal; onSalvar: (p: ProdutoLocal) => void; onCancelar: () => void }) {
  const [form, setForm] = useState({ ...produto })

  function campo(key: keyof ProdutoLocal) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5 my-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-dark">Editar produto</h2>
          <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Preview da imagem */}
        {form.imagem && (
          <img src={form.imagem} alt={form.nome}
            className="w-full h-36 object-cover rounded-xl border border-gray-100" />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-gray-500">Nome</label>
            <input value={form.nome} onChange={campo('nome')}
              className="input-field" />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-gray-500">Descrição</label>
            <textarea value={form.descricao}
              onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
              rows={2} className="input-field resize-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Categoria</label>
            <select value={form.categoriaId}
              onChange={e => setForm(p => ({ ...p, categoriaId: Number(e.target.value) }))}
              className="input-field">
              {categoriasData.map(c => (
                <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Status</label>
            <select value={form.ativo ? 'ativo' : 'inativo'}
              onChange={e => setForm(p => ({ ...p, ativo: e.target.value === 'ativo' }))}
              className="input-field">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs font-medium text-gray-500">URL da imagem</label>
            <input value={form.imagem} onChange={campo('imagem')} className="input-field" />
          </div>
        </div>

        {/* Preços por tamanho */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Preços por tamanho</p>
          <div className="grid grid-cols-2 gap-2">
            {form.tamanhos.map((t, i) => (
              <div key={t.tamanho} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-xs text-gray-500 w-16 shrink-0">{nomeTamanho[t.tamanho]}</span>
                <input
                  type="number" step="0.01" value={t.preco}
                  onChange={e => {
                    const tamanhos = [...form.tamanhos]
                    tamanhos[i] = { ...t, preco: parseFloat(e.target.value) || 0 }
                    setForm(p => ({ ...p, tamanhos }))
                  }}
                  className="input-field py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onCancelar}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={() => onSalvar(form)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function CardapioAdmin() {
  const [produtos, setProdutos]         = useState<ProdutoLocal[]>(dadosIniciais)
  const [busca, setBusca]               = useState('')
  const [catFiltro, setCatFiltro]       = useState<number | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [editando, setEditando]         = useState<ProdutoLocal | null>(null)
  const [excluindo, setExcluindo]       = useState<ProdutoLocal | null>(null)

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim()
    return produtos.filter(p => {
      const buscaOk  = !q || p.nome.toLowerCase().includes(q) || nomeCat(p.categoriaId).toLowerCase().includes(q)
      const catOk    = catFiltro === null || p.categoriaId === catFiltro
      const statusOk = statusFiltro === 'todos' || (statusFiltro === 'ativo' ? p.ativo : !p.ativo)
      return buscaOk && catOk && statusOk
    })
  }, [produtos, busca, catFiltro, statusFiltro])

  function salvar(atualizado: ProdutoLocal) {
    setProdutos(prev => prev.map(p => p.id === atualizado.id ? atualizado : p))
    setEditando(null)
  }

  function excluir(id: number) {
    setProdutos(prev => prev.filter(p => p.id !== id))
    setExcluindo(null)
  }

  function toggleAtivo(id: number) {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p))
  }

  const totalAtivos   = produtos.filter(p => p.ativo).length
  const totalInativos = produtos.length - totalAtivos

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Cardápio</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {produtos.length} produtos · {totalAtivos} ativos · {totalInativos} inativos
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-hover active:scale-95 transition-all">
            <span className="text-base">＋</span> Novo produto
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Busca */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome ou categoria..."
              className="input-field pl-9"
            />
          </div>

          {/* Filtro categoria */}
          <select
            value={catFiltro ?? ''}
            onChange={e => setCatFiltro(e.target.value === '' ? null : Number(e.target.value))}
            className="input-field sm:w-48"
          >
            <option value="">Todas as categorias</option>
            {categoriasData.map(c => (
              <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>
            ))}
          </select>

          {/* Filtro status */}
          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value as typeof statusFiltro)}
            className="input-field sm:w-36"
          >
            <option value="todos">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        {/* Contagem de resultados */}
        {(busca || catFiltro !== null || statusFiltro !== 'todos') && (
          <p className="text-sm text-gray-400 mb-3">
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            {' '}
            <button onClick={() => { setBusca(''); setCatFiltro(null); setStatusFiltro('todos') }}
              className="text-primary hover:underline ml-1">
              Limpar filtros
            </button>
          </p>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-4 font-medium">Produto</th>
                  <th className="text-left px-4 py-4 font-medium hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-4 font-medium hidden lg:table-cell">Preço</th>
                  <th className="text-left px-4 py-4 font-medium hidden lg:table-cell">Tamanhos</th>
                  <th className="text-center px-4 py-4 font-medium">Status</th>
                  <th className="text-right px-5 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <p className="text-3xl mb-2">🍕</p>
                      <p className="font-medium">Nenhum produto encontrado</p>
                      <p className="text-xs mt-1">Tente ajustar os filtros de busca</p>
                    </td>
                  </tr>
                ) : filtrados.map(p => (
                  <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${!p.ativo ? 'opacity-60' : ''}`}>

                    {/* Imagem + nome */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=🍕' }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-dark truncate max-w-[160px]">{p.nome}</p>
                          {p.destaque && (
                            <span className="inline-block text-xs bg-yellow-100 text-yellow-700 font-medium px-1.5 py-0.5 rounded-full mt-0.5">
                              ⭐ Destaque
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {iconeCat(p.categoriaId)} {nomeCat(p.categoriaId)}
                      </span>
                    </td>

                    {/* Preço */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="font-semibold text-brand-dark">{formatarMoeda(precoMin(p.tamanhos))}</p>
                      {precoMin(p.tamanhos) !== precoMax(p.tamanhos) && (
                        <p className="text-xs text-gray-400">até {formatarMoeda(precoMax(p.tamanhos))}</p>
                      )}
                    </td>

                    {/* Tamanhos */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.tamanhos.map(t => (
                          <span key={t.tamanho}
                            className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                            {nomeTamanho[t.tamanho][0]}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleAtivo(p.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                          ${p.ativo ? 'bg-green-500' : 'bg-gray-300'}`}
                        title={p.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                          ${p.ativo ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <p className={`text-xs mt-1 font-medium ${p.ativo ? 'text-green-600' : 'text-gray-400'}`}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </p>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditando(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => setExcluindo(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé da tabela */}
          {filtrados.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Exibindo {filtrados.length} de {produtos.length} produtos</span>
              <span>{totalAtivos} ativos · {totalInativos} inativos</span>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {editando  && <ModalEditar   produto={editando}  onSalvar={salvar}              onCancelar={() => setEditando(null)}  />}
      {excluindo && <ModalExcluir  produto={excluindo} onConfirmar={() => excluir(excluindo.id)} onCancelar={() => setExcluindo(null)} />}
    </div>
  )
}
