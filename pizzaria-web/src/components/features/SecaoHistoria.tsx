import { Award, Leaf, Users } from 'lucide-react'

const DIFERENCIAIS = [
  {
    icon: <Leaf size={24} />,
    titulo: 'Ingredientes Frescos',
    descricao:
      'Selecionamos fornecedores locais para garantir que cada ingrediente chegue fresquinho à sua mesa todos os dias.',
  },
  {
    icon: <Award size={24} />,
    titulo: 'Massa Artesanal',
    descricao:
      'Nossa massa é preparada diariamente com farinha especial importada e fermentada por 24 horas para uma textura perfeita.',
  },
  {
    icon: <Users size={24} />,
    titulo: 'Família desde 2013',
    descricao:
      'Nascemos como um negócio de família e mantemos esse espírito até hoje: cada pizza é feita com o cuidado de quem cozinha para os próprios filhos.',
  },
]

export function SecaoHistoria() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-secondary text-sm font-semibold uppercase tracking-wider">
              Nossa história
            </span>
            <h2 className="text-3xl font-extrabold text-brand-dark leading-tight">
              De uma cozinha pequena para{' '}
              <span className="text-primary">milhares de sorrisos</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-brand-gray leading-relaxed text-sm">
            <p>
              Tudo começou em 2013, quando Dona Carmela e seu marido José decidiram transformar
              a receita de pizza que encantava toda a vizinhança em um negócio de verdade.
              Com um forno a lenha improvisado e muita determinação, abriram as portas da
              primeira unidade no bairro do Tatuapé, em São Paulo.
            </p>
            <p>
              Em pouco tempo, a fila na calçada virou marca registrada. A receita do sucesso
              sempre foi simples: massa fermentada artesanalmente, molho de tomate San Marzano
              e ingredientes frescos escolhidos a dedo toda manhã na feira.
            </p>
            <p>
              Hoje, mais de 10 anos depois, continuamos com a mesma filosofia — só que agora
              levamos essa experiência diretamente até a sua casa, com a mesma qualidade de
              sempre e entrega rápida.
            </p>
          </div>

          {/* Números */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { numero: '+10', label: 'Anos de história' },
              { numero: '+50k', label: 'Pizzas entregues' },
              { numero: '4,9★', label: 'Avaliação média' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-extrabold text-primary">{item.numero}</span>
                <span className="text-xs text-brand-gray">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Imagem + diferenciais */}
        <div className="flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
              alt="Cozinha da Pizzaria Online"
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
          </div>

          {/* Diferenciais */}
          <div className="flex flex-col gap-4">
            {DIFERENCIAIS.map(item => (
              <div key={item.titulo} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark text-sm">{item.titulo}</h4>
                  <p className="text-xs text-brand-gray mt-0.5 leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
