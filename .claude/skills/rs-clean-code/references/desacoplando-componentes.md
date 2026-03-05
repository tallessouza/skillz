---
name: rs-clean-code-desacoplando-componentes
description: "Enforces React component decoupling by isolating JavaScript logic (variables, functions, hooks) that serves only a specific part of the UI. Use when user asks to 'refactor a component', 'split components', 'clean up React code', 'reduce component size', or reviews large React files. Guides when to extract subcomponents based on logic isolation, not HTML size. Make sure to use this skill whenever reviewing or writing React components with mixed concerns. Not for CSS architecture, file/folder structure, or non-React code."
---

# Desacoplando Componentes React

> Separe componentes quando a logica JavaScript (variaveis, funcoes, hooks) serve apenas uma parte especifica da interface — nao pelo tamanho do HTML.

## Rules

1. **Separe por isolamento de logica, nao por repeticao** — o momento ideal de extrair um componente e quando variaveis, funcoes ou hooks servem apenas uma parte da UI, porque isso reduz confusao na camada JavaScript
2. **Olhe acima do return, nao dentro dele** — a interface (HTML/JSX) pode crescer sem problema; o que indica necessidade de split e a camada JavaScript antes do return, porque e ali que a complexidade se esconde
3. **Nem toda repeticao justifica um componente** — HTML repetido sem logica associada nao precisa virar componente, porque componentizacao excessiva piora a legibilidade sem ganho real
4. **Evite componentizacao excessiva** — criar componentes para tudo que se repete uma vez atrapalha mais do que ajuda, porque adiciona indireção sem beneficio
5. **Evite componentizacao de menos** — arquivos gigantescos sem separacao perdem ganhos de performance do algoritmo de reconciliacao do React, porque componentes menores permitem comparacoes menores

## How to identify

### Sinal de que um componente precisa ser dividido

```typescript
// SINAL: variavel/funcao usada por apenas UMA parte da interface
function HomePage() {
  const currentYear = new Date().getFullYear() // ← usado SÓ no footer
  const [todos, setTodos] = useState([])       // ← usado na lista
  const headerTitle = "My App"                 // ← usado SÓ no header

  return (
    <>
      <header><h1>{headerTitle}</h1></header>
      <main>{/* todos */}</main>
      <footer>© {currentYear}</footer>
    </>
  )
}
```

### Apos extrair

```typescript
// Footer.tsx — logica isolada com seu contexto
function Footer() {
  const currentYear = new Date().getFullYear()
  return <footer>© {currentYear}</footer>
}

// HomePage.tsx — so mantem o que pertence ao componente inteiro
function HomePage() {
  const [todos, setTodos] = useState([])

  return (
    <>
      <Header />
      <main>{/* todos */}</main>
      <Footer />
    </>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| useState/useEffect usado por uma secao da UI | Extrair em subcomponente |
| Variavel usada so no footer/header/sidebar | Mover para componente proprio |
| HTML repetido SEM logica | Nao precisa virar componente |
| HTML repetido COM logica (estado, handlers) | Extrair componente |
| Componente com 5+ useState antes do return | Investigar quais pertencem a subpartes |
| Arquivo grande mas logica JS simples | Nao precisa dividir so pelo tamanho |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar componente pra cada `<div>` repetido sem logica | Manter inline se nao ha logica associada |
| Julgar necessidade de split pelo tamanho do JSX | Julgar pela quantidade de logica JS acoplada |
| Manter useState de um subcomponente no pai | Mover o estado para o componente que realmente o usa |
| Componentizar por "parecer grande" | Componentizar quando logica pode ser isolada sem quebrar comportamento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-desacoplando-componentes/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-desacoplando-componentes/references/code-examples.md)
