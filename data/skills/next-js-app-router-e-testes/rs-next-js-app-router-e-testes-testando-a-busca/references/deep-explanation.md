# Deep Explanation: Testando a Busca com Cypress

## Por que configurar baseUrl

O instrutor explica que enquanto os testes rodam na maquina local, a URL sera `localhost:3000`. Mas em outro ambiente (CI, staging), pode ser diferente. Centralizar no `cypress.config.ts` permite trocar em um unico lugar. Alem disso, evita a repeticao manual em dezenas de testes.

## beforeEach vs visit inline

O instrutor comeca usando `beforeEach` com `cy.visit('/')` para todos os testes, similar ao Jest/Vitest. Porem, ao criar o teste de redirect (que precisa visitar `/search` diretamente), ele percebe que o `beforeEach` com visit na home atrapalha. A solucao e mover o `cy.visit` para dentro de cada teste quando os pontos de entrada diferem.

Essa decisao mostra um principio importante: **beforeEach e para setup comum real, nao para conveniencia**. Se um teste precisa de um ponto de partida diferente, o setup deve ser especifico.

## O problema do redirect do Next.js

Este e o insight mais valioso da aula. Quando Next.js faz um `redirect()` (server-side), internamente ele usa `throw` para interromper a execucao. O Cypress intercepta isso como uma `uncaught:exception` e falha o teste.

O instrutor enfatiza: "nao da nem pra chamar de erro, e uma excecao que o Next usa para fazer o redirect". A solucao e usar `cy.on('uncaught:exception', () => false)` que diz ao Cypress para ignorar excecoes nao tratadas naquele teste.

Importante: o `cy.on` e colocado **dentro do teste especifico**, nao no `beforeEach`, porque so o teste de redirect precisa dessa supressao. Colocar globalmente mascararia erros reais em outros testes.

## Filosofia de teste do Cypress

O instrutor reforça que o Cypress "nao tem qualquer tipo de dependencia tecnica em alguma tecnologia especifica" — ele testa o fluxo do usuario, nao a implementacao. Isso significa que os mesmos testes funcionariam se a aplicacao fosse migrada de Next.js para outra framework, desde que o comportamento do usuario permanecesse o mesmo.

Ele chama isso de "fluxo de QA humanizado": simular o que o usuario faria (digitar, submeter, ver resultados) e verificar o que o usuario esperaria (estar na pagina certa, ver produtos).

## Estrategia de assertions na busca

O instrutor usa tres assertions complementares no teste de busca:
1. `pathname` inclui `/search` — confirma que houve navegacao
2. `search` inclui `q=moletom` — confirma que o parametro foi passado
3. Elemento de produto `should('exist')` — confirma que resultados apareceram

Cada assertion testa uma parte diferente do fluxo. Se qualquer uma falhar, o desenvolvedor sabe exatamente onde o problema esta.

## Sobre buscar por dados conhecidos

O instrutor menciona que busca por "moletom" porque sabe que esse produto existe na API. Em testes E2E, e aceitavel depender de dados conhecidos do ambiente de teste. A alternativa seria seed de dados, mas para aplicacoes simples, conhecer os dados do ambiente e pragmatico.