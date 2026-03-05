# Code Examples: Acessibilidade com React

## Nota sobre esta aula

Esta e a aula introdutoria do curso. Nao ha exemplos de codigo no transcript original — o instrutor apresenta o roadmap do que sera coberto nas proximas aulas.

Os exemplos abaixo sao baseados nos topicos mencionados pelo instrutor e representam os padroes fundamentais que serao explorados em detalhe ao longo do curso.

## HTML Semantico Basico vs Div Soup

### Errado — "Div soup" (comum em projetos React)
```tsx
function Header() {
  return (
    <div className="header">
      <div className="nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          Home
        </div>
        <div className="nav-item" onClick={() => navigate('/about')}>
          Sobre
        </div>
      </div>
    </div>
  )
}
```

### Correto — HTML semantico
```tsx
function Header() {
  return (
    <header>
      <nav aria-label="Navegacao principal">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/about">Sobre</a></li>
        </ul>
      </nav>
    </header>
  )
}
```

**Por que:** `<header>`, `<nav>`, `<ul>`, `<li>`, `<a>` dao semantica que screen readers entendem. `<div>` com `onClick` nao e focavel por teclado, nao tem role, nao e anunciado corretamente.

## Landmarks — Estrutura de Pagina

```tsx
function App() {
  return (
    <>
      <header>
        <nav aria-label="Navegacao principal">
          {/* Links de navegacao */}
        </nav>
      </header>

      <main>
        {/* Conteudo unico da pagina — apenas 1 <main> por pagina */}
        <h1>Titulo da pagina</h1>
        <article>
          <p>Conteudo principal</p>
        </article>
      </main>

      <aside aria-label="Conteudo relacionado">
        {/* Sidebar com informacoes complementares */}
      </aside>

      <footer>
        {/* Links do rodape, copyright */}
      </footer>
    </>
  )
}
```

**Landmarks reconhecidos por screen readers:**
- `<header>` → banner
- `<nav>` → navigation
- `<main>` → main
- `<aside>` → complementary
- `<footer>` → contentinfo
- `<section>` com `aria-label` → region
- `<form>` com `aria-label` → form

## Setup de Ferramentas

### ESLint plugin para a11y
```bash
npm install eslint-plugin-jsx-a11y --save-dev
```

```json
// .eslintrc.json
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"]
}
```

### Biblioteca de componentes acessiveis (Radix UI)
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

```tsx
import * as Dialog from '@radix-ui/react-dialog'

function ConfirmDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Abrir dialogo</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="content">
          <Dialog.Title>Confirmar acao</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja continuar?
          </Dialog.Description>
          <Dialog.Close asChild>
            <button>Fechar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**Por que usar Radix:** O componente ja implementa focus trap, ESC para fechar, aria-labelledby, aria-describedby, e retorno de foco ao trigger. Implementar tudo isso manualmente e complexo e propenso a erros.

## Layout Consistente entre Rotas

```tsx
// Layout compartilhado — navegacao sempre no mesmo lugar
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <nav aria-label="Navegacao principal">
          <a href="/">Home</a>
          <a href="/produtos">Produtos</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>&copy; 2026 Minha App</p>
      </footer>
    </>
  )
}
```

**Por que:** Usuarios que dependem de screen readers ou navegacao por teclado memorizam a estrutura da pagina. Se a navegacao muda de posicao entre rotas, a experiencia se torna confusa e inacessivel.