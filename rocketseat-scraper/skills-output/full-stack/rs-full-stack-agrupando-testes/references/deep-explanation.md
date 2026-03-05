# Deep Explanation: Agrupando Testes com Describe

## Por que agrupar testes?

O instrutor parte de um insight pratico: **uma mesma funcionalidade tem multiplos cenarios**. Ele usa o exemplo de login — sucesso, senha incorreta, usuario inexistente. Cada cenario vira um `test()`, mas sem agrupamento eles ficam "soltos" no arquivo.

O problema nao e funcional (os testes passam igual), e de **legibilidade da saida do runner**. Quando voce executa os testes, o runner mostra:

```
Sem describe:
  ✓ sum of 3 plus 7 must be 10
  ✓ sum of 2 plus 2 must be 4

Com describe:
  sum
    ✓ sum of 3 plus 7 must be 10
    ✓ sum of 2 plus 2 must be 4
```

A hierarquia muda: **arquivo > suite > teste**. Isso escala — com 50 testes, a versao agrupada e navegavel, a solta e uma lista plana.

## O que e uma suite de testes?

O instrutor define: "suite de testes" e o agrupamento logico de testes por assunto. Em Vitest/Jest, a funcao `describe` cria essa suite. Ela recebe:

1. **Um titulo** (string) — identifica a funcionalidade
2. **Uma funcao** (callback) — contem os `test()` relacionados

O `describe` nao executa nada por si so. Ele e puramente organizacional.

## Hierarquia no runner

O instrutor demonstra a hierarquia visual:

```
sum.test.ts          ← arquivo
  sum                ← describe (suite)
    ✓ teste 1        ← test
    ✓ teste 2        ← test
  sum2               ← outro describe
    ✓ teste 3        ← test
```

Cada `describe` cria um nivel na arvore de resultados. Isso e util para:
- Identificar rapidamente ONDE falhou (qual funcionalidade)
- Agrupar setup/teardown com `beforeEach`/`afterEach` por suite
- Filtrar execucao por suite

## Quando NAO usar describe

O instrutor cria e depois deleta um segundo `describe('sum2', ...)` — apenas para demonstrar multiplas suites. Isso sugere que `describe` so faz sentido quando ha massa critica de testes. Um unico teste solto nao precisa de suite.

## Analogia mental

Pense no `describe` como uma pasta no sistema de arquivos. Voce nao cria uma pasta para um unico arquivo. Mas quando tem 3+ arquivos relacionados, a pasta organiza. O `describe` faz o mesmo com testes.