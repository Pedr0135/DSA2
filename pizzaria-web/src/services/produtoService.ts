import produtosData from '../data/produtos.json'
import categoriasData from '../data/categorias.json'
import type { Produto, Categoria } from '../types'

const produtos = produtosData as Produto[]
const categorias = categoriasData as Categoria[]

export const produtoService = {
  listarTodos: (): Produto[] =>
    produtos.filter(p => p.ativo),

  listarDestaques: (): Produto[] =>
    produtos.filter(p => p.ativo && p.destaque),

  buscarPorId: (id: number): Produto | undefined =>
    produtos.find(p => p.id === id && p.ativo),

  listarPorCategoria: (categoriaId: number): Produto[] =>
    produtos.filter(p => p.ativo && p.categoriaId === categoriaId),

  listarCategorias: (): Categoria[] => categorias,
}
