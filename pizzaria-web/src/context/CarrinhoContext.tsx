import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { ItemCarrinho, Produto, ProdutoTamanho } from '../types'

interface CarrinhoState {
  itens: ItemCarrinho[]
}

type CarrinhoAction =
  | { type: 'ADICIONAR'; produto: Produto; tamanho: ProdutoTamanho }
  | { type: 'REMOVER'; produtoId: number; tamanho: string }
  | { type: 'ALTERAR_QTD'; produtoId: number; tamanho: string; quantidade: number }
  | { type: 'LIMPAR' }

const STORAGE_KEY = 'pizzaria_carrinho'

function reducer(state: CarrinhoState, action: CarrinhoAction): CarrinhoState {
  switch (action.type) {
    case 'ADICIONAR': {
      const existe = state.itens.find(
        i => i.produto.id === action.produto.id && i.tamanho.tamanho === action.tamanho.tamanho
      )
      const itens = existe
        ? state.itens.map(i =>
            i.produto.id === action.produto.id && i.tamanho.tamanho === action.tamanho.tamanho
              ? { ...i, quantidade: i.quantidade + 1 }
              : i
          )
        : [...state.itens, { produto: action.produto, tamanho: action.tamanho, quantidade: 1 }]
      return { itens }
    }
    case 'REMOVER':
      return { itens: state.itens.filter(
        i => !(i.produto.id === action.produtoId && i.tamanho.tamanho === action.tamanho)
      )}
    case 'ALTERAR_QTD':
      return { itens: state.itens.map(i =>
        i.produto.id === action.produtoId && i.tamanho.tamanho === action.tamanho
          ? { ...i, quantidade: action.quantidade }
          : i
      )}
    case 'LIMPAR':
      return { itens: [] }
    default:
      return state
  }
}

interface CarrinhoContextType {
  itens: ItemCarrinho[]
  totalItens: number
  totalValor: number
  adicionar: (produto: Produto, tamanho: ProdutoTamanho) => void
  remover: (produtoId: number, tamanho: string) => void
  alterarQuantidade: (produtoId: number, tamanho: string, quantidade: number) => void
  limpar: () => void
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { itens: [] }, () => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      return salvo ? JSON.parse(salvo) : { itens: [] }
    } catch {
      return { itens: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const totalItens = state.itens.reduce((acc, i) => acc + i.quantidade, 0)
  const totalValor = state.itens.reduce((acc, i) => acc + i.tamanho.preco * i.quantidade, 0)

  return (
    <CarrinhoContext.Provider value={{
      itens: state.itens,
      totalItens,
      totalValor,
      adicionar: (produto, tamanho) => dispatch({ type: 'ADICIONAR', produto, tamanho }),
      remover: (produtoId, tamanho) => dispatch({ type: 'REMOVER', produtoId, tamanho }),
      alterarQuantidade: (produtoId, tamanho, quantidade) =>
        dispatch({ type: 'ALTERAR_QTD', produtoId, tamanho, quantidade }),
      limpar: () => dispatch({ type: 'LIMPAR' }),
    }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinho = (): CarrinhoContextType => {
  const ctx = useContext(CarrinhoContext)
  if (!ctx) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider')
  return ctx
}
