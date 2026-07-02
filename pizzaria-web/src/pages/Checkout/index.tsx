import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrinho } from '../../context/CarrinhoContext'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { formatarMoeda, nomeTamanho, gerarIdPedido } from '../../utils/formatters'

type Pagamento = 'pix' | 'cartao' | 'dinheiro'

interface Endereco {
  nome: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

const enderecoInicial: Endereco = {
  nome: 'João da Silva',
  telefone: '(11) 99999-1234',
  cep: '01310-100',
  logradouro: 'Av. Paulista',
  numero: '1578',
  complemento: 'Apto 42',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  uf: 'SP',
}

const TAXA_ENTREGA = 8.0
const TEMPO_ENTREGA = '35–50 min'

export default function Checkout() {
  const navigate = useNavigate()
  const { itens, totalValor, limpar } = useCarrinho()

  const [endereco, setEndereco] = useState<Endereco>(enderecoInicial)
  const [pagamento, setPagamento] = useState<Pagamento>('pix')
  const [troco, setTroco] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erros, setErros] = useState<Partial<Endereco>>({})

  const total = totalValor + TAXA_ENTREGA

  function validar() {
    const e: Partial<Endereco> = {}
    if (!endereco.nome.trim()) e.nome = 'Nome obrigatório'
    if (!endereco.telefone.trim()) e.telefone = 'Telefone obrigatório'
    if (!endereco.cep.trim()) e.cep = 'CEP obrigatório'
    if (!endereco.logradouro.trim()) e.logradouro = 'Logradouro obrigatório'
    if (!endereco.numero.trim()) e.numero = 'Número obrigatório'
    if (!endereco.bairro.trim()) e.bairro = 'Bairro obrigatório'
    if (!endereco.cidade.trim()) e.cidade = 'Cidade obrigatória'
    if (!endereco.uf.trim()) e.uf = 'UF obrigatória'
    setErros(e)
    return Object.keys(e).length === 0
  }

  function campo(field: keyof Endereco) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndereco(prev => ({ ...prev, [field]: e.target.value }))
      setErros(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleConfirmar() {
    if (!validar()) return
    if (itens.length === 0) return
    setEnviando(true)
    await new Promise(r => setTimeout(r, 1200))
    const id = gerarIdPedido()
    limpar()
    navigate(`/confirmacao/${id}`)
  }

  if (itens.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-brand-dark">Seu carrinho está vazio.</p>
        <Button onClick={() => navigate('/cardapio')}>Ver Cardápio</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna esquerda */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Endereço */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome completo" value={endereco.nome} onChange={campo('nome')} erro={erros.nome} />
                <Input label="Telefone" value={endereco.telefone} onChange={campo('telefone')} erro={erros.telefone} />
                <Input label="CEP" value={endereco.cep} onChange={campo('cep')} erro={erros.cep} maxLength={9} />
                <Input label="Número" value={endereco.numero} onChange={campo('numero')} erro={erros.numero} />
                <div className="sm:col-span-2">
                  <Input label="Logradouro" value={endereco.logradouro} onChange={campo('logradouro')} erro={erros.logradouro} />
                </div>
                <Input label="Complemento (opcional)" value={endereco.complemento} onChange={campo('complemento')} />
                <Input label="Bairro" value={endereco.bairro} onChange={campo('bairro')} erro={erros.bairro} />
                <Input label="Cidade" value={endereco.cidade} onChange={campo('cidade')} erro={erros.cidade} />
                <Input label="UF" value={endereco.uf} onChange={campo('uf')} erro={erros.uf} maxLength={2} />
              </div>
            </section>

            {/* Pagamento */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                Forma de Pagamento
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {(['pix', 'cartao', 'dinheiro'] as Pagamento[]).map(op => (
                  <button
                    key={op}
                    onClick={() => setPagamento(op)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${pagamento === op ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-primary/40'}`}
                  >
                    <span className="text-2xl">
                      {op === 'pix' ? '📱' : op === 'cartao' ? '💳' : '💵'}
                    </span>
                    <span className="text-sm font-semibold text-brand-dark capitalize">
                      {op === 'cartao' ? 'Cartão' : op === 'pix' ? 'PIX' : 'Dinheiro'}
                    </span>
                  </button>
                ))}
              </div>

              {pagamento === 'pix' && (
                <div className="flex flex-col items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-28 h-28 bg-white border-2 border-green-400 rounded-lg flex items-center justify-center">
                    <span className="text-5xl">🟩</span>
                  </div>
                  <p className="text-sm text-green-800 font-medium">Chave PIX: <span className="font-bold">pizzaria@exemplo.com.br</span></p>
                  <p className="text-xs text-green-700">O QR Code será gerado após confirmar o pedido.</p>
                </div>
              )}

              {pagamento === 'cartao' && (
                <div className="flex flex-col gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Input label="Número do cartão" placeholder="0000 0000 0000 0000" maxLength={19} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Validade" placeholder="MM/AA" maxLength={5} />
                    <Input label="CVV" placeholder="123" maxLength={3} />
                  </div>
                  <Input label="Nome no cartão" placeholder="JOÃO DA SILVA" />
                  <div className="flex gap-4">
                    {['Crédito', 'Débito'].map(tipo => (
                      <label key={tipo} className="flex items-center gap-2 cursor-pointer text-sm text-brand-dark">
                        <input type="radio" name="tipoCartao" defaultChecked={tipo === 'Crédito'} className="accent-primary" />
                        {tipo}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {pagamento === 'dinheiro' && (
                <div className="flex flex-col gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-800">Precisa de troco?</p>
                  <Input
                    label="Troco para quanto? (opcional)"
                    placeholder="Ex: R$ 100,00"
                    value={troco}
                    onChange={e => setTroco(e.target.value)}
                  />
                  {troco && (
                    <p className="text-sm text-yellow-700">
                      Troco: <span className="font-bold">
                        {formatarMoeda(Math.max(0, parseFloat(troco.replace(',', '.')) - total))}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Coluna direita — Resumo */}
          <div className="flex flex-col gap-4">
            <section className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
                Resumo do Pedido
              </h2>

              <ul className="flex flex-col gap-3 mb-4">
                {itens.map(item => (
                  <li key={`${item.produto.id}-${item.tamanho.tamanho}`} className="flex justify-between text-sm">
                    <span className="text-brand-dark">
                      {item.quantidade}× {item.produto.nome}
                      <span className="text-gray-400 ml-1">({nomeTamanho[item.tamanho.tamanho]})</span>
                    </span>
                    <span className="font-medium text-brand-dark">
                      {formatarMoeda(item.tamanho.preco * item.quantidade)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatarMoeda(totalValor)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxa de entrega</span>
                  <span>{formatarMoeda(TAXA_ENTREGA)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-brand-dark mt-1">
                  <span>Total</span>
                  <span className="text-primary">{formatarMoeda(total)}</span>
                </div>
              </div>

              {/* Estimativa de entrega */}
              <div className="mt-4 flex items-center gap-3 bg-orange-50 rounded-xl p-3 border border-orange-100">
                <span className="text-2xl">🛵</span>
                <div>
                  <p className="text-xs text-gray-500">Estimativa de entrega</p>
                  <p className="text-sm font-bold text-brand-dark">{TEMPO_ENTREGA}</p>
                </div>
              </div>

              <Button
                className="w-full mt-5"
                tamanho="lg"
                carregando={enviando}
                onClick={handleConfirmar}
              >
                Confirmar Pedido
              </Button>

              <button
                onClick={() => navigate('/carrinho')}
                className="w-full mt-2 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                ← Voltar ao carrinho
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
