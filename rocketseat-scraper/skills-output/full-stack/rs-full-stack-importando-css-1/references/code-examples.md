# Code Examples: Importando CSS no React

## Exemplo 1: Setup básico (da aula)

### Estrutura de arquivos

```
src/
├── app.tsx
└── styles.css
```

### styles.css — Arquivo CSS global

```css
.container {
  background-color: red;
  width: 100%;
  height: 100vh;
}
```

### app.tsx — Importando e usando o CSS

```tsx
import './styles.css'

export function App() {
  return (
    <div className="container">
      {/* Componentes aqui */}
    </div>
  )
}
```

**Resultado:** A div ocupa toda a tela com fundo vermelho.

## Exemplo 2: Evolução — Sem height definido

O instrutor mostra que sem `height: 100vh`, o fundo vermelho aparece apenas como uma "fitinha":

```css
/* Versão inicial — altura não definida */
.container {
  background-color: red;
}
```

A div se ajusta ao conteúdo interno, mostrando apenas uma faixa vermelha. Adicionando largura e altura:

```css
/* Versão final — ocupa toda a tela */
.container {
  background-color: red;
  width: 100%;
  height: 100vh;
}
```

## Exemplo 3: Erro comum — Named import para CSS global

```tsx
// ERRADO — CSS global não exporta um objeto
import styles from './styles.css'

// O que "styles" seria? undefined ou erro de build
```

```tsx
// CORRETO — Side-effect import
import './styles.css'
```

## Exemplo 4: Erro comum — Usar `class` em vez de `className`

```tsx
// ERRADO — "class" é palavra reservada do JavaScript
export function App() {
  return <div class="container">Hello</div>
  // Warning no console: "Invalid DOM property `class`. Did you mean `className`?"
}
```

```tsx
// CORRETO — React usa className
export function App() {
  return <div className="container">Hello</div>
}
```

## Exemplo 5: Erro comum — Esquecer a extensão

```tsx
// ERRADO — bundler não sabe qual loader usar
import './styles'
// Error: Cannot find module './styles'
```

```tsx
// CORRETO — extensão explícita para CSS
import './styles.css'
```

## Exemplo 6: Comparação — Import de componente vs CSS

```tsx
// Componente: SEM extensão (bundler resolve .tsx/.jsx automaticamente)
import { Header } from './components/Header'

// CSS: COM extensão (obrigatório para identificar o loader)
import './styles.css'
```

## Exemplo 7: Múltiplos arquivos CSS

```tsx
// Cada import injeta o CSS globalmente
import './global.css'
import './reset.css'
import './styles.css'

export function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">App</h1>
      </header>
    </div>
  )
}
```

## Exemplo 8: Verificação — `class` como palavra reservada

O instrutor demonstra por que `class` é reservada:

```javascript
// JavaScript usa "class" para declarar classes
class Teste {
  constructor() {
    // ...
  }
}

// Por isso no JSX: className (não class)
```

## Exemplo 9: Variação — CSS com mais propriedades

```css
.container {
  background-color: #121214;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1e1e6;
  font-family: sans-serif;
}
```

```tsx
import './styles.css'

export function App() {
  return (
    <div className="container">
      <h1>Conteúdo centralizado</h1>
    </div>
  )
}
```

## Exemplo 10: Ambiente de desenvolvimento

O instrutor lembra de manter o servidor rodando:

```bash
# Terminal — manter rodando durante o desenvolvimento
npm run dev
```

Com o Vite (ou outro bundler com HMR), as mudanças no CSS são refletidas instantaneamente no navegador sem precisar recarregar a página manualmente. Isso é o Hot Module Replacement atuando nos arquivos CSS.