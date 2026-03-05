# Deep Explanation: IT vs Test

## Por que `it` e mais semantico

O `it` e o `test` fazem exatamente a mesma coisa — ambos sao funcoes que criam um caso de teste. A diferenca e puramente de leitura.

Quando voce usa `test`, o titulo fica:
- `test('testa a soma de 2 mais 2')` — leitura: "testa a soma de 2 mais 2"

Quando voce usa `it`, o titulo fica:
- `it('should return 4 when adding 2 and 2')` — leitura: "it should return 4 when adding 2 and 2"

O `it` cria uma frase em terceira pessoa que descreve o **comportamento esperado** do sistema. Isso e mais alinhado com BDD (Behavior-Driven Development).

## Alias — mesmo resultado

Ao executar os testes, o output e identico. Nao ha diferenca de performance, funcionalidade ou compatibilidade. A escolha e 100% sobre legibilidade e convencao.

## Convencao da comunidade

A maioria dos projetos JavaScript/TypeScript modernos usa `it` como padrao. O `test` existe como alternativa para quem prefere, mas `it` e mais comum em codebases profissionais.

## Watch mode

O instrutor demonstrou que ambos funcionam com watch mode (`--watch` flag). Ao salvar o arquivo, o teste re-executa automaticamente independente de usar `it` ou `test`.

## Quando `test` faz sentido

Em raros casos onde a descricao nao se encaixa no padrao "it should...", `test` pode ser mais natural. Mas na pratica, quase sempre e possivel reformular para `it('should ...')`.