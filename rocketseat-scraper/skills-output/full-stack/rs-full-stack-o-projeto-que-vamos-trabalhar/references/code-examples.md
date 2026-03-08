# Code Examples: Estrutura de Projeto Frontend para Integração com API

## Estrutura de pastas do projeto DiverFound

```
src/
├── components/          # Componentes reutilizáveis da UI
│   ├── Button/
│   ├── Input/
│   ├── Header/
│   └── ...
├── pages/               # Páginas completas da aplicação
│   ├── SignIn/
│   │   └── index.tsx    # Formulário de login (visual only)
│   ├── SignUp/
│   │   └── index.tsx    # Formulário de cadastro (visual only)
│   ├── Dashboard/
│   │   └── index.tsx    # Lista de solicitações (visual only)
│   ├── Confirmation/
│   │   └── index.tsx    # Confirmação de envio (visual only)
│   └── NotFound/
│       └── index.tsx    # Página 404 com redirecionamento
├── routes/
│   ├── auth-routes.tsx  # Rotas públicas (SignIn, SignUp)
│   ├── app-routes.tsx   # Rotas autenticadas (Dashboard, etc.)
│   └── index.tsx        # Router principal com simulação de perfil
└── styles/
    └── global.css
```

## Simulação de perfil no router principal

```typescript
// routes/index.tsx
import { BrowserRouter } from "react-router-dom"
import { AuthRoutes } from "./auth-routes"
import { AppRoutes } from "./app-routes"

export function Routes() {
  // Simulação de perfil — será substituída por auth real
  // Trocar para testar diferentes fluxos:
  // "admin"    → acessa Dashboard com controle total
  // "employee" → acessa Dashboard com visão limitada
  // null       → volta para tela de login
  const profile = "admin"

  return (
    <BrowserRouter>
      {profile ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}
```

## Rotas públicas (auth)

```typescript
// routes/auth-routes.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { SignIn } from "../pages/SignIn"
import { SignUp } from "../pages/SignUp"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      {/* Qualquer rota desconhecida volta para login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
```

## Rotas autenticadas (app)

```typescript
// routes/app-routes.tsx
import { Routes, Route } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard"
import { Confirmation } from "../pages/Confirmation"
import { NotFound } from "../pages/NotFound"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

## Página NotFound com redirecionamento

```typescript
// pages/NotFound/index.tsx
import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <div className="not-found-container">
      <h1>Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
      <Link to="/">Voltar ao início</Link>
    </div>
  )
}
```

## Página visual pura (sem funcionalidade)

```typescript
// pages/SignIn/index.tsx
export function SignIn() {
  return (
    <div className="sign-in-container">
      <form>
        <h1>Entrar</h1>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" placeholder="seu@email.com" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" placeholder="********" />
        </div>

        {/* Botão existe visualmente mas não tem handler */}
        <button type="submit">Entrar</button>

        <a href="/sign-up">Criar uma conta</a>
      </form>
    </div>
  )
}
```

## Dashboard com dados estáticos

```typescript
// pages/Dashboard/index.tsx
export function Dashboard() {
  // Dados hardcoded — serão substituídos por chamadas à API
  const refunds = [
    { id: "1", name: "Almoço cliente", amount: 150.00, status: "pending" },
    { id: "2", name: "Transporte", amount: 45.50, status: "approved" },
    { id: "3", name: "Material escritório", amount: 230.00, status: "rejected" },
  ]

  return (
    <div className="dashboard-container">
      <h1>Solicitações de reembolso</h1>

      <ul className="refund-list">
        {refunds.map(refund => (
          <li key={refund.id} className="refund-item">
            <span>{refund.name}</span>
            <span>R$ {refund.amount.toFixed(2)}</span>
            <span className={`status-${refund.status}`}>
              {refund.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Variação: testando diferentes perfis

```typescript
// Para testar o fluxo de cada tipo de usuário,
// basta alterar a variável profile no router:

// 1. Testar fluxo de admin
const profile = "admin"
// Resultado: Dashboard com todas as solicitações e controles de aprovação

// 2. Testar fluxo de funcionário
const profile = "employee"
// Resultado: Dashboard com apenas as solicitações do próprio usuário

// 3. Testar fluxo sem autenticação
const profile = null
// Resultado: Tela de login (SignIn)

// 4. Testar rota inexistente (com perfil ativo)
// Acessar /qualquer-coisa → cai na página NotFound → link volta ao início

// 5. Testar rota inexistente (sem perfil)
// Acessar /qualquer-coisa → redireciona para login (Navigate to="/")
```