# Deep Explanation: Logica de Preenchimento de Estrelas

## Por que separar signal de computed?

O instrutor enfatiza a separacao entre `currentRating` (signal puro) e `starsStatusField` (computed). O `currentRating` guarda apenas um numero — a selecao do usuario. O `starsStatusField` **deriva** um array booleano a partir desse numero.

Essa separacao e fundamental porque:
- O `computed` reage automaticamente quando `currentRating` muda
- Nao precisamos chamar manualmente nenhuma funcao de "refresh"
- O Angular sabe exatamente quando re-renderizar

## A logica do map explicada passo a passo

O instrutor percorre a logica com detalhe:

```
currentRating = 5
Array base: [0, 1, 2, 3, 4]

Map executa:
- index 0 < 5? → true  (estrela 1 preenchida)
- index 1 < 5? → true  (estrela 2 preenchida)
- index 2 < 5? → true  (estrela 3 preenchida)
- index 3 < 5? → true  (estrela 4 preenchida)
- index 4 < 5? → true  (estrela 5 preenchida)

Resultado: [true, true, true, true, true]
```

Quando `currentRating = 0`:
```
- index 0 < 0? → false
- index 1 < 0? → false
- index 2 < 0? → false
- index 3 < 0? → false
- index 4 < 0? → false

Resultado: [false, false, false, false, false]
```

Quando `currentRating = 3`:
```
- index 0 < 3? → true
- index 1 < 3? → true
- index 2 < 3? → true
- index 3 < 3? → false
- index 4 < 3? → false

Resultado: [true, true, true, false, false]
```

## Por que index + 1?

O array comeca em 0, mas o rating vai de 1 a 5. Se o usuario clica na terceira estrela (index 2), o rating e 3, nao 2. Por isso sempre somamos 1 antes de enviar ao `updateRating`.

Esse valor (1-5) e tambem o que sera enviado ao backend para processar a avaliacao.

## O toggle (zerar ao reclicar)

O instrutor implementa um comportamento de UX importante: se o usuario clica na mesma estrela que ja esta selecionada, o rating zera. Isso permite "desmarcar" a avaliacao.

A logica e simples:
- `newRating === currentRating()` → set(0)
- `newRating !== currentRating()` → set(newRating)

Quando seta 0, o computed recalcula e retorna `[false, false, false, false, false]`, removendo o preenchimento visual.

## Como o preenchimento visual funciona

O template usa class binding:
- `[class.filled]="field"` → quando `field` e `true`, aplica a classe CSS que preenche a estrela
- `[class.empty]="!field"` → quando `field` e `false`, aplica a classe CSS da estrela vazia

O `@for` itera sobre o array booleano retornado pelo computed, criando um SVG para cada estrela.

## Fluxo completo de reatividade

```
Usuario clica na estrela 3
    ↓
updateRating(3) chamado (index 2 + 1)
    ↓
currentRating.set(3)
    ↓
computed detecta mudanca em currentRating
    ↓
starsStatusField recalcula: [true, true, true, false, false]
    ↓
Template re-renderiza com novas classes
    ↓
Estrelas 1-3 preenchidas, 4-5 vazias
```

## Conexao com o backend

O instrutor menciona que o proximo passo e enviar o valor de `currentRating()` para o backend via HTTP. O array booleano e apenas para display — o backend recebe o numero (1-5).