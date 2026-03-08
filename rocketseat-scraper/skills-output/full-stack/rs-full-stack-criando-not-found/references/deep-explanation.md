# Deep Explanation: Criando Not Found

## Por que uma página Not Found é essencial

Quando o usuário acessa uma rota que não existe na aplicação, sem um catch-all o React Router simplesmente não renderiza nada — a tela fica em branco. Isso é uma péssima experiência de usuário porque:

1. O usuário não sabe se a página está carregando ou quebrou
2. Não há caminho de volta — o usuário fica "perdido"
3. Passa impressão de aplicação incompleta ou com bugs

## Como o React Router resolve rotas

O React Router avalia as rotas **em ordem sequencial** dentro de `<Routes>`. Para cada navegação:

1. Percorre cada `<Route>` de cima para baixo
2. Compara o `path` com a URL atual
3. Se encontra match, renderiza o `element`
4. Se nenhum match, não renderiza nada

Por isso o `path="*"` (asterisco = qualquer caminho) deve ser a **última rota**. Se fosse a primeira, capturaria todas as navegações e nenhuma outra rota funcionaria.

## Padrão de centralização full-screen com Tailwind

O instrutor usa um padrão muito comum para centralizar conteúdo na tela inteira:

```
w-screen  → largura = 100vw (viewport width)
h-screen  → altura = 100vh (viewport height)
flex      → display: flex
justify-center → justify-content: center (eixo horizontal)
items-center   → align-items: center (eixo vertical)
```

Essa combinação cria um container que ocupa a tela toda e centraliza o conteúdo tanto horizontal quanto verticalmente. É o padrão mais direto para páginas de estado (404, loading, erro).

## Estrutura de duas divs

O instrutor usa duas divs aninhadas:
- **Div externa:** `w-screen h-screen flex justify-center items-center` — centraliza tudo na tela
- **Div interna:** `flex flex-col` — organiza h1 e link em coluna (um embaixo do outro)

Sem a div interna com `flex-col`, o h1 e o link ficariam lado a lado (comportamento padrão do flex é `flex-row`).

## Hover com transição suave

O link usa `text-green-100` como cor base e `hover:text-green-200` como cor ao passar o mouse. Para que a mudança de cor seja suave (e não instantânea), o instrutor adiciona:

- `transition` — habilita transição CSS
- `is-linear` — curva de animação linear (velocidade constante)

Isso cria um efeito visual profissional com pouco esforço.

## Emoji direto no JSX

O instrutor recomenda o site [getemoji.com](https://getemoji.com) para copiar emojis. No React, emoji Unicode funciona diretamente no JSX sem necessidade de escape ou encoding especial — basta colar.

## Nomenclatura do componente

O arquivo se chama `NotFound.tsx` e fica em `src/pages/`. Seguindo a convenção do projeto:
- `pages/` contém componentes de página (mapeados 1:1 com rotas)
- O nome do componente reflete sua função: `NotFound` = "não encontrado"