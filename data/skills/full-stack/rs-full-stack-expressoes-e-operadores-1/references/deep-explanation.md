# Deep Explanation: Expressoes e Operadores

## Modelo mental do instrutor

O instrutor apresenta expressoes como um **quebra-cabeca** ou **pecas de LEGO**. Cada peca individual (operando ou operador) nao faz sentido sozinha — e a combinacao que gera significado (o valor resultante).

Essa analogia e poderosa porque:
1. Reforça que expressoes sao **composicionais** — pecas menores formam pecas maiores
2. Mostra que a ordem importa — assim como no LEGO, a sequencia de encaixe altera o resultado
3. Torna tangivel um conceito abstrato — "avaliar uma expressao" vira "montar o quebra-cabeca"

## Cadeia conceitual

```
Operandos (valores/variaveis)
       +
Operadores (simbolos)
       =
Expressao (combinacao que produz valor)
```

O instrutor enfatiza que **operandos** nao sao apenas numeros literais — podem ser variaveis. Isso e importante porque prepara o aluno para entender que expressoes podem ser arbitrariamente complexas, usando resultados de funcoes, propriedades de objetos, etc.

## Tipos de operacoes mencionados

1. **Aritmeticas** — soma, subtracao, multiplicacao, divisao (contas matematicas)
2. **Logicas** — comparacao de valores (igual, menor, maior)
3. **Atribuicao** — guardar um valor em uma variavel

O instrutor menciona que existem mais tipos que serao vistos ao longo do curso, indicando que esta aula e a base conceitual sobre a qual operadores mais avancados (ternario, spread, nullish coalescing) serao construidos.

## Por que essa base importa

Sem entender a distincao operando/operador/expressao, o aluno nao consegue:
- Ler mensagens de erro que mencionam "unexpected token" ou "invalid left-hand side"
- Entender precedencia de operadores (qual operacao executa primeiro)
- Debugar expressoes complexas quebrando-as em partes

## Edge cases nao mencionados mas relevantes

- **Precedencia**: `5 + 3 * 7` nao e o mesmo que `(5 + 3) * 7` — multiplicacao tem precedencia sobre soma
- **Coercao de tipos**: `"5" + 3` resulta em `"53"` (string), nao `8` — o operador `+` com string concatena
- **Short-circuit**: Em expressoes logicas, `false && funcao()` nunca executa `funcao()`