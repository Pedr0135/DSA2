// Tipos centrais da aplicação

export interface Categoria {
  id: number
  nome: string
  icone: string
}

export interface ProdutoTamanho {
  tamanho: 'PEQUENA' | 'MEDIA' | 'GRANDE' | 'FAMILIA'
  preco: number
}

export interface Produto {
  id: number
  categoriaId: number
  nome: string
  descricao: string
  imagem: string
  tamanhos: ProdutoTamanho[]
  destaque: boolean
  ativo: boolean
  avaliacao?: number
  tempoPreparo?: number
  ingredientes?: string[]
}

export interface ItemCarrinho {
  produto: Produto
  tamanho: ProdutoTamanho
  quantidade: number
}

export interface EnderecoForm {
  nome: string
  telefone: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  pagamento: 'dinheiro' | 'cartao' | 'pix'
}

export type StatusPedido = 'RECEBIDO' | 'EM_PREPARO' | 'SAIU_ENTREGA' | 'ENTREGUE' | 'CANCELADO'

export interface Pedido {
  id: string
  itens: ItemCarrinho[]
  endereco: EnderecoForm
  total: number
  status: StatusPedido
  criadoEm: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: 'ADMIN' | 'ATENDENTE'
}
