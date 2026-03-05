# Deep Explanation: Refatorando Testes Unitarios para Either Pattern

## Por que os testes quebram

Quando use cases sao refatorados de throw/return direto para retornar Either (Left/Right), todos os testes quebram porque:

1. **O retorno mudou de estrutura** — antes `execute()` retornava o valor diretamente (ex: `{ answer }`), agora retorna um `Either<Error, Value>`
2. **Erros nao sao mais exceptions** — antes usava `rejects.toBeInstanceOf()` porque o use case fazia `throw`, agora o erro vem dentro de `Left`
3. **O value precisa de narrowing** — TypeScript nao sabe se o Either e Left ou Right, entao `result.value` pode ser o erro ou o sucesso

## O papel do optional chaining

Mesmo que voce faca `expect(result.isRight()).toBe(true)` na linha anterior, o TypeScript nao faz narrowing automatico entre linhas de expect. Por isso `result.value?.answer` com `?` e necessario — o compilador ainda ve `value` como `Error | SuccessType`.

Se voce criar um `if (result.isRight())` explicito, ai sim o TypeScript faz narrowing e o `?` se torna desnecessario. Mas em testes, o padrao e usar expects sequenciais, nao ifs.

## Estrategia de refatoracao em massa

O instrutor demonstra uma abordagem pragmatica:

1. Roda `npm run test -- --watch` para feedback imediato
2. Refatora um arquivo por vez
3. O padrao e repetitivo: extrair resultado em `const result`, trocar assertions
4. Para testes de erro: copiar o par `expect(result.isLeft()).toBe(true)` + `expect(result.value).toBeInstanceOf(ErrorClass)` e reusar
5. Para testes de fetch/get: trocar o nome da variavel para `result` e acessar com `result.value?.prop`

## Observacao do instrutor sobre trabalho repetitivo

O instrutor reconhece que a refatoracao e "um pouquinho macante" mas enfatiza que isso e parte normal do trabalho de desenvolvimento. Nao ha atalho — quando voce muda o contrato de retorno dos use cases, todos os consumers (incluindo testes) precisam ser atualizados. A disciplina de fazer isso corretamente evita bugs silenciosos.