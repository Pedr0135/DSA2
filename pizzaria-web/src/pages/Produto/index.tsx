import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ShoppingCart, Star, Clock, ChevronRight,
  Check, ArrowLeft,
} from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { produtoService } from '../../services/produtoService'
import { useCarrinho } from '../../hooks/useCarrinho'
import { formatarMoeda, nomeTamanho } from '../../utils/formatters'
import type { ProdutoTamanho } from '../../types'

// ─── Dados estáticos de bordas e adicionais ───────────────────────────────────

interface OpcaoExtra {
  id: string
  nome: string
  preco: number
}

const BORDAS: OpcaoExtra[] = [
  { id: 'sem_borda',    nome: 'Sem borda recheada',  preco: 0    },
  { id: 'catupiry',     nome: 'Catupiry Original',   preco: 8.00 },
  { id: 'cheddar',      nome: 'Cheddar',             preco: 8.00 },
  { id: 'chocolate',    nome: 'Chocolate',           preco: 8.00 },
  { id: 'cream_cheese', nome: 'Cream Cheese',        preco: 9.00 },
  { id: 'requeijao',    nome: 'Requeijão Cremoso',   preco: 8.00 },
]

const ADICIONAIS: OpcaoExtra[] = [
  { id: 'extra_queijo',    nome: 'Extra Queijo',         preco: 5.00 },
  { id: 'extra_calabresa', nome: 'Extra Calabresa',      preco: 6.00 },
  { id: 'extra_frango',    nome: 'Extra Frango',         preco: 6.00 },
  { id: 'bacon',           nome: 'Bacon Crocante',       preco: 7.00 },
  { id: 'cogumelos',       nome: 'Mix de Cogumelos',     preco: 8.00 },
  { id: 'tomate_seco',     nome: 'Tomate Seco',          preco: 5.00 },
  { id: 'rucula',          nome: 'Rúcula Fresca',        preco: 4.00 },
  { id: 'pimenta',         nome: 'Pimenta Biquinho',     preco: 4.00 },
]

// ─── Avaliações fictícias por produto ─────────────────────────────────────────

interface AvaliacaoProduto {
  nome: string
  avatar: string
  nota: number
  data: string
  texto: string
}

const AVALIACOES_POOL: AvaliacaoProduto[] = [
  { nome: 'Camila R.',   avatar: 'CR', nota: 5, data: 'há 1 dia',     texto: 'Simplesmente perfeita! Chegou quentinha e o recheio estava generoso. Já é a terceira vez que peço.' },
  { nome: 'Diego M.',    avatar: 'DM', nota: 5, data: 'há 3 dias',    texto: 'Massa fininha e crocante do jeito certo. Dá pra sentir que é artesanal. Recomendo muito!' },
  { nome: 'Letícia S.',  avatar: 'LS', nota: 4, data: 'há 5 dias',    texto: 'Muito boa! Só achei que poderia ter um pouco mais de recheio, mas o sabor é incrível.' },
  { nome: 'Rafael T.',   avatar: 'RT', nota: 5, data: 'há 1 semana',  texto: 'Melhor pizza de delivery que já comi. Entrega rápida e embalagem ótima, chegou intacta.' },
  { nome: 'Priscila A.', avatar: 'PA', nota: 5, data: 'há 1 semana',  texto: 'Pedi com borda de catupiry e foi uma decisão excelente. Combinação perfeita!' },
  { nome: 'Henrique B.', avatar: 'HB', nota: 4, data: 'há 2 semanas', texto: 'Muito saborosa, ingredientes frescos. Entrega demorou um pouco mais que o esperado, mas valeu.' },
]

function getAvaliacoesProduto(produtoId: number): AvaliacaoProduto[] {
  const inicio = produtoId % AVALIACOES_POOL.length
  const qtd = 3 + (produtoId % 2)
  return Array.from({ length: qtd }, (_, i) => AVALIACOES_POOL[(inicio + i) % AVALIACOES_POOL.length])
}

// ─── Componente de estrelas ────────────────────────────────────────────────────

function Estrelas({ nota, tamanho = 14 }: { nota: number; tamanho?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={tamanho}
          className={i < Math.round(nota) ? 'text-secondary fill-secondary' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────────

export default function Produto() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { adicionar } = useCarrinho()

  const produto = produtoService.buscarPorId(Number(id))
  const categoria = produto
    ? produtoService.listarCategorias().find(c => c.id === produto.categoriaId)
    : undefined

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<ProdutoTamanho | null>(
    produto?.tamanhos[0] ?? null
  )
  const [bordaSelecionada, setBordaSelecionada] = useState<OpcaoExtra>(BORDAS[0])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<Set<string>>(new Set())
  const [adicionado, setAdicionado] = useState(false)

  useEffect(() => {
    if (!produto) navigate('/cardapio', { replace: true })
  }, [produto, navigate])

  if (!produto) return null

  const avaliacoes = getAvaliacoesProduto(produto.id)
  const mediaAvaliacoes = produto.avaliacao ?? (
    avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
  )

  const toggleAdicional = (id: string) => {
    setAdicionaisSelecionados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalAdicionais = ADICIONAIS
    .filter(a => adicionaisSelecionados.has(a.id))
    .reduce((acc, a) => acc + a.preco, 0)

  const totalItem =
    (tamanhoSelecionado?.preco ?? 0) + bordaSelecionada.preco + totalAdicionais

  const handleAdicionarCarrinho = () => {
    if (!tamanhoSelecionado) return

    // Monta tamanho enriquecido com extras no preço
    const tamanhoComExtras: ProdutoTamanho = {
      tamanho: tamanhoSelecionado.tamanho,
      preco: totalItem,
    }

    adicionar(produto, tamanhoComExtras)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-xs text-brand-gray">
          <Link to="/" className="hover:text-primary transition-colors">Início</Link>
          <ChevronRight size={12} />
          <Link to="/cardapio" className="hover:text-primary transition-colors">Cardápio</Link>
          <ChevronRight size={12} />
          {categoria && (
            <>
              <span>{categoria.icone} {categoria.nome}</span>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-brand-dark font-medium truncate">{produto.nome}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Coluna esquerda: imagem ── */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-full aspect-square object-cover"
              />
              {produto.destaque && (
                <div className="absolute top-4 left-4">
                  <Badge variante="destaque" />
                </div>
              )}
              {produto.avaliacao && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow">
                  <Star size={14} className="text-secondary fill-secondary" />
                  <span className="text-sm font-bold text-brand-dark">{produto.avaliacao.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Ingredientes */}
            {produto.ingredientes && produto.ingredientes.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-brand-dark text-sm mb-3">🧀 Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {produto.ingredientes.map(ing => (
                    <span
                      key={ing}
                      className="text-xs bg-orange-50 text-brand-gray border border-orange-100 px-3 py-1 rounded-full"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Coluna direita: configuração ── */}
          <div className="flex flex-col gap-6">

            {/* Cabeçalho do produto */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/cardapio')}
                className="flex items-center gap-1 text-xs text-brand-gray hover:text-primary transition-colors w-fit"
              >
                <ArrowLeft size={12} /> Voltar ao cardápio
              </button>

              {categoria && (
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {categoria.icone} {categoria.nome}
                </span>
              )}

              <h1 className="text-3xl font-extrabold text-brand-dark leading-tight">
                {produto.nome}
              </h1>

              <p className="text-brand-gray text-sm leading-relaxed">
                {produto.descricao}
              </p>

              {/* Meta: avaliação + tempo */}
              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-center gap-1.5">
                  <Estrelas nota={mediaAvaliacoes} tamanho={14} />
                  <span className="text-sm font-bold text-brand-dark">{mediaAvaliacoes.toFixed(1)}</span>
                  <span className="text-xs text-brand-gray">({avaliacoes.length} avaliações)</span>
                </div>
                {produto.tempoPreparo && (
                  <div className="flex items-center gap-1 text-xs text-brand-gray">
                    <Clock size={13} className="text-secondary" />
                    <span>~{produto.tempoPreparo} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seletor de tamanho */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm">Escolha o tamanho</h3>
              <div className="grid grid-cols-2 gap-2">
                {produto.tamanhos.map(t => {
                  const ativo = tamanhoSelecionado?.tamanho === t.tamanho
                  return (
                    <button
                      key={t.tamanho}
                      onClick={() => setTamanhoSelecionado(t)}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        ativo
                          ? 'border-primary bg-primary-light'
                          : 'border-gray-200 bg-white hover:border-primary/40'
                      }`}
                    >
                      <span className={`text-sm font-bold ${ativo ? 'text-primary' : 'text-brand-dark'}`}>
                        {nomeTamanho[t.tamanho]}
                      </span>
                      <span className={`text-xs mt-0.5 ${ativo ? 'text-primary' : 'text-brand-gray'}`}>
                        {formatarMoeda(t.preco)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Borda recheada */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm">Borda recheada</h3>
              <div className="grid grid-cols-2 gap-2">
                {BORDAS.map(borda => {
                  const ativo = bordaSelecionada.id === borda.id
                  return (
                    <button
                      key={borda.id}
                      onClick={() => setBordaSelecionada(borda)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        ativo
                          ? 'border-secondary bg-secondary/10'
                          : 'border-gray-200 bg-white hover:border-secondary/40'
                      }`}
                    >
                      <span className={`text-xs font-semibold ${ativo ? 'text-secondary' : 'text-brand-dark'}`}>
                        {borda.nome}
                      </span>
                      <span className={`text-xs font-bold ml-1 flex-shrink-0 ${ativo ? 'text-secondary' : 'text-brand-gray'}`}>
                        {borda.preco === 0 ? 'Grátis' : `+${formatarMoeda(borda.preco)}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Adicionais */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm">
                Adicionais
                {adicionaisSelecionados.size > 0 && (
                  <span className="ml-2 text-xs font-normal text-brand-gray">
                    ({adicionaisSelecionados.size} selecionado{adicionaisSelecionados.size > 1 ? 's' : ''})
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ADICIONAIS.map(ad => {
                  const ativo = adicionaisSelecionados.has(ad.id)
                  return (
                    <button
                      key={ad.id}
                      onClick={() => toggleAdicional(ad.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        ativo
                          ? 'border-primary bg-primary-light'
                          : 'border-gray-200 bg-white hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors ${
                          ativo ? 'bg-primary border-primary' : 'border-gray-300'
                        }`}>
                          {ativo && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-xs font-semibold truncate ${ativo ? 'text-primary' : 'text-brand-dark'}`}>
                          {ad.nome}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ml-1 flex-shrink-0 ${ativo ? 'text-primary' : 'text-brand-gray'}`}>
                        +{formatarMoeda(ad.preco)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resumo e botão */}
            <div className="card p-4 flex flex-col gap-3 sticky bottom-4">
              {/* Detalhamento do preço */}
              <div className="flex flex-col gap-1 text-sm">
                {tamanhoSelecionado && (
                  <div className="flex justify-between text-brand-gray">
                    <span>Pizza {nomeTamanho[tamanhoSelecionado.tamanho]}</span>
                    <span>{formatarMoeda(tamanhoSelecionado.preco)}</span>
                  </div>
                )}
                {bordaSelecionada.preco > 0 && (
                  <div className="flex justify-between text-brand-gray">
                    <span>Borda {bordaSelecionada.nome}</span>
                    <span>+{formatarMoeda(bordaSelecionada.preco)}</span>
                  </div>
                )}
                {ADICIONAIS.filter(a => adicionaisSelecionados.has(a.id)).map(a => (
                  <div key={a.id} className="flex justify-between text-brand-gray">
                    <span>{a.nome}</span>
                    <span>+{formatarMoeda(a.preco)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-extrabold text-brand-dark text-base border-t border-orange-100 pt-2 mt-1">
                  <span>Total</span>
                  <span className="text-primary">{formatarMoeda(totalItem)}</span>
                </div>
              </div>

              <Button
                tamanho="lg"
                onClick={handleAdicionarCarrinho}
                disabled={!tamanhoSelecionado}
                className="w-full"
              >
                {adicionado ? (
                  <>
                    <Check size={18} />
                    Adicionado ao carrinho!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Avaliações ── */}
        <section className="mt-14">
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-extrabold text-brand-dark">Avaliações</h2>
              <p className="text-xs text-brand-gray">
                {avaliacoes.length} avaliações verificadas para {produto.nome}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-orange-100 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-2xl font-extrabold text-primary">{mediaAvaliacoes.toFixed(1)}</span>
              <div className="flex flex-col gap-0.5">
                <Estrelas nota={mediaAvaliacoes} tamanho={12} />
                <span className="text-xs text-brand-gray">{avaliacoes.length} avaliações</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avaliacoes.map((av, i) => (
              <div key={i} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {av.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{av.nome}</p>
                      <p className="text-xs text-brand-gray">{av.data}</p>
                    </div>
                  </div>
                  <Estrelas nota={av.nota} tamanho={12} />
                </div>
                <p className="text-sm text-brand-gray leading-relaxed">"{av.texto}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Outras pizzas da mesma categoria ── */}
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold text-brand-dark mb-6">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produtoService
              .listarPorCategoria(produto.categoriaId)
              .filter(p => p.id !== produto.id)
              .slice(0, 4)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/produto/${p.id}`)}
                  className="card group text-left flex flex-col overflow-hidden"
                >
                  <div className="overflow-hidden">
                    <img
                      src={p.imagem}
                      alt={p.nome}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <p className="font-semibold text-brand-dark text-sm line-clamp-1">{p.nome}</p>
                    <p className="text-xs text-primary font-bold">
                      {formatarMoeda(Math.min(...p.tamanhos.map(t => t.preco)))}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </section>

        {/* Quantidade no carrinho — controle inline */}
        {adicionado && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-dark text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-bounce">
            <Check size={16} className="text-green-400" />
            Pizza adicionada ao carrinho!
            <button
              onClick={() => navigate('/carrinho')}
              className="text-secondary underline text-xs"
            >
              Ver carrinho
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
