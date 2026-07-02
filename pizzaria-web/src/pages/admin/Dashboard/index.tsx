import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'
import { formatarMoeda, labelStatus, corStatus } from '../../../utils/formatters'
import type { StatusPedido } from '../../../types'

// ── Dados fictícios ──────────────────────────────────────────────────────────

const receitaSemanal = [
  { dia: 'Seg', valor: 820 },
  { dia: 'Ter', valor: 1140 },
  { dia: 'Qua', valor: 960 },
  { dia: 'Qui', valor: 1380 },
  { dia: 'Sex', valor: 1920 },
  { dia: 'Sáb', valor: 2450 },
  { dia: 'Dom', valor: 2100 },
]

const maisVendidos = [
  { nome: 'Margherita',       qtd: 148, cor: '#DC2626' },
  { nome: 'Calabresa',        qtd: 132, cor: '#F97316' },
  { nome: 'Frango c/ Catupiry', qtd: 119, cor: '#EAB308' },
  { nome: 'Portuguesa',       qtd:  97, cor: '#22C55E' },
  { nome: 'Quatro Queijos',   qtd:  84, cor: '#3B82F6' },
]

const ultimosPedidos: {
  id: string; cliente: string; itens: string; total: number
  status: StatusPedido; hora: string
}[] = [
  { id: 'PED-001', cliente: 'João Silva',    itens: '2× Margherita (G)',        total: 89.80,  status: 'ENTREGUE',     hora: '19:42' },
  { id: 'PED-002', cliente: 'Maria Souza',   itens: '1× Calabresa (F)',         total: 54.90,  status: 'SAIU_ENTREGA', hora: '20:05' },
  { id: 'PED-003', cliente: 'Carlos Lima',   itens: '3× Portuguesa (M)',        total: 107.70, status: 'EM_PREPARO',   hora: '20:18' },
  { id: 'PED-004', cliente: 'Ana Ferreira',  itens: '1× Quatro Queijos (G)',    total: 49.90,  status: 'RECEBIDO',     hora: '20:31' },
  { id: 'PED-005', cliente: 'Pedro Alves',   itens: '2× Frango c/ Catupiry (G)',total: 99.80,  status: 'EM_PREPARO',   hora: '20:44' },
  { id: 'PED-006', cliente: 'Lucia Ramos',   itens: '1× Margherita (P)',        total: 32.90,  status: 'CANCELADO',    hora: '20:50' },
]

const KPIs = [
  {
    label:  'Pedidos hoje',
    valor:  '38',
    sub:    '+12% vs ontem',
    positivo: true,
    icone:  '📦',
    bg:     'bg-blue-50',
    cor:    'text-blue-600',
  },
  {
    label:  'Receita diária',
    valor:  formatarMoeda(2450),
    sub:    '+8% vs ontem',
    positivo: true,
    icone:  '💰',
    bg:     'bg-green-50',
    cor:    'text-green-600',
  },
  {
    label:  'Receita mensal',
    valor:  formatarMoeda(58340),
    sub:    '+5% vs mês anterior',
    positivo: true,
    icone:  '📈',
    bg:     'bg-purple-50',
    cor:    'text-purple-600',
  },
  {
    label:  'Ticket médio',
    valor:  formatarMoeda(64.50),
    sub:    '-2% vs ontem',
    positivo: false,
    icone:  '🎯',
    bg:     'bg-orange-50',
    cor:    'text-orange-600',
  },
]

// ── Tooltip customizado do gráfico de área ───────────────────────────────────
function TooltipReceita({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2 text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-primary">{formatarMoeda(payload[0].value)}</p>
    </div>
  )
}

// ── Componente ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const totalSemanal = receitaSemanal.reduce((s, d) => s + d.valor, 0)
  const maxVendido   = maisVendidos[0].qtd

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Loja aberta
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPIs.map(k => (
            <div key={k.label} className={`${k.bg} rounded-2xl p-5 flex flex-col gap-3`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{k.icone}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${k.positivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {k.sub}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{k.label}</p>
                <p className={`text-xl font-bold ${k.cor}`}>{k.valor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Receita semanal — área */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-brand-dark">Receita dos últimos 7 dias</h2>
              <span className="text-xs text-gray-400">Total: <span className="font-semibold text-brand-dark">{formatarMoeda(totalSemanal)}</span></span>
            </div>
            <p className="text-xs text-gray-400 mb-5">Valores em R$</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={receitaSemanal} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<TooltipReceita />} />
                <Area type="monotone" dataKey="valor" stroke="#DC2626" strokeWidth={2.5}
                  fill="url(#gradReceita)" dot={{ r: 4, fill: '#DC2626', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#DC2626' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mais vendidos — barras */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-brand-dark mb-1">Produtos mais vendidos</h2>
            <p className="text-xs text-gray-400 mb-5">Unidades no mês</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maisVendidos} layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="nome" width={120}
                  tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [`${v} un.`, 'Vendidos']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', fontSize: 12 }}
                />
                <Bar dataKey="qtd" radius={[0, 6, 6, 0]} barSize={18}>
                  {maisVendidos.map(entry => (
                    <Cell key={entry.nome} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking textual + últimos pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Ranking */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-brand-dark mb-4">Ranking de vendas</h2>
            <ol className="flex flex-col gap-3">
              {maisVendidos.map((p, i) => (
                <li key={p.nome} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${i === 0 ? 'bg-yellow-100 text-yellow-700'
                    : i === 1 ? 'bg-gray-100 text-gray-600'
                    : i === 2 ? 'bg-orange-100 text-orange-600'
                    :           'bg-gray-50 text-gray-400'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark truncate">{p.nome}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(p.qtd / maxVendido) * 100}%`, backgroundColor: p.cor }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-500 shrink-0">{p.qtd}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Últimos pedidos */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-brand-dark">Últimos pedidos</h2>
              <span className="text-xs text-gray-400">Hoje</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="text-left pb-3 font-medium">Pedido</th>
                    <th className="text-left pb-3 font-medium">Cliente</th>
                    <th className="text-left pb-3 font-medium hidden md:table-cell">Itens</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                    <th className="text-right pb-3 font-medium">Hora</th>
                    <th className="text-right pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ultimosPedidos.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-mono text-xs text-gray-500">{p.id}</td>
                      <td className="py-3 font-medium text-brand-dark">{p.cliente}</td>
                      <td className="py-3 text-gray-400 hidden md:table-cell text-xs">{p.itens}</td>
                      <td className="py-3 text-right font-semibold text-brand-dark">{formatarMoeda(p.total)}</td>
                      <td className="py-3 text-right text-xs text-gray-400">{p.hora}</td>
                      <td className="py-3 text-right">
                        <span className={`badge ${corStatus[p.status]}`}>
                          {labelStatus[p.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
