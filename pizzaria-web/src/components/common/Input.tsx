import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  erro?: string
}

export function Input({ label, erro, id, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-dark">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          input-field
          ${erro ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {erro && <span className="text-xs text-red-500">{erro}</span>}
    </div>
  )
}
