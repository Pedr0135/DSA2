import { useState, useMemo } from 'react'
import pedidosData from '../../../data/pedidos.json'
import { formatarMoeda, labelStatus, corStatus } from '../../../utils/formatters'
import type { StatusPedido } from '../../../types'

// ── tipos locais ──────────────────────────────────────────────────────────────
interface ItemPedido {
  produto: { id: number; nome: string }
  tamanho: { tamanho: string; preco: number }
  quantidade: number
}

interface Endereco {
  nome: string; telefone: string; logradouro: string
  bairro: string; cidade: string; uf: string; cep: string
  pagamento: 'pix' | 'cartao' | 'dinheiro'
}

interface Pedido {
  id: string; itens: ItemPedido[]; endereco: Endereco
  total: number; status: StatusPedido; criadoEm: string
}

// ── dados ─────────────────────────────────────────────────────────────────────
const dadosIniciais = pedidosData as Pedido[]

// ── helpers ───────────────────────────────────────────────────────────────────
const PAGAMENTO_LABEL: Record<string, string> = { pix: 'PIX', cartao: 'Cartão', dinheiro: 'Dinheiro' }
const PAGAMENTO_ICONE: Record<string, string> = { pix: '📱', cartao: '💳',     dinheiro: '💵'       }

const STATUS_ORDEM: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_ENTREGA', 'ENTREGUE', 'CANCELADO']

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Modal de detalhes ─────────────────────────────────────────────────────────
function ModalDetalhes({
  pedido, onFechar, onAlterarStatus,
}: {
  pedido: Pedido
  onFechar: () => void
  onAlterarStatus: (id: string, status: StatusPedido) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-5 my-auto">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-mono">{pedido.id}</p>
            <h2 className="text-lg font-bold text-brand-dark">{pedido.endereco.nome}</h2>
          </div>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Status atual + alterar */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-500">Alterar status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_ORDEM.map(s => (
              <button
                key={s}
                onClick={() => onAlterarStatus(pedido.id, s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all
                  ${pedido.status === s
                    ? `${corStatus[s]} border-transparent`
                    : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
              >
                {labelStatus[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Itens */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Itens do pedido</p>
          <ul className="flex flex-col gap-1.5">
            {pedido.itens.map((item, i) => (
              <li key={i} className="flex justify-between text-sm bg-gray-50 rounded-xl px-3 py-2">
                <span className="text-brand-dark">
                  {item.quantidade}× {item.produto.nome}
                  <span className="text-gray-400 ml-1 text-xs">({item.tamanho.tamanho})</span>
                </span>
                <span className="font-medium text-brand-dark">
                  {formatarMoeda(item.tamanho.preco * item.quantidade)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-sm mt-3 px-3">
            <span className="text-gray-500">Total</span>
            <span className="text-primary">{formatarMoeda(pedido.total)}</span>
          </div>
        </div>

        {/* Entrega */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Endereço</p>
            <p className="font-medium text-brand-dark leading-snug">
              {pedido.endereco.logradouro}<br />
              {pedido.endereco.bairro} · {pedido.endereco.cidade}/{pedido.endereco.uf}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Contato</p>
            <p className="font-medium text-brand-dark">{pedido.endereco.telefone}</p>
            <p className="text-xs text-gray-400 mt-1">CEP {pedido.endereco.cep}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Pagamento</p>
            <p className="font-medium text-brand-dark">
              {PAGAMENTO_ICONE[pedido.endereco.pagamento]} {PAGAMENTO_LABEL[pedido.endereco.pagamento]}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Horário</p>
            <p className="font-medium text-brand-dark">{formatarDataHora(pedido.criadoEm)}</p>
          </div>
        </div>

        <button onClick={onFechar}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          Fechar
        </button>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function PedidosAdmin() {
  const [pedidos, setPedidos]         = useState<Pedido[]>(dadosIniciais)
  const [busca, setBusca]             = useState('')
  const [statusFiltro, setStatusFiltro] = useState<StatusPedido | 'TODOS'>('TODOS')
  const [pagFiltro, setPagFiltro]     = useState<string>('todos')
  const [detalhe, setDetalhe]         = useState<Pedido | null>(null)

  function alterarStatus(id: string, status: StatusPedido) {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    setDetalhe(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim()
    return pedidos.filter(p => {
      const buscaOk  = !q
        || p.id.toLowerCase().includes(q)
        || p.endereco.nome.toLowerCase().includes(q)
        || p.itens.some(i => i.produto.nome.toLowerCase().includes(q))
      const statusOk = statusFiltro === 'TODOS' || p.status === statusFiltro
      const pagOk    = pagFiltro === 'todos' || p.endereco.pagamento === pagFiltro
      return buscaOk && statusOk && pagOk
    })
  }, [pedidos, busca, statusFiltro, pagFiltro])

  // KPIs rápidos
  const totalReceita = pedidos.filter(p => p.status !== 'CANCELADO').reduce((s, p) => s + p.total, 0)
  const contadores   = STATUS_ORDEM.reduce((acc, s) => {
    acc[s] = pedidos.filter(p => p.status === s).length
    return acc
  }, {} as Record<StatusPedido, number>)

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {pedidos.length} pedidos · receita {formatarMoeda(totalReceita)}
            </p>
          </div>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>

        {/* Cards de status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {STATUS_ORDEM.map(s => (
            <button
              key={s}
              onClick={() => setStatusFiltro(prev => prev === s ? 'TODOS' : s)}
              className={`rounded-2xl p-4 text-left transition-all border-2
                ${statusFiltro === s ? 'border-current shadow-sm' : 'border-transparent'}
                ${corStatus[s]}`}
            >
              <p className="text-2xl font-bold">{contadores[s]}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-80">{labelStatus[s]}</p>
            </button>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nº, cliente ou produto..."
              className="input-field pl-9"
            />
          </div>

          <select
            value={statusFiltro}
            onChange={e => setStatusFiltro(e.target.value as StatusPedido | 'TODOS')}
            className="input-field sm:w-48"
          >
            <option value="TODOS">Todos os status</option>
            {STATUS_ORDEM.map(s => (
              <option key={s} value={s}>{labelStatus[s]}</option>
            ))}
          </select>

          <select
            value={pagFiltro}
            onChange={e => setPagFiltro(e.target.value)}
            className="input-field sm:w-44"
          >
            <option value="todos">Todos os pagamentos</option>
            <option value="pix">📱 PIX</option>
            <option value="cartao">💳 Cartão</option>
            <option value="dinheiro">💵 Dinheiro</option>
          </select>

          {(busca || statusFiltro !== 'TODOS' || pagFiltro !== 'todos') && (
            <button
              onClick={() => { setBusca(''); setStatusFiltro('TODOS'); setPagFiltro('todos') }}
              className="text-sm text-primary hover:underline whitespace-nowrap px-1"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Contagem */}
        {filtrados.length !== pedidos.length && (
          <p className="text-sm text-gray-400 mb-3">
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-4 font-medium">Pedido</th>
                  <th className="text-left px-4 py-4 font-medium">Cliente</th>
                  <th className="text-left px-4 py-4 font-medium hidden md:table-cell">Itens</th>
                  <th className="text-left px-4 py-4 font-medium hidden lg:table-cell">Pagamento</th>
                  <th className="text-right px-4 py-4 font-medium">Valor</th>
                  <th className="text-center px-4 py-4 font-medium hidden sm:table-cell">Horário</th>
                  <th className="text-center px-4 py-4 font-medium">Status</th>
                  <th className="text-right px-5 py-4 font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-400">
                      <p className="text-3xl mb-2">📋</p>
                      <p className="font-medium">Nenhum pedido encontrado</p>
                      <p className="text-xs mt-1">Tente ajustar os filtros</p>
                    </td>
                  </tr>
                ) : filtrados.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">

                    {/* ID */}
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-gray-500">{p.id}</span>
                    </td>

                    {/* Cliente */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-dark">{p.endereco.nome}</p>
                      <p className="text-xs text-gray-400">{p.endereco.telefone}</p>
                    </td>

                    {/* Itens resumo */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-600 truncate max-w-[200px]">
                        {p.itens.map(i => `${i.quantidade}× ${i.produto.nome}`).join(', ')}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.itens.reduce((s, i) => s + i.quantidade, 0)} item{p.itens.reduce((s, i) => s + i.quantidade, 0) !== 1 ? 's' : ''}
                      </p>
                    </td>

                    {/* Pagamento */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {PAGAMENTO_ICONE[p.endereco.pagamento]}
                        {PAGAMENTO_LABEL[p.endereco.pagamento]}
                      </span>
                    </td>

                    {/* Valor */}
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-brand-dark">{formatarMoeda(p.total)}</span>
                    </td>

                    {/* Horário */}
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{formatarHora(p.criadoEm)}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${corStatus[p.status]}`}>
                        {labelStatus[p.status]}
                      </span>
                    </td>

                    {/* Ação */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDetalhe(p)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Ver mais →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé */}
          {filtrados.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Exibindo {filtrados.length} de {pedidos.length} pedidos</span>
              <span>
                Total filtrado: <span className="font-semibold text-brand-dark">
                  {formatarMoeda(filtrados.filter(p => p.status !== 'CANCELADO').reduce((s, p) => s + p.total, 0))}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {detalhe && (
        <ModalDetalhes
          pedido={detalhe}
          onFechar={() => setDetalhe(null)}
          onAlterarStatus={alterarStatus}
        />
      )}
    </div>
  )
}
