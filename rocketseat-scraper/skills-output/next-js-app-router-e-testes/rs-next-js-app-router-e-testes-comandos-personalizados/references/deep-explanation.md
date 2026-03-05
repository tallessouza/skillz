# Deep Explanation: Comandos Personalizados no Cypress

## Por que evitar mocks em testes E2E

O instrutor enfatiza um ponto critico que muitos devs (e ate instrutores) erram: **mocks em testes E2E criam falsos positivos perigosos**.

O raciocinio completo:
1. Seu frontend depende do backend — quando a aplicacao esta no ar, o backend precisa funcionar para o frontend funcionar
2. Se voce cria mocks para todas as respostas HTTP, esta dizendo ao teste "o backend responde assim"
3. Se alguem muda o formato de resposta de uma rota, ou deleta uma rota, **seus testes continuam passando** — falso positivo
4. Voce nao esta testando sua aplicacao, esta testando uma versao ficticia dela

### Quando fixtures sao aceitaveis

O unico caso justificavel: **APIs externas que voce nao controla** e que sao lentas ou instaveis.

Exemplo concreto do instrutor: calculo de frete que bate na API dos Correios. Se essa API:
- E muito lenta e atrasa seus testes
- Cai com frequencia e quebra o CI

Entao voce pode criar um arquivo fixture (`cypress/fixtures/`) com a resposta esperada e usar `cy.intercept` para interceptar apenas essa chamada especifica.

A regra e: **mock cirurgico para API externa instavel, nunca mock generalizado para APIs internas**.

## Tipos de comando no Cypress

O instrutor faz uma analogia com gramatica portuguesa (verbos transitivos/intransitivos):

### Parent command
- Nao depende de elemento previo
- Chamado direto no `cy`: `cy.searchByQuery('termo')`
- Analogia: verbo intransitivo — funciona sozinho
- Exemplos nativos: `cy.visit()`, `cy.request()`

### Child command
- Precisa de um elemento selecionado antes
- Chamado apos `cy.get()`: `cy.get('btn').click()`
- Analogia: verbo transitivo — precisa de complemento
- Nao faz sentido chamar `cy.click()` sem dizer "clicar no que?"

### Dual command
- Funciona com ou sem elemento previo
- Pode ser `cy.contains('texto')` ou `cy.get('div').contains('texto')`

## Estrutura de pastas do Cypress

O instrutor explica o proposito de cada pasta:

- **`cypress/e2e/`** — arquivos de teste
- **`cypress/fixtures/`** — dados ficticios para simular respostas HTTP (usar com parcimonia)
- **`cypress/downloads/`** — arquivos baixados durante testes (PDFs, XMLs exportados) que podem ser validados
- **`cypress/support/`** — configuracoes e comandos customizados
  - `e2e.ts` — carregado automaticamente antes de cada teste E2E
  - `commands.ts` — onde se definem comandos customizados

## Configuracao do ESLint para namespaces

O Cypress exige `declare namespace Cypress` para tipagem de comandos customizados, mas o ESLint com config TypeScript reclama com a regra `@typescript-eslint/no-namespace`. A solucao e desabilitar essa regra especifica:

```json
{
  "rules": {
    "@typescript-eslint/no-namespace": "off"
  }
}
```

Isso e necessario porque a alternativa (`declare global`) tambem gera erro de ESLint (`prefer ES2015 module syntax over namespaces`).

## Retorno de comandos customizados

O instrutor menciona que comandos podem retornar valores encadeiaveis. Se o comando faz `return cy.get('form')`, o tipo na interface seria `Chainable<JQuery<HTMLFormElement>>` ao inves de `Chainable<void>`. Isso permite encadear acoes apos o comando customizado.