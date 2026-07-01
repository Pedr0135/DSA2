interface Props {
  tamanho?: 'sm' | 'md' | 'lg'
  className?: string
}

const tamanhos = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

export function Spinner({ tamanho = 'md', className = '' }: Props) {
  return (
    <div className={`${tamanhos[tamanho]} border-4 border-primary-light border-t-primary rounded-full animate-spin ${className}`} />
  )
}

export function SpinnerPagina() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <Spinner tamanho="lg" />
    </div>
  )
}
