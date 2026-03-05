# Deep Explanation: Calculando o Valor Total

## Por que textContent retorna lixo para calculos

Quando voce usa `element.textContent` em um elemento que exibe um valor monetario como "R$ 45,60", o JavaScript retorna a string completa incluindo o simbolo da moeda, espacos e a virgula como separador decimal. Isso e completamente inutilizavel para calculos matematicos.

Se voce tentar somar strings, o operador `+` faz concatenacao em vez de soma:
```javascript
"R$ 45,60" + "R$ 15,50" = "R$ 45,60R$ 15,50"  // concatenacao, nao soma
```

## A regex `/[^\d.,]/g` explicada

- `/` — inicio da expressao regular
- `[^...]` — o acento circunflexo dentro dos colchetes significa "tudo que NAO for"
- `\d` — qualquer digito (0-9)
- `.,` — ponto e virgula literais (queremos manter esses)
- `/g` — flag global, aplica em toda a string (nao para no primeiro match)

Resultado: remove letras, simbolos de moeda (R$), espacos, e qualquer outro caractere nao numerico, mantendo apenas digitos, pontos e virgulas.

### Por que manter ponto E virgula na regex

O instrutor mantem ambos porque:
1. O valor pode ja estar com ponto (formato ingles)
2. O valor pode estar com virgula (formato brasileiro)
3. Depois da limpeza, um segundo `.replace(",", ".")` normaliza tudo para ponto

## parseFloat vs parseInt

- `parseInt("45.60")` retorna `45` — descarta tudo apos o ponto
- `parseFloat("45.60")` retorna `45.6` — preserva casas decimais

Para valores monetarios, SEMPRE use `parseFloat` porque dinheiro tem centavos.

## Por que Number() apos parseFloat

O instrutor usa `total += Number(value)` mesmo apos `value = parseFloat(value)`. Isso e uma camada extra de garantia:

- `parseFloat` pode retornar `NaN` se a string for completamente invalida
- O guard `isNaN` ja protege contra isso
- `Number()` e uma conversao explicita que deixa claro a intencao

Na pratica, apos o guard `isNaN`, o `Number()` e redundante mas nao causa dano. E um padrao defensivo.

## O padrao do acumulador

```javascript
let total = 0  // FORA do loop — persiste entre iteracoes

for (...) {
  total += value  // cada iteracao ADICIONA ao total existente
}

// Aqui total tem a soma de todos os valores
```

Se `total` fosse declarado DENTRO do loop, seria resetado para 0 a cada iteracao e voce perderia a soma acumulada.

## O operador +=

`total += value` e identico a `total = total + value`. E chamado de "assignment operator" composto. Funciona com todos os operadores aritmeticos:

- `+=` soma e atribui
- `-=` subtrai e atribui
- `*=` multiplica e atribui
- `/=` divide e atribui

## Selecao do elemento para exibir o total

O instrutor seleciona o elemento H2 dentro do header do aside:
```javascript
const expensesTotal = document.querySelector("aside header h2")
```

E atribui o total calculado via `textContent`:
```javascript
expensesTotal.textContent = total
```

Nesta aula o valor aparece sem formatacao (ex: `61.1` em vez de `R$ 61,10`). A formatacao e feita na aula seguinte.