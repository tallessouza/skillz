# Deep Explanation: Categorizando Testes

## Por que categorizar?

O instrutor explica que antes de sair criando novos testes, a primeira coisa a fazer e organizar. A categorizacao com `describe` resolve dois problemas fundamentais:

1. **Legibilidade** — quando voce abre um arquivo de teste, a hierarquia de `describe` funciona como um indice. Voce sabe exatamente o que cada bloco testa sem ler o codigo.

2. **Mensagens de erro uteis** — quando um teste falha, o Vitest/Jest mostra: `arquivo > categoria > nome do teste`. Sem `describe`, voce so ve o nome do teste, que pode ser ambiguo. O instrutor demonstrou isso forçando um erro (mudando expect para 400) e mostrou como a saida indica claramente "Transactions routes > should be able to create a new transaction".

## `describe` cria um contexto

O ponto chave do instrutor: `describe` nao e apenas visual. Ele cria um **contexto de execucao**. `beforeAll` e `afterAll` dentro de um `describe` se aplicam apenas aos testes daquele bloco. Isso permite:

- Setup isolado por dominio
- Teardown que nao afeta outros testes
- Subcategorias com seus proprios ciclos de vida

## Subcategorias sem limite

O instrutor enfatiza que voce pode aninhar `describe` quantos niveis quiser. O caso de uso principal: quando uma rota especifica tem muitos cenarios de teste, crie um `describe` so para ela dentro do `describe` maior do dominio.

## `it` vs `test` — questao de gosto, mas com proposito

O instrutor e explicito: `it` e `test` fazem **exatamente a mesma coisa**. A diferenca e puramente semantica. `it` existe porque forma uma frase em ingles:

> "it should be able to create a new transaction"

Traduzindo: "deve ser possivel criar uma nova transacao". Isso espelha como escrevemos requisitos funcionais (RF) de uma aplicacao. O instrutor reconhece que e questao de gosto, mas prefere `it` porque transforma cada teste em um requisito funcional legivel.

## Analogia com requisitos funcionais

O insight mais valioso do instrutor: testes escritos com `it('should be able to ...')` sao essencialmente a **especificacao executavel** da aplicacao. Cada teste e um RF que pode ser verificado automaticamente. Isso conecta testes diretamente ao design da aplicacao.

## Funciona igual no Jest

O instrutor menciona que `describe` existe tanto no Vitest quanto no Jest, entao o padrao e transferivel entre frameworks.