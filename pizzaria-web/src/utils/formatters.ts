import type { StatusPedido } from '../types'

export const formatarMoeda = (valor: number): string =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatarData = (data: string): string =>
  new Date(data).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export const nomeTamanho: Record<string, string> = {
  PEQUENA: 'Pequena',
  MEDIA:   'Média',
  GRANDE:  'Grande',
  FAMILIA: 'Família',
}

export const labelStatus: Record<StatusPedido, string> = {
  RECEBIDO:     'Recebido',
  EM_PREPARO:   'Em Preparo',
  SAIU_ENTREGA: 'Saiu para Entrega',
  ENTREGUE:     'Entregue',
  CANCELADO:    'Cancelado',
}

export const corStatus: Record<StatusPedido, string> = {
  RECEBIDO:     'bg-yellow-100 text-yellow-800',
  EM_PREPARO:   'bg-orange-100 text-orange-800',
  SAIU_ENTREGA: 'bg-blue-100 text-blue-800',
  ENTREGUE:     'bg-green-100 text-green-800',
  CANCELADO:    'bg-red-100 text-red-800',
}

export const gerarIdPedido = (): string =>
  `PED-${Date.now().toString().slice(-6)}`
