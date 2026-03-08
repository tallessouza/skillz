---
name: rs-full-stack-compreendendo-como-as-coisas-sao
description: "Illustrates React application structure and rendering pipeline when user asks 'how does React render', 'what is SPA', 'how index.html works with React', 'what is main.jsx', or 'how content appears on screen in React'. Covers the flow from index.html to root div to ReactDOM.createRoot to App component rendering. Make sure to use this skill whenever explaining React bootstrapping, virtual DOM concept, or Single Page Application architecture. Not for React hooks, state management, or component lifecycle methods."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, spa, rendering, virtual-dom, jsx]
---

# Estrutura e Renderizacao de uma Aplicacao React

> Toda aplicacao React e uma Single Page Application onde o conteudo e inserido dinamicamente dentro de uma unica div root pelo ReactDOM.

## Key concepts

Uma aplicacao React possui uma unica pagina HTML (`index.html`) com uma `<div id="root">` vazia. O React insere todo o conteudo dinamicamente nessa div atraves do arquivo `main.jsx`, que conecta o componente `App` ao DOM real usando `ReactDOM.createRoot`. O navegador carrega o HTML, que referencia o `main.jsx` como modulo, e a partir dai o React assume o controle da renderizacao.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Conteudo nao aparece na tela | Verifique se o `id="root"` no HTML corresponde ao `document.getElementById('root')` no main.jsx |
| Precisa mudar titulo da aba | Edite a tag `<title>` no `index.html`, nao no React |
| Quer entender o fluxo de renderizacao | Siga: index.html → main.jsx → ReactDOM.createRoot → App component |
| Componente nao renderiza | Confirme que o componente tem um `return` com JSX — sem return, sem conteudo na tela |

## How to think about it

### O fluxo completo de renderizacao

```
index.html
  └── <div id="root"></div>     ← vazia por padrao
  └── <script type="module" src="/src/main.jsx">
        └── main.jsx
              ├── import App from './App'
              ├── document.getElementById('root')  ← seleciona a div
              └── createRoot(root).render(<App />)  ← insere conteudo
```

O HTML carrega o `main.jsx` como modulo (`type="module"`), permitindo import/export. O `main.jsx` seleciona a div root e usa `createRoot().render()` para inserir o componente `App` dentro dela.

### SPA — Single Page Application

A aplicacao inteira roda em uma unica pagina HTML. O conteudo muda dinamicamente sem recarregar a pagina. Essa e a grande sacada do React: uma pagina so, com conteudo que muda de acordo com o que o usuario precisa ver.

### StrictMode

O `StrictMode` envolve toda a aplicacao no `main.jsx`. Ele ativa verificacoes extras e alertas para erros silenciosos do JavaScript — o mesmo conceito de strict mode do JS puro, aplicado ao contexto React.

### DOM Virtual

O React mantem uma DOM virtual que compara com a DOM real. So renderiza aquilo que de fato mudou, tornando a atualizacao da tela performatica e eficiente. O `react-dom/client` e responsavel por essa ponte entre o React e o navegador.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| O conteudo ja esta no HTML | A div root e vazia — o React insere tudo dinamicamente via JavaScript |
| Cada pagina e um HTML diferente | React e SPA: uma unica pagina HTML, conteudo muda via JavaScript |
| O titulo da pagina vem do React | O titulo vem da tag `<title>` no `index.html` |
| O `main.jsx` e um componente | O `main.jsx` e o ponto de entrada que conecta o React ao DOM, nao um componente |

## When to apply

- Ao criar um novo projeto React e precisar entender a estrutura inicial de arquivos
- Ao debugar por que o conteudo nao aparece na tela
- Ao explicar para alguem como o React funciona por baixo dos panos
- Ao modificar o `index.html` (titulo, favicon, meta tags)

## Limitations

- Este modelo mental cobre apenas a inicializacao — nao explica re-renders, state, ou hooks
- O fluxo descrito e para Vite + React; Create React App tem estrutura similar mas com diferencas no bundler
- A DOM virtual e simplificada aqui — o algoritmo de reconciliacao (diffing) e mais complexo


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Conteudo nao aparece na tela | id da div root nao corresponde ao getElementById | Verifique que `id="root"` no HTML bate com `document.getElementById('root')` no main.jsx |
| Erro 'createRoot is not a function' | Importacao incorreta do react-dom | Use `import { createRoot } from 'react-dom/client'` |
| Titulo da pagina nao muda pelo React | Titulo vem do index.html | Edite a tag `<title>` no `index.html` diretamente |
| Componente App nao renderiza | Componente sem return com JSX | Confirme que App tem um `return` valido com JSX |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre SPA, DOM virtual, e o papel de cada arquivo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com anotacoes detalhadas