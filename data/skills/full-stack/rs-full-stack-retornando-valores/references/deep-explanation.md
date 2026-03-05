# Deep Explanation: Retornando Valores de Funções

## O modelo mental do instrutor

O instrutor apresenta duas abordagens para funcoes que fazem calculos:

1. **Resolver tudo dentro da funcao** — a funcao faz o calculo E exibe o resultado. Simples, mas o valor fica "preso" dentro da funcao.
2. **Retornar o valor** — a funcao faz o calculo e devolve o resultado para quem chamou. O chamador decide o que fazer.

A analogia implicita: a funcao e como um trabalhador. No modelo 1, o trabalhador faz o servico e ja entrega pro cliente final. No modelo 2, o trabalhador faz o servico e devolve o produto pro gerente (chamador), que decide o destino.

## Por que `return` existe

Sem `return`, funcoes sao "caixas pretas" que fazem coisas mas nao produzem valores reutilizaveis. Com `return`, funcoes se tornam **expressoes** — podem ser compostas, encadeadas e combinadas.

## O problema do `undefined` silencioso

O instrutor demonstra explicitamente: ao comentar o `return`, a variavel `response` recebe `undefined`. Isso e perigoso porque:
- JavaScript nao lanca erro quando voce atribui `undefined` a uma variavel
- O bug so aparece quando voce tenta USAR o valor
- Pode estar longe do ponto onde o erro realmente ocorreu

## Duas formas de usar o retorno

1. **Capturar em variavel:** `const response = sum(7, 7)` — quando o valor sera usado mais de uma vez ou precisa de nome semantico
2. **Usar diretamente:** `console.log(sum(5, 6))` — quando o valor e descartavel e usado uma unica vez

O instrutor mostra ambas como validas, sem preferencia dogmatica. A escolha depende do contexto de uso.

## O fluxo do `return`

O instrutor enfatiza: "quem chamou a funcao?" — o `return` devolve o valor para a LINHA que fez a chamada. Isso cria um fluxo mental claro:

```
linha 8: const response = sum(7, 7)
                          ↑ chamou
                          ↓ recebeu 14
```

Entender esse fluxo e fundamental para debugar codigo com funcoes encadeadas.