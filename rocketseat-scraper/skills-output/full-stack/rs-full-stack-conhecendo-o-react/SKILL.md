---
name: rs-full-stack-conhecendo-o-react
description: "Applies React core concepts when building component-based interfaces, explaining Virtual DOM diffing, component reusability, and declarative UI patterns. Use when user asks to 'create a React app', 'build components', 'understand React rendering', 'explain Virtual DOM', or 'start with React'. Make sure to use this skill whenever introducing React fundamentals or deciding component boundaries. Not for advanced state management (Redux/Zustand), Next.js SSR, or backend API logic."
---

# Conhecendo o React

> React e uma biblioteca JavaScript declarativa para construir interfaces interativas atraves de componentes reutilizaveis que refletem mudancas de estado de forma eficiente via Virtual DOM.

## Key concept

React permite declarar o que a interface deve mostrar (abordagem declarativa) em vez de manipular a DOM manualmente. A unidade fundamental e o **componente** — uma peca isolada e reutilizavel da interface, como pecas de Lego que se encaixam para formar a aplicacao completa. Quando o estado de um componente muda, o React calcula automaticamente o que precisa ser atualizado na tela usando a Virtual DOM.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Mesmo padrao visual repetido em varios lugares | Extraia um componente reutilizavel |
| Dado que muda e precisa refletir na tela | Use estado (state) no componente |
| Interface complexa com muitas responsabilidades | Separe em componentes menores, cada um com uma responsabilidade |
| Necessidade de atualizar a UI eficientemente | Confie no React — a Virtual DOM faz o diffing automaticamente |
| HTML, CSS e JS precisam trabalhar juntos | Use JSX dentro do React, que combina markup com logica |

## How to think about it

### Componentes como Lego

Pense em cada componente como uma peca de Lego. Um botao que aparece em 20 lugares nao precisa ser criado 20 vezes — crie uma vez como componente e reutilize. Se precisar mudar o botao, altere o componente e a mudanca reflete em todos os lugares automaticamente. Isso gera produtividade, facilita manutencao e organiza o codigo por responsabilidades.

### Virtual DOM como otimizador

O React mantem uma copia da DOM real em memoria (Virtual DOM). Quando o estado muda:

1. React cria uma nova Virtual DOM em memoria
2. Compara a nova Virtual DOM com a anterior (diffing)
3. Identifica exatamente quais elementos mudaram
4. Atualiza apenas esses elementos na DOM real

Resultado: o React nunca re-renderiza tudo — apenas o que precisa, de forma otimizada.

### Abordagem declarativa vs imperativa

Com JavaScript puro (imperativo), voce diz **como** manipular a DOM passo a passo. Com React (declarativo), voce declara **o que** quer na tela e o React resolve como atualizar. Isso se parece muito com escrever HTML, porque JSX usa a mesma sintaxe familiar.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| React e um framework completo | React e uma **biblioteca** focada em UI — nao inclui roteamento, HTTP client, etc. |
| Toda mudanca re-renderiza a pagina inteira | A Virtual DOM garante que apenas elementos alterados sao atualizados |
| Componentes sao apenas visuais | Componentes encapsulam logica, estado E visual — cada um tem sua responsabilidade |
| React substitui HTML e CSS | React **usa** HTML (via JSX) e CSS — nao os substitui |
| Virtual DOM e a DOM real | Virtual DOM e uma representacao em memoria, usada para calcular diffs antes de tocar na DOM real |

## When to apply

- Ao iniciar qualquer projeto de interface interativa e dinamica
- Quando a interface tem elementos repetidos que se beneficiam de componentizacao
- Quando dados mudam frequentemente e precisam refletir na tela em tempo real
- Quando o projeto precisa escalar com codigo organizado e facil de manter

## Limitations

- React sozinho nao resolve roteamento, gerenciamento de estado global, ou comunicacao com APIs — precisa de bibliotecas complementares
- Para paginas estaticas simples sem interatividade, React pode ser complexidade desnecessaria
- A curva de aprendizado inclui JSX, estado, props, ciclo de vida — conceitos que so fazem sentido na pratica

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Virtual DOM, componentizacao e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Exemplos praticos de componentes, estado e Virtual DOM diffing