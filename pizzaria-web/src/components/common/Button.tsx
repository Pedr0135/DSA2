import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primary' | 'secondary' | 'ghost'
  tamanho?: 'sm' | 'md' | 'lg'
  carregando?: boolean
  children: ReactNode
}

const estilos = {
  primary:   'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary-light',
  ghost:     'bg-transparent text-primary hover:bg-primary-light',
}

const tamanhos = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({
  variante = 'primary',
  tamanho = 'md',
  carregando = false,
  disabled,
  children,
  className = '',
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || carregando}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        active:scale-95 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${estilos[variante]} ${tamanhos[tamanho]} ${className}
      `}
      {...props}
    >
      {carregando && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
