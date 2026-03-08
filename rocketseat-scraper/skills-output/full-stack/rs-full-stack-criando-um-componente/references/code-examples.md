# Code Examples: Criando um Componente React

## Exemplo 1: Componente Button (exato da aula)

### Arquivo do componente

```tsx
// src/components/button.tsx
export function Button() {
  return <button>Clique aqui</button>
}
```

### Usando no App

```tsx
// src/App.tsx
import { Button } from "./components/button"

export function App() {
  return <Button />
}
```

### Resultado no navegador

Um botao HTML com o texto "Clique aqui".

---

## Exemplo 2: Variacao — Multiplos componentes na pasta

```
src/
├── components/
│   ├── button.tsx
│   ├── header.tsx
│   └── footer.tsx
├── App.tsx
└── main.tsx
```

### header.tsx

```tsx
// src/components/header.tsx
export function Header() {
  return (
    <header>
      <h1>Minha Aplicacao</h1>
    </header>
  )
}
```

### footer.tsx

```tsx
// src/components/footer.tsx
export function Footer() {
  return (
    <footer>
      <p>2024 - Todos os direitos reservados</p>
    </footer>
  )
}
```

### App.tsx usando todos

```tsx
// src/App.tsx
import { Header } from "./components/header"
import { Button } from "./components/button"
import { Footer } from "./components/footer"

export function App() {
  return (
    <>
      <Header />
      <Button />
      <Footer />
    </>
  )
}
```

---

## Exemplo 3: Variacao — Componente com mais conteudo

```tsx
// src/components/card.tsx
export function Card() {
  return (
    <div>
      <h2>Titulo do Card</h2>
      <p>Descricao do card com informacoes importantes.</p>
      <button>Saiba mais</button>
    </div>
  )
}
```

```tsx
// src/App.tsx
import { Card } from "./components/card"

export function App() {
  return <Card />
}
```

---

## Exemplo 4: Erro comum — nome minusculo na funcao

```tsx
// ERRADO — React interpreta como tag HTML, nao como componente
export function button() {
  return <button>Clique aqui</button>
}
```

```tsx
// CORRETO — PascalCase identifica como componente React
export function Button() {
  return <button>Clique aqui</button>
}
```

---

## Exemplo 5: Erro comum — esquecer o export

```tsx
// ERRADO — sem export, nao pode ser importado
function Button() {
  return <button>Clique aqui</button>
}
```

```tsx
// CORRETO — export permite importar em outros arquivos
export function Button() {
  return <button>Clique aqui</button>
}
```

---

## Exemplo 6: Sintaxe de uso do componente

```tsx
// Forma auto-fechante (quando nao tem children)
<Button />

// Forma com abertura e fechamento (equivalente neste caso)
<Button></Button>
```

Ambas as formas funcionam. O instrutor usa a forma auto-fechante `<Button />` na aula.