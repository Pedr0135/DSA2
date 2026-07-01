import { Layout } from '../../components/layout/Layout'
import { HeroSection } from '../../components/features/HeroSection'
import { SecaoDestaques } from '../../components/features/SecaoDestaques'
import { SecaoHistoria } from '../../components/features/SecaoHistoria'
import { SecaoPromocoes } from '../../components/features/SecaoPromocoes'
import { SecaoAvaliacoes } from '../../components/features/SecaoAvaliacoes'
import { SecaoCTA } from '../../components/features/SecaoCTA'
import { produtoService } from '../../services/produtoService'

const destaques = produtoService.listarDestaques()

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SecaoDestaques produtos={destaques} />
      <SecaoHistoria />
      <SecaoPromocoes />
      <SecaoAvaliacoes />
      <SecaoCTA />
    </Layout>
  )
}
