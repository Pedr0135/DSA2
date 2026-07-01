import type { ReactNode } from 'react'
import type { StatusPedido } from '../../types'
import { corStatus, labelStatus } from '../../utils/formatters'

interface Props {
  children?: ReactNode
  variante?: 'status' | 'categoria' | 'destaque'
  status?: StatusPedido
  className?: string
}

export function Badge({ children, variante = 'categoria', status, className = '' }: Props) {
  if (variante === 'status' && status) {
    return (
      <span className={`badge ${corStatus[status]} ${className}`}>
        {labelStatus[status]}
      </span>
    )
  }

  if (variante === 'destaque') {
    return (
      <span className={`badge bg-secondary text-white ${className}`}>
        ⭐ Destaque
      </span>
    )
  }

  return (
    <span className={`badge bg-primary-light text-primary ${className}`}>
      {children}
    </span>
  )
}
