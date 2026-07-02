import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'

type Etapa = 'RECEBIDO' | 'EM_PREPARO' | 'SAIU_ENTREGA' | 'ENTREGUE'

const etapas: { key: Etapa; label: string; icone: string; tempo: string }[] = [
  { key: 'RECEBIDO',     label: 'Pedido recebido',     icone: '📋', tempo: 'Agora'       },
  { key: 'EM_PREPARO',   label: 'Em preparo',          icone: '👨‍🍳', tempo: '~10 min'    },
  { key: 'SAIU_ENTREGA', label: 'Saiu para entrega',   icone: '🛵', tempo: '~30 min'    },
  { key: 'ENTREGUE',     label: 'Entregue',            icone: '✅', tempo: '~45 min'    },
]

const STATUS_ATUAL: Etapa = 'EM_PREPARO'

const ENTREGA = {
  nome:       'João da Silva',
  telefone:   '(11) 99999-1234',
  logradouro: 'Av. Paulista, 1578 — Apto 42',
  bairro:     'Bela Vista',
  cidade:     'São Paulo — SP',
  cep:        '01310-100',
  pagamento:  'PIX',
  tempo:      '35–50 min',
}

export default function Confirmacao() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const idxAtual = etapas.findIndex(e => e.key === STATUS_ATUAL)

  return (
    <div className="min-h-screen bg-cream py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-primary">Pedido confirmado!</h1>
          <p className="text-gray-500 text-sm mt-1">Obrigado pela preferência. Já estamos preparando tudo.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
            <span>Nº do pedido:</span>
            <span>{id}</span>
          </div>
        </div>

        {/* Status atual */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <span className="text-3xl">{etapas[idxAtual].icone}</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Status atual</p>
            <p className="text-base font-bold text-brand-dark">{etapas[idxAtual].label}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs text-orange-500 font-medium">Ao vivo</span>
          </div>
        </div>

        {/* Linha do tempo */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-brand-dark mb-5 uppercase tracking-wide">Acompanhamento</h2>
          <ol className="flex flex-col gap-0">
            {etapas.map((etapa, idx) => {
              const concluido = idx < idxAtual
              const ativo     = idx === idxAtual
              const pendente  = idx > idxAtual
              const ultimo    = idx === etapas.length - 1

              return (
                <li key={etapa.key} className="flex gap-4">
                  {/* Indicador vertical */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 border-2 transition-all
                      ${concluido ? 'bg-green-500 border-green-500'
                        : ativo    ? 'bg-primary border-primary shadow-md shadow-primary/30'
                        :            'bg-gray-100 border-gray-200'}`}
                    >
                      {concluido ? '✓' : etapa.icone}
                    </div>
                    {!ultimo && (
                      <div className={`w-0.5 flex-1 my-1 ${concluido ? 'bg-green-400' : 'bg-gray-200'}`} style={{ minHeight: 28 }} />
                    )}
                  </div>

                  {/* Texto */}
                  <div className={`pb-6 ${ultimo ? 'pb-0' : ''}`}>
                    <p className={`text-sm font-semibold leading-tight
                      ${concluido ? 'text-green-600' : ativo ? 'text-primary' : 'text-gray-400'}`}>
                      {etapa.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${pendente ? 'text-gray-300' : 'text-gray-400'}`}>
                      {etapa.tempo}
                    </p>
                    {ativo && (
                      <span className="inline-block mt-1 text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                        Em andamento
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Tempo estimado */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-3xl">⏱️</span>
          <div>
            <p className="text-xs text-gray-500">Tempo estimado de entrega</p>
            <p className="text-xl font-bold text-brand-dark">{ENTREGA.tempo}</p>
          </div>
        </div>

        {/* Informações da entrega */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-brand-dark mb-4 uppercase tracking-wide">Informações da entrega</h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex gap-3">
              <span className="text-base">👤</span>
              <div>
                <p className="text-gray-400 text-xs">Destinatário</p>
                <p className="text-brand-dark font-medium">{ENTREGA.nome}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-base">📞</span>
              <div>
                <p className="text-gray-400 text-xs">Telefone</p>
                <p className="text-brand-dark font-medium">{ENTREGA.telefone}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-base">📍</span>
              <div>
                <p className="text-gray-400 text-xs">Endereço</p>
                <p className="text-brand-dark font-medium">{ENTREGA.logradouro}</p>
                <p className="text-gray-500">{ENTREGA.bairro} · {ENTREGA.cidade}</p>
                <p className="text-gray-400 text-xs">CEP {ENTREGA.cep}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-base">💳</span>
              <div>
                <p className="text-gray-400 text-xs">Pagamento</p>
                <p className="text-brand-dark font-medium">{ENTREGA.pagamento}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Ação */}
        <Button tamanho="lg" className="w-full" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>

      </div>
    </div>
  )
}
