# Deep Explanation: Executando Teste Específico

## Por que `.test.ts` ou `.spec.ts`?

O Jest precisa de uma convencao para saber quais arquivos sao testes e quais sao codigo de producao. As duas convencoes aceitas sao:

- `.test.ts` — mais comum em projetos Node/TypeScript
- `.spec.ts` — vem da tradicao BDD (Behavior-Driven Development), comum em projetos Angular

A escolha e pessoal, mas o importante e manter consistencia no projeto inteiro. O instrutor escolheu `.test.ts`.

O padrao completo e: `{nome}.test.{extensao}` — entao para TypeScript fica `sum.test.ts`, para JavaScript ficaria `sum.test.js`.

## Por que o ts-node e necessario?

O Jest roda no Node.js, que nativamente nao entende TypeScript. O `ts-node` funciona como um intermediario que compila TypeScript on-the-fly para que o Node consiga executar.

Sem o `ts-node`, ao tentar rodar um teste `.test.ts`, o Jest lanca um erro dizendo que precisa dessa dependencia. O instrutor encontrou exatamente esse erro durante a aula e mostrou como resolver:

```bash
npm i ts-node@10.9.2 -D
```

A flag `-D` (ou `--save-dev`) e crucial porque `ts-node` so e necessario em desenvolvimento — nao vai para producao.

## Anatomia da funcao `test()`

A funcao `test()` do Jest recebe dois parametros:

1. **Nome do teste** (string) — descricao do que o teste valida. Ex: `'example'`
2. **Funcao de execucao** (callback/arrow function) — contem a logica do teste

```typescript
test('nome do teste', () => {
  // logica do teste aqui
})
```

Quando a funcao de execucao nao lanca nenhum erro (nenhuma assertion falha), o Jest considera o teste como PASS. Isso explica por que um teste com apenas `console.log` passa — ele nao falha em nada.

## Independencia dos testes em relacao a aplicacao

Um ponto importante destacado pelo instrutor: **testes automatizados rodam sem a aplicacao estar em execucao**. Isso significa que:

- Voce nao precisa rodar `npm run dev` antes de rodar testes
- Os testes importam modulos diretamente e os testam em isolamento
- O ambiente de teste e separado do ambiente de execucao da aplicacao
- Isso torna os testes mais rapidos e confiaveis

## Saida do Jest

Quando um teste executa com sucesso, o Jest mostra:

- O nome do arquivo testado
- Um checkmark (✓) ao lado de cada teste que passou
- Quantos testes foram executados e quantos passaram
- Tempo total de execucao

```
PASS  src/sum.test.ts
  ✓ example (Xms)

Tests:       1 passed, 1 total
Time:        X.XXXs
```

## Proximos passos mencionados

O instrutor menciona que na proxima aula sera adicionado um script no `package.json` para facilitar a execucao dos testes, em vez de digitar `npx jest <caminho>` toda vez.