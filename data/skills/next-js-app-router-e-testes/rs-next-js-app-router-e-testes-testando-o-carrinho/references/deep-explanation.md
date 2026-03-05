# Deep Explanation: Testando o Carrinho com Cypress

## Por que cada teste comeca do zero

O instrutor enfatiza que cada `it()` block reseta o estado da aplicacao. Isso significa que o carrinho volta a zero no inicio de cada teste. Nao ha dependencia entre testes — cada um e independente e autocontido. Isso e fundamental para testes E2E confiaveis.

## Seletores CSS no Cypress: a escolha importa

O instrutor usa `a[href^="/product"]` — o `^=` significa "comeca com". Essa e uma sintaxe CSS padrao (assim como querySelector do JavaScript). Ele escolheu esse seletor porque:
- E semantico (links para produto)
- Nao depende de classes CSS que podem mudar
- Funciona mesmo que o layout mude

Quando ele tentou sem aspas duplas ao redor do valor (`a[href^=/product]`), deu erro "Unrecognized expression". A solucao foi adicionar aspas duplas: `a[href^="/product"]`.

## cy.url() vs cy.location()

O instrutor mostra duas formas de validar URL:
- `cy.url().should('include', 'product')` — pega a URL inteira incluindo dominio
- `cy.location('pathname').should('include', '/product')` — pega apenas o pathname (tudo apos a primeira barra)

Ele prefere `cy.location('pathname')` porque isola apenas a parte relevante da URL, ignorando dominio e porta que podem variar entre ambientes.

## O conceito de "count por produto vs por quantidade"

No teste de duplicados, o instrutor explica que o carrinho conta produtos unicos, nao quantidade total. Entao clicar 2x em "Adicionar ao carrinho" no mesmo produto deve manter `Cart (1)`, nao ir para `Cart (2)`. Isso testa uma regra de negocio especifica.

## cy.contains() como seletor de texto

`cy.contains('Adicionar ao carrinho')` busca qualquer elemento que contenha exatamente esse texto. E mais resiliente que seletores CSS porque:
- Reflete o que o usuario realmente ve
- Nao depende de estrutura HTML
- Se o texto mudar, o teste falha — o que e desejavel (detecta regressao visual)

## Busca com form submit

Para testar busca, o instrutor:
1. Seleciona o input por name: `cy.get('input[name=q]')`
2. Digita texto: `.type('moletom')`
3. Navega ao form pai: `.parent('form')`
4. Submete: `.submit()`

Essa abordagem e melhor que simular Enter porque `.submit()` dispara o evento nativo do formulario, garantindo que qualquer handler de submit funcione.

## Visualizacao no Cypress Runner

O instrutor destaca que ao passar o mouse sobre cada step no painel esquerdo do Cypress, voce ve exatamente o que aconteceu na tela — incluindo o ponto exato do clique (indicado em vermelho). Isso e essencial para debugging de testes que falham.

## Prerequisito: aplicacao rodando

O Cypress precisa que a aplicacao esteja rodando (`pnpm run dev`) para acessar via `cy.visit()`. O instrutor menciona que futuramente isso sera customizado para rodar em producao, mas para desenvolvimento local o `dev` server e suficiente.