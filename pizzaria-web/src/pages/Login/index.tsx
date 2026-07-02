import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/common/Button'

type Tela = 'login' | 'recuperar' | 'recuperar-enviado'

const USUARIOS_DICA = [
  { perfil: 'Administrador', email: 'admin@pizzaria.com',  senha: 'admin123',   icone: '🔐' },
  { perfil: 'Cliente',       email: 'maria@email.com',     senha: 'cliente123', icone: '👤' },
]

const ERROS_AMIGAVEIS: Record<string, string> = {
  credenciais: 'E-mail ou senha incorretos. Verifique os dados e tente novamente.',
  tentativas:  'Muitas tentativas incorretas. Aguarde 1 minuto antes de tentar novamente.',
  generico:    'Algo deu errado. Por favor, tente novamente em instantes.',
}

function IconeOlho({ visivel }: { visivel: boolean }) {
  return visivel ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()

  const destino = (location.state as { from?: string })?.from ?? '/admin'

  // Login
  const [email, setEmail]         = useState('')
  const [senha, setSenha]         = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [carregando, setCarregando]     = useState(false)
  const [tentativas, setTentativas]     = useState(0)
  const [erroLogin, setErroLogin]       = useState('')
  const [erros, setErros]               = useState<{ email?: string; senha?: string }>({})

  // Recuperação
  const [tela, setTela]               = useState<Tela>('login')
  const [emailRecup, setEmailRecup]   = useState('')
  const [erroRecup, setErroRecup]     = useState('')
  const [enviandoRecup, setEnviandoRecup] = useState(false)

  function validarLogin() {
    const e: { email?: string; senha?: string } = {}
    if (!email.trim())                          e.email = 'Informe seu e-mail.'
    else if (!/\S+@\S+\.\S+/.test(email))       e.email = 'E-mail inválido.'
    if (!senha)                                 e.senha = 'Informe sua senha.'
    else if (senha.length < 6)                  e.senha = 'A senha deve ter pelo menos 6 caracteres.'
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErroLogin('')
    if (!validarLogin()) return
    if (tentativas >= 5) { setErroLogin(ERROS_AMIGAVEIS.tentativas); return }

    setCarregando(true)
    try {
      const ok = await login(email.trim(), senha)
      if (ok) {
        navigate(destino, { replace: true })
      } else {
        const novas = tentativas + 1
        setTentativas(novas)
        setErroLogin(novas >= 5 ? ERROS_AMIGAVEIS.tentativas : ERROS_AMIGAVEIS.credenciais)
      }
    } catch {
      setErroLogin(ERROS_AMIGAVEIS.generico)
    } finally {
      setCarregando(false)
    }
  }

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault()
    setErroRecup('')
    if (!emailRecup.trim())                        { setErroRecup('Informe seu e-mail.'); return }
    if (!/\S+@\S+\.\S+/.test(emailRecup))          { setErroRecup('E-mail inválido.'); return }
    setEnviandoRecup(true)
    await new Promise(r => setTimeout(r, 1200))
    setEnviandoRecup(false)
    setTela('recuperar-enviado')
  }

  function preencherDica(u: typeof USUARIOS_DICA[0]) {
    setEmail(u.email)
    setSenha(u.senha)
    setErros({})
    setErroLogin('')
  }

  // ── Tela de recuperação enviada ──────────────────────────────────────────
  if (tela === 'recuperar-enviado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✉️</div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">E-mail enviado!</h2>
          <p className="text-sm text-gray-500 mb-1">
            Enviamos as instruções de recuperação para:
          </p>
          <p className="text-sm font-semibold text-primary mb-6">{emailRecup}</p>
          <p className="text-xs text-gray-400 mb-6">
            Não recebeu? Verifique a caixa de spam ou tente novamente em alguns minutos.
          </p>
          <Button className="w-full" onClick={() => { setTela('login'); setEmailRecup('') }}>
            Voltar ao login
          </Button>
        </div>
      </div>
    )
  }

  // ── Tela de recuperação de senha ─────────────────────────────────────────
  if (tela === 'recuperar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <button
            onClick={() => { setTela('login'); setErroRecup('') }}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mb-6"
          >
            ← Voltar ao login
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🔑</div>
            <h2 className="text-xl font-bold text-brand-dark">Recuperar senha</h2>
            <p className="text-sm text-gray-500 mt-1">
              Informe seu e-mail e enviaremos as instruções.
            </p>
          </div>

          <form onSubmit={handleRecuperar} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-dark">E-mail</label>
              <input
                type="email"
                value={emailRecup}
                onChange={e => { setEmailRecup(e.target.value); setErroRecup('') }}
                placeholder="seu@email.com"
                className={`input-field ${erroRecup ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {erroRecup && <span className="text-xs text-red-500">{erroRecup}</span>}
            </div>

            <Button type="submit" tamanho="lg" className="w-full mt-1" carregando={enviandoRecup}>
              Enviar instruções
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // ── Tela de login principal ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col gap-5">

        {/* Logo / marca */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/30 text-3xl">
            🍕
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Pizzaria Bella Napoli</h1>
          <p className="text-sm text-gray-500 mt-1">Acesse sua conta para continuar</p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-brand-dark mb-6">Entrar</h2>

          {/* Erro geral */}
          {erroLogin && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <span className="text-base shrink-0">⚠️</span>
              <span>{erroLogin}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            {/* E-mail */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-dark">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErros(p => ({ ...p, email: undefined })); setErroLogin('') }}
                placeholder="seu@email.com"
                autoComplete="email"
                className={`input-field ${erros.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {erros.email && <span className="text-xs text-red-500">{erros.email}</span>}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-brand-dark">Senha</label>
                <button
                  type="button"
                  onClick={() => setTela('recuperar')}
                  className="text-xs text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErros(p => ({ ...p, senha: undefined })); setErroLogin('') }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-field pr-11 ${erros.senha ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setSenhaVisivel(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  <IconeOlho visivel={senhaVisivel} />
                </button>
              </div>
              {erros.senha && <span className="text-xs text-red-500">{erros.senha}</span>}
            </div>

            <Button type="submit" tamanho="lg" className="w-full mt-1" carregando={carregando}>
              Entrar
            </Button>
          </form>
        </div>

        {/* Dicas de acesso */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Acesso rápido — ambiente de demonstração
          </p>
          <div className="flex flex-col gap-2">
            {USUARIOS_DICA.map(u => (
              <button
                key={u.email}
                onClick={() => preencherDica(u)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
              >
                <span className="text-xl">{u.icone}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark">{u.perfil}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span className="text-xs text-gray-300 group-hover:text-primary transition-colors font-mono">
                  {u.senha}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Pizzaria Bella Napoli · Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
