# Code Examples: Retornando um Elemento Parent

## Exemplo 1: Erro ao retornar múltiplos elementos

```tsx
// ❌ ERRO: JSX expressions must have one parent element
function Buttons() {
  return (
    <button>Primeiro</button>
    <button>Segundo</button>
  )
}
```

## Exemplo 2: Solução com div

```tsx
function Buttons() {
  return (
    <div>
      <button>Primeiro</button>
      <button>Segundo</button>
    </div>
  )
}
// Resultado no DOM: <div><button>Primeiro</button><button>Segundo</button></div>
```

## Exemplo 3: Solução com Fragment (shorthand)

```tsx
function Buttons() {
  return (
    <>
      <button>Primeiro</button>
      <button>Segundo</button>
    </>
  )
}
// Resultado no DOM: <button>Primeiro</button><button>Segundo</button>
// Nenhum wrapper extra no HTML
```

## Exemplo 4: Três botões com div

```tsx
function Buttons() {
  return (
    <div>
      <button>Primeiro</button>
      <button>Segundo</button>
      <button>Terceiro</button>
    </div>
  )
}
// Os botões aparecem lado a lado (inline) por padrão
// Para empilhar, aplicar CSS: display: flex; flex-direction: column
```

## Exemplo 5: Fragment com key (em listas)

```tsx
import { Fragment } from 'react'

function UserList({ users }) {
  return (
    <dl>
      {users.map(user => (
        <Fragment key={user.id}>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
// Fragment com key é necessário quando iterando listas
// Shorthand <> não aceita atributos
```

## Exemplo 6: Componente real com wrapper semântico

```tsx
function Navigation() {
  return (
    <nav className="main-nav">
      <a href="/">Home</a>
      <a href="/about">Sobre</a>
      <a href="/contact">Contato</a>
    </nav>
  )
}
// Aqui o wrapper (nav) faz parte da semântica — não é arbitrário
```

## Exemplo 7: Fragment aninhado

```tsx
function Page() {
  return (
    <>
      <Header />
      <>
        <Sidebar />
        <Content />
      </>
      <Footer />
    </>
  )
}
// Fragments podem ser aninhados, mas geralmente é desnecessário
```

## Variação: Retorno condicional com Fragment

```tsx
function Status({ isLoggedIn }) {
  return (
    <>
      {isLoggedIn ? (
        <>
          <span>Bem-vindo!</span>
          <button>Sair</button>
        </>
      ) : (
        <button>Entrar</button>
      )}
    </>
  )
}
```