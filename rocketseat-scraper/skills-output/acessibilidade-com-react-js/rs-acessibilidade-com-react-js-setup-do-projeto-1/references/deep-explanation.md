# Deep Explanation: Setup de Projeto Next.js para Acessibilidade

## Por que Next.js e nao Vite/CRA?

O instrutor explica que tecnicamente nao ha diferenca significativa para acessibilidade entre frameworks React. A escolha do Next.js traz uma peculiaridade: a distincao entre renderizacao server-side e client-side. Algumas ferramentas de acessibilidade podem ter conflitos dependendo de onde sao renderizadas. Com Vite ou CRA puro, isso nao seria uma preocupacao.

A mensagem principal: **acessibilidade e uma preocupacao do React, nao do framework**. Voce pode seguir os mesmos principios com qualquer setup.

## O papel do _document.tsx

O `_document.tsx` e um arquivo especial do Next.js Pages Router que:

1. **E renderizado apenas uma vez** — quando a aplicacao e carregada inicialmente
2. **Envolve toda a aplicacao** — e o "esqueleto" HTML
3. **Injeta scripts necessarios** — via `<NextScript />`
4. **Da controle sobre tags HTML fundamentais** — `<html>`, `<head>`, `<body>`

Isso e crucial para acessibilidade porque permite definir `lang` no `<html>`, carregar fontes no `<head>`, e controlar a estrutura semantica raiz.

### Diferenca entre _document.tsx e _app.tsx

- `_app.tsx`: renderizado em cada mudanca de pagina, controla estado e CSS global
- `_document.tsx`: renderizado uma unica vez, controla a estrutura HTML base

### Por que class component?

O instrutor usa class component por costume e facilidade de memoria. Voce pode usar function component tambem — a documentacao do Next.js mostra ambas as formas. O importante e que o componente estenda `Document` do `next/document`.

## Componentes especiais do Next.js

Voce NAO pode usar tags HTML normais no `_document.tsx`. Precisa usar os componentes do `next/document`:

- `Html` — substitui `<html>`, permite props como `lang`
- `Head` — substitui `<head>`, para meta tags e fonts (diferente do `next/head` usado em paginas)
- `Main` — onde o conteudo da pagina e renderizado
- `NextScript` — injeta os scripts do Next.js

Se usar `<html>` e `<head>` normais, o Next.js nao funcionara corretamente.

## Armadilha do crossOrigin

Ao colar links do Google Fonts no JSX, o atributo `crossorigin` do HTML vira `crossOrigin` no React (camelCase). Alem disso, o React espera uma string (`"anonymous"`), nao um booleano. Passar apenas `crossOrigin` sem valor causa erro de tipo.

## Ativacao automatica do TypeScript

Uma conveniencia do Next.js: basta renomear arquivos para `.tsx` e rodar `yarn dev`. O framework detecta a extensao e automaticamente:
1. Instala `typescript`, `@types/react`, `@types/node`
2. Cria `tsconfig.json` com configuracao padrao

Nao precisa configurar manualmente.

## Abreviacao a11y

O instrutor menciona que "acessibilidade" se abrevia como "a11y" porque entre a letra A e o Y existem 11 outras letras. Essa e uma convencao internacional (accessibility → a11y).