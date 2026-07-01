import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface Props {
  children: ReactNode
  semFooter?: boolean
}

export function Layout({ children, semFooter = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!semFooter && <Footer />}
    </div>
  )
}
