import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingCart, Trash2, Plus, Minus, Tag,
  ChevronRight, ArrowLeft, X, Check, Truck,
  ShoppingBag, MessageSquare,
} from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { Button } from '../../components/common/Button'
import { useCarrinho } from '../../hooks/useCarrinho'
import { formatarMoeda, nomeTamanho } from '../../utils/formatters'

// ─── Cupons válidos ────────────────────────────────────────────────────────────

interface Cupom {
  codigo: string
  descricao: string
  tipo: 'percentual' | 'fixo'
  valor: number
  minimoCompra: number
}

const CUPONS: Cupom[] = [
  { codigo: 'BEMVINDO10', descricao: '10% de desconto na primeira compra', tipo: 'percentual', valor: 10, minimoCompra: 0    },
  { codigo: 'PIZZA20',    descricao: '20% de desconto acima de R$ 80',    tipo: 'percentual', valor: 20, minimoCompra: 80   },
  { codigo: 'FRETE',      descricao: 'Frete grátis no pedido',            tipo: 'fixo',       valor: 8,  minimoCompra: 0    },
  { codigo: 'SABADO15',   descricao: '15% de desconto aos sábados',       tipo: 'percentual', valor: 15, minimoCompra: 50   },
]

const TAXA_ENTREGA = 8.00
const MINIMO_FRETE_GRATIS = 60.00

// ─── Componente de linha de item ───────────────────────────────────────────────

interface ItemRowProps {
  produtoId: number
  nome: string
  imagem: string
  tamanho: string
  preco: number
  quantidade: number
  onAumentar: () => void
  onDiminuir: () => void
  onRemover: () => void
}

function ItemRow({
  produtoId, nome, imagem, tamanho, preco, quantidade,
  onAumentar, onDiminuir, onRemover,
}: ItemRowProps) {
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false)

  const handleRemover = () => {
    if (confirmandoRemocao) {
      onRemover()
    } else {
      setConfirmandoRemocao(true)
      setTimeout(() => setConfirmandoRemocao(false), 3000)
    }
  }

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-orange-100 shadow-sm">
      {/* Imagem */}
      <Link to={`/produto/${produtoId}`} tabIndex={-1}>
        <img
          src={imagem}
          alt={nome}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          loading="lazy"
        />
      </Link>

      {/* Detalhes */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-brand-dark text-sm leading-tight truncate">{nome}</p>
            <p className="text-xs text-brand-gray mt-0.5">
              Tamanho: <span className="font-semibold">{nomeTamanho[tamanho] ?? tamanho}</span>
            </p>
            <p className="text-xs text-brand-gray">
              Unitário: <span className="font-semibold text-brand-dark">{formatarMoeda(preco)}</span>
            </p>
          </div>

          {/* Botão remover */}
          <button
            onClick={handleRemover}
            aria-label={confirmandoRemocao ? 'Confirmar remoção' : 'Remover item'}
            className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-all duration-200 ${
              confirmandoRemocao
                ? 'bg-red-500 text-white'
                : 'text-brand-gray hover:text-red-500 hover:bg-red-50'
            }`}
          >
            {confirmandoRemocao ? (
              <><Check size={12} /> Confirmar</>
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>

        {/* Controle de quantidade + subtotal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-cream rounded-xl border border-orange-100 p-0.5">
            <button
              onClick={onDiminuir}
              aria-label="Diminuir quantidade"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:bg-white hover:text-primary transition-all duration-200 disabled:opacity-40"
              disabled={quantidade <= 1}
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-sm font-bold text-brand-dark">
              {quantidade}
            </span>
            <button
              onClick={onAumentar}
              aria-label="Aumentar quantidade"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-gray hover:bg-white hover:text-primary transition-all duration-200"
            >
              <Plus size={13} />
            </button>
          </div>

          <p className="font-extrabold text-primary text-base">
            {formatarMoeda(preco * quantidade)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function Carrinho() {
  const navigate = useNavigate()
  const { itens, totalValor, remover, alterarQuantidade, limpar } = useCarrinho()

  const [codigoCupom, setCodigoCupom]       = useState('')
  const [cupomAplicado, setCupomAplicado]   = useState<Cupom | null>(null)
  const [erroCupom, setErroCupom]           = useState('')
  const [observacoes, setObservacoes]       = useState('')
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false)

  // ── Cálculos ──
  const subtotal = totalValor
  const freteGratis = subtotal >= MINIMO_FRETE_GRATIS || cupomAplicado?.codigo === 'FRETE'
  const taxaEntrega = freteGratis ? 0 : TAXA_ENTREGA

  const calcularDesconto = (): number => {
    if (!cupomAplicado) return 0
    if (cupomAplicado.tipo === 'percentual') return subtotal * (cupomAplicado.valor / 100)
    return cupomAplicado.valor
  }

  const desconto = calcularDesconto()
  const total    = subtotal + taxaEntrega - desconto

  // ── Cupom ──
  const aplicarCupom = () => {
    const codigo = codigoCupom.trim().toUpperCase()
    const cupom  = CUPONS.find(c => c.codigo === codigo)

    if (!cupom) {
      setErroCupom('Cupom inválido ou expirado.')
      setCupomAplicado(null)
      return
    }
    if (subtotal < cupom.minimoCompra) {
      setErroCupom(`Este cupom exige pedido mínimo de ${formatarMoeda(cupom.minimoCompra)}.`)
      setCupomAplicado(null)
      return
    }

    setCupomAplicado(cupom)
    setErroCupom('')
  }

  const removerCupom = () => {
    setCupomAplicado(null)
    setCodigoCupom('')
    setErroCupom('')
  }

  // ── Limpar carrinho ──
  const handleLimpar = () => {
    if (confirmandoLimpar) {
      limpar()
      setConfirmandoLimpar(false)
    } else {
      setConfirmandoLimpar(true)
      setTimeout(() => setConfirmandoLimpar(false), 3000)
    }
  }

  // ── Carrinho vazio ──
  if (itens.length === 0) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center">
            <ShoppingCart size={40} className="text-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-brand-dark">Seu carrinho está vazio</h1>
            <p className="text-brand-gray text-sm max-w-sm">
              Que tal explorar nosso cardápio e escolher uma pizza deliciosa?
            </p>
          </div>
          <Button tamanho="lg" onClick={() => navigate('/cardapio')}>
            <ShoppingBag size={18} />
            Ver Cardápio
          </Button>
          <Link to="/" className="text-sm text-brand-gray hover:text-primary transition-colors">
            Voltar para o início
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Cabeçalho da página */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cardapio')}
              className="flex items-center gap-1 text-xs text-brand-gray hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} /> Continuar comprando
            </button>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-extrabold text-brand-dark flex items-center gap-2">
              <ShoppingCart size={20} className="text-primary" />
              Meu Carrinho
              <span className="text-sm font-normal text-brand-gray">
                ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
              </span>
            </h1>
          </div>

          <button
            onClick={handleLimpar}
            className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              confirmandoLimpar
                ? 'bg-red-500 text-white'
                : 'text-brand-gray hover:text-red-500 hover:bg-red-50'
            }`}
          >
            {confirmandoLimpar ? <><Check size={12} /> Confirmar</> : <><X size={12} /> Limpar tudo</>}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Coluna esquerda: itens + extras ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Lista de itens */}
            <div className="flex flex-col gap-3">
              {itens.map(item => (
                <ItemRow
                  key={`${item.produto.id}-${item.tamanho.tamanho}`}
                  produtoId={item.produto.id}
                  nome={item.produto.nome}
                  imagem={item.produto.imagem}
                  tamanho={item.tamanho.tamanho}
                  preco={item.tamanho.preco}
                  quantidade={item.quantidade}
                  onAumentar={() =>
                    alterarQuantidade(item.produto.id, item.tamanho.tamanho, item.quantidade + 1)
                  }
                  onDiminuir={() => {
                    if (item.quantidade > 1)
                      alterarQuantidade(item.produto.id, item.tamanho.tamanho, item.quantidade - 1)
                  }}
                  onRemover={() => remover(item.produto.id, item.tamanho.tamanho)}
                />
              ))}
            </div>

            {/* Cupom de desconto */}
            <div className="card p-5 flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <Tag size={15} className="text-secondary" />
                Cupom de Desconto
              </h3>

              {cupomAplicado ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Check size={15} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-700">{cupomAplicado.codigo}</p>
                      <p className="text-xs text-green-600">{cupomAplicado.descricao}</p>
                    </div>
                  </div>
                  <button
                    onClick={removerCupom}
                    className="text-green-600 hover:text-red-500 transition-colors"
                    aria-label="Remover cupom"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom (ex: BEMVINDO10)"
                    value={codigoCupom}
                    onChange={e => { setCodigoCupom(e.target.value.toUpperCase()); setErroCupom('') }}
                    onKeyDown={e => e.key === 'Enter' && aplicarCupom()}
                    className="input-field flex-1 py-2 text-sm uppercase placeholder:normal-case"
                  />
                  <Button tamanho="sm" variante="secondary" onClick={aplicarCupom}>
                    Aplicar
                  </Button>
                </div>
              )}

              {erroCupom && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X size={11} /> {erroCupom}
                </p>
              )}

              {/* Dica de cupons disponíveis */}
              {!cupomAplicado && (
                <p className="text-xs text-brand-gray">
                  💡 Tente: <span className="font-semibold text-brand-dark">BEMVINDO10</span>,{' '}
                  <span className="font-semibold text-brand-dark">PIZZA20</span> ou{' '}
                  <span className="font-semibold text-brand-dark">FRETE</span>
                </p>
              )}
            </div>

            {/* Observações */}
            <div className="card p-5 flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                <MessageSquare size={15} className="text-secondary" />
                Observações do Pedido
                <span className="text-xs font-normal text-brand-gray">(opcional)</span>
              </h3>
              <textarea
                placeholder="Ex: sem cebola na Margherita, ponto da massa bem assado, campainha não funciona..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                maxLength={300}
                rows={3}
                className="input-field resize-none text-sm"
              />
              <p className="text-xs text-brand-gray text-right">
                {observacoes.length}/300 caracteres
              </p>
            </div>
          </div>

          {/* ── Coluna direita: resumo ── */}
          <div className="flex flex-col gap-4">

            {/* Progresso para frete grátis */}
            {!freteGratis && (
              <div className="card p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <Truck size={15} className="text-secondary" />
                  Frete grátis acima de {formatarMoeda(MINIMO_FRETE_GRATIS)}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / MINIMO_FRETE_GRATIS) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-brand-gray">
                  Faltam{' '}
                  <span className="font-bold text-secondary">
                    {formatarMoeda(MINIMO_FRETE_GRATIS - subtotal)}
                  </span>{' '}
                  para frete grátis
                </p>
              </div>
            )}

            {freteGratis && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-semibold text-green-700">
                <Truck size={15} />
                Você ganhou frete grátis! 🎉
              </div>
            )}

            {/* Resumo do pedido */}
            <div className="card p-5 flex flex-col gap-4">
              <h2 className="font-extrabold text-brand-dark text-base">Resumo do Pedido</h2>

              {/* Itens resumidos */}
              <div className="flex flex-col gap-2 border-b border-orange-50 pb-4">
                {itens.map(item => (
                  <div
                    key={`resumo-${item.produto.id}-${item.tamanho.tamanho}`}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-brand-gray truncate flex-1">
                      <span className="font-semibold text-brand-dark">{item.quantidade}×</span>{' '}
                      {item.produto.nome}{' '}
                      <span className="text-xs">({nomeTamanho[item.tamanho.tamanho] ?? item.tamanho.tamanho})</span>
                    </span>
                    <span className="font-semibold text-brand-dark flex-shrink-0">
                      {formatarMoeda(item.tamanho.preco * item.quantidade)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cálculos */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-brand-gray">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-dark">{formatarMoeda(subtotal)}</span>
                </div>

                <div className="flex justify-between text-brand-gray">
                  <span className="flex items-center gap-1">
                    <Truck size={12} /> Taxa de entrega
                  </span>
                  {freteGratis ? (
                    <span className="font-semibold text-green-600">Grátis</span>
                  ) : (
                    <span className="font-semibold text-brand-dark">{formatarMoeda(taxaEntrega)}</span>
                  )}
                </div>

                {cupomAplicado && desconto > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Desconto ({cupomAplicado.codigo})
                    </span>
                    <span className="font-semibold">− {formatarMoeda(desconto)}</span>
                  </div>
                )}

                <div className="flex justify-between font-extrabold text-brand-dark text-base border-t border-orange-100 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatarMoeda(total)}</span>
                </div>
              </div>

              {/* Formas de pagamento aceitas */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-orange-50">
                {['💳 Cartão', '💵 Dinheiro', '📱 Pix'].map(f => (
                  <span key={f} className="text-xs bg-cream text-brand-gray px-2.5 py-1 rounded-lg border border-orange-100">
                    {f}
                  </span>
                ))}
              </div>

              {/* Botão finalizar */}
              <Button
                tamanho="lg"
                onClick={() => navigate('/checkout')}
                className="w-full"
              >
                Finalizar Pedido
                <ChevronRight size={18} />
              </Button>

              <p className="text-xs text-brand-gray text-center leading-relaxed">
                Ao finalizar, você escolherá o endereço e a forma de pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
