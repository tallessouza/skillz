# Deep Explanation: JSX e Criação de Componentes React

## O que é JSX

JSX é a sintaxe utilizada pelo React para criar componentes de forma **declarativa**. Em vez de manipular o DOM imperativamente (`document.createElement`, `appendChild`), você descreve a UI como se fosse HTML dentro de funções JavaScript/TypeScript.

O arquivo usa extensão `.tsx` (TypeScript + JSX) ou `.jsx` (JavaScript + JSX), indicando ao bundler que o arquivo contém sintaxe JSX que precisa ser transformada.

## Componentes são funções

O modelo mental central do React: **um componente é uma função que retorna JSX**. Não é uma classe, não é um template, não é um arquivo de configuração. É uma função JavaScript/TypeScript comum.

```tsx
export function App() {
  return <h1>Hello World!</h1>
}
```

Essa função:
1. Tem um nome PascalCase (`App`)
2. Retorna JSX (a tag `<h1>`)
3. É exportada para ser usada em outros lugares

## Por que PascalCase é obrigatório

React usa a capitalização para distinguir componentes customizados de elementos HTML nativos:
- `<app>` → React interpreta como tag HTML `<app>` (inválida, mas tenta)
- `<App>` → React interpreta como componente `App` e executa a função

Essa é uma **regra do React**, não uma convenção. Componentes com letra minúscula simplesmente não funcionam como esperado.

## Named exports vs Default exports — A analogia do "componente batata"

O instrutor demonstrou um problema prático com `export default`:

```tsx
// app.tsx
export default function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — PROBLEMA: qualquer nome é aceito
import Batata from './App'
```

Com `export default`, o importador pode dar **qualquer nome** ao componente. Isso cria problemas reais:
- Perde rastreabilidade no codebase (buscar por "App" não encontra "Batata")
- Facilita erros de nomenclatura
- Dificulta refactoring automatizado

Com `export function` (named export):
```tsx
// app.tsx
export function App() {
  return <h1>Hello World!</h1>
}

// main.tsx — FORÇADO a usar o nome correto
import { App } from './App'
```

O destructuring `{ App }` exige que o nome corresponda exatamente ao que foi exportado. Se o componente se chama `App`, você importa `App`.

## Omitir extensão nos imports

O bundler (Vite, Webpack, etc.) resolve automaticamente as extensões `.tsx`, `.ts`, `.jsx`, `.js`. Escrever a extensão é redundante:

```tsx
// Desnecessário
import { App } from './App.tsx'

// Correto — bundler resolve sozinho
import { App } from './App'
```

## Como o componente é usado

No `main.tsx`, o componente é usado como uma tag JSX:

```tsx
<StrictMode>
  <App />
</StrictMode>
```

A sintaxe `<App />` significa: "execute a função `App` e renderize o que ela retornar aqui". O `/>` indica que a tag é auto-fechante (não tem filhos).

## Hot Reload (Fast Refresh)

O instrutor demonstrou que ao alterar o texto de "Hello World" para "Hello React" e salvar, a mudança refletiu instantaneamente no navegador sem recarregar a página. Isso é o **hot reload** (ou Fast Refresh no Vite):

- O Vite detecta mudanças no arquivo
- Recompila apenas o módulo alterado
- Atualiza o componente no navegador preservando o estado
- O desenvolvedor vê o resultado imediatamente

Comando para rodar o projeto: `npm run dev` — o Vite serve em `localhost:5173` por padrão.

## Estrutura mínima de um projeto React com Vite

```
src/
├── main.tsx    → Ponto de entrada, monta o React no DOM
├── App.tsx     → Componente principal da aplicação
```

O `main.tsx` usa `createRoot` para montar o React em um elemento do HTML (`#root`), e renderiza o componente `<App />` dentro de `<StrictMode>`.