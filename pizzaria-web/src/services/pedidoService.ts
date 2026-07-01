import pedidosData from '../data/pedidos.json'
import type { Pedido } from '../types'
import { gerarIdPedido } from '../utils/formatters'

const STORAGE_KEY = 'pizzaria_pedidos'

const carregarPedidos = (): Pedido[] => {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    const locais: Pedido[] = salvo ? JSON.parse(salvo) : []
    return [...(pedidosData as unknown as Pedido[]), ...locais]
  } catch {
    return pedidosData as unknown as Pedido[]
  }
}

export const pedidoService = {
  listarTodos: (): Pedido[] => carregarPedidos(),

  buscarPorId: (id: string): Pedido | undefined =>
    carregarPedidos().find(p => p.id === id),

  criar: (pedido: Omit<Pedido, 'id' | 'criadoEm'>): Pedido => {
    const novo: Pedido = {
      ...pedido,
      id: gerarIdPedido(),
      criadoEm: new Date().toISOString(),
    }
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      const locais: Pedido[] = salvo ? JSON.parse(salvo) : []
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...locais, novo]))
    } catch { /* sem localStorage disponível */ }
    return novo
  },
}
