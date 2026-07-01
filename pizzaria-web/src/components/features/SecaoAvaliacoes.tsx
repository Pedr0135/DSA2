import { Star } from 'lucide-react'

interface Avaliacao {
  id: number
  nome: string
  avatar: string
  nota: number
  data: string
  texto: string
  pedido: string
}

const AVALIACOES: Avaliacao[] = [
  {
    id: 1,
    nome: 'Ana Paula M.',
    avatar: 'AP',
    nota: 5,
    data: 'há 2 dias',
    texto:
      'Simplesmente a melhor pizza que já comi em São Paulo! A massa é fininha e crocante do jeito certo, o recheio é generoso e chegou quentinha. Já pedi três vezes essa semana.',
    pedido: 'Margherita Grande',
  },
  {
    id: 2,
    nome: 'Ricardo S.',
    avatar: 'RS',
    nota: 5,
    data: 'há 5 dias',
    texto:
      'Entrega super rápida, menos de 40 minutos. A pizza de Frango com Catupiry estava perfeita, com bastante recheio e a borda recheada incrível. Com certeza vou pedir de novo!',
    pedido: 'Frango com Catupiry Família',
  },
  {
    id: 3,
    nome: 'Fernanda L.',
    avatar: 'FL',
    nota: 5,
    data: 'há 1 semana',
    texto:
      'Aproveitei a promoção do Combo Família e valeu muito a pena. Duas pizzas grandes, dois refrigerantes e ainda sobrou para o café da manhã. Atendimento excelente também.',
    pedido: 'Combo Família Feliz',
  },
  {
    id: 4,
    nome: 'Marcos T.',
    avatar: 'MT',
    nota: 4,
    data: 'há 1 semana',
    texto:
      'Pizza muito boa, massa artesanal que dá pra sentir a diferença. Só tirei uma estrela porque o refrigerante chegou um pouco menos gelado. Mas a pizza em si é nota 10!',
    pedido: 'Quatro Queijos Grande',
  },
  {
    id: 5,
    nome: 'Juliana C.',
    avatar: 'JC',
    nota: 5,
    data: 'há 2 semanas',
    texto:
      'Pedi a pizza de Chocolate para sobremesa e me arrependi de não ter pedido antes! Derrete na boca, o granulado crocante faz toda a diferença. Virou minha favorita.',
    pedido: 'Chocolate Média',
  },
  {
    id: 6,
    nome: 'Bruno A.',
    avatar: 'BA',
    nota: 5,
    data: 'há 2 semanas',
    texto:
      'Já testei várias pizzarias por delivery e essa é disparado a melhor. O molho de tomate é artesanal, dá pra sentir. Embalagem boa, pizza chegou intacta e quentinha.',
    pedido: 'Calabresa Grande',
  },
]

function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < nota ? 'text-secondary fill-secondary' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

export function SecaoAvaliacoes() {
  const mediaGeral = (
    AVALIACOES.reduce((acc, a) => acc + a.nota, 0) / AVALIACOES.length
  ).toFixed(1)

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-1">
          <span className="text-secondary text-sm font-semibold uppercase tracking-wider">
            O que dizem nossos clientes
          </span>
          <h2 className="text-3xl font-extrabold text-brand-dark">Avaliações Reais</h2>
          <p className="text-brand-gray text-sm mt-1">
            Mais de 2.400 avaliações verificadas no iFood e Google.
          </p>
        </div>

        {/* Nota geral */}
        <div className="flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-5 py-3 shadow-sm w-fit">
          <span className="text-4xl font-extrabold text-primary">{mediaGeral}</span>
          <div className="flex flex-col gap-1">
            <Estrelas nota={5} />
            <span className="text-xs text-brand-gray">{AVALIACOES.length} avaliações</span>
          </div>
        </div>
      </div>

      {/* Grid de avaliações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {AVALIACOES.map(av => (
          <div key={av.id} className="card p-5 flex flex-col gap-4">
            {/* Cabeçalho do card */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {av.avatar}
                </div>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{av.nome}</p>
                  <p className="text-xs text-brand-gray">{av.data}</p>
                </div>
              </div>
              <Estrelas nota={av.nota} />
            </div>

            {/* Texto */}
            <p className="text-sm text-brand-gray leading-relaxed flex-1">
              "{av.texto}"
            </p>

            {/* Pedido */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-orange-50">
              <span className="text-xs text-brand-gray">Pediu:</span>
              <span className="text-xs font-semibold text-primary">{av.pedido}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
