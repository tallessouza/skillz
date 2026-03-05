# Deep Explanation: Criando Estrutura do App

## Por que CSS variables para fontes?

O instrutor explica que o padrao do `create-next-app` aplica a fonte Inter diretamente no className do body. Isso funciona para uma unica fonte, mas quando a aplicacao precisa de 2 ou 3 fontes diferentes (comum em projetos reais), fica dificil de controlar.

A abordagem com `variable: '--font-inter'` cria uma variavel CSS global. Isso permite:
1. Registrar a variavel no Tailwind como `font-sans`
2. Adicionar novas fontes criando novas variaveis (`--font-heading`, `--font-mono`)
3. Controlar fontes via classes do Tailwind ao inves de inline styles

O instrutor enfatiza: "Fica mais facil controlar, ao inves de simplesmente pegar uma fonte e declarar que todo o texto da minha aplicacao vai usar aquela fonte."

## Contexto do projeto

O projeto DevStore e um e-commerce simplificado focado em ensinar:
- **Server Components** — o principal diferencial do App Router
- **Fetch de dados** — como buscar dados de API muda completamente com Server Components
- **Intercepting Routes** — modal de detalhe do produto que vira pagina completa no F5

Funcionalidades intencionalmente excluidas:
- Login (nao ensina Server Components)
- Checkout/pagamento (fora do escopo de fetch)

## Intercepting Routes (mencionado)

O instrutor descreve um padrao interessante: quando o usuario clica em um produto na home, aparece um modal. Mas se o usuario der F5 ou compartilhar a URL, cai na pagina completa do detalhe. Isso usa **intercepting routes** do Next.js — sera implementado em aulas seguintes.

## Decisao de limpeza

O instrutor remove agressivamente tudo que vem padrao do `create-next-app`: README, SVGs, favicon, conteudo do globals.css, conteudo da page.tsx, extends do tailwind.config. A filosofia e comecar do zero absoluto, sem lixo do template.