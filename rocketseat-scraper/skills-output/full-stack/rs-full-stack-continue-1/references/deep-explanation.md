# Deep Explanation: Continue em Estruturas de Repetição

## Modelo mental do instrutor

O `continue` funciona como um "próximo!" numa fila de atendimento. Quando o atendente (loop) olha para a pessoa da vez (iteração) e vê que não precisa atendê-la, ele grita "próximo!" e pula para a pessoa seguinte. O `break` seria o atendente fechando o guichê — ninguém mais é atendido.

## Como o continue funciona internamente

Quando o JavaScript encontra `continue`:

1. **Para a execução** do código restante dentro do bloco do loop naquela iteração
2. **Volta ao início** do loop
3. **Executa a expressão de atualização** (no `for`, executa o `i++`)
4. **Avalia a condição** (no `for`, verifica `i < 10`)
5. **Continua normalmente** se a condição ainda for verdadeira

Isso significa que o `continue` NÃO pula o incremento. No exemplo do instrutor:

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) continue
  console.log(i)
}
```

Quando `i === 5`:
- Entra no `if`, executa `continue`
- Pula o `console.log(i)` — é por isso que 5 não aparece
- Volta ao início do `for`, executa `i++` (agora `i === 6`)
- Verifica `6 < 10` → true, continua
- Resultado: 0, 1, 2, 3, 4, 6, 7, 8, 9

## Diferença crucial: continue vs break

| Aspecto | `continue` | `break` |
|---------|-----------|---------|
| O que encerra | Apenas a iteração atual | O loop inteiro |
| O que acontece depois | Vai para a próxima iteração | Sai do loop completamente |
| Analogia | "Pula esse, vai pro próximo" | "Para tudo" |
| Uso típico | Filtrar/ignorar itens | Encontrou o que queria, para de procurar |

## Edge cases importantes

### continue em while — cuidado com incremento

```javascript
// BUG: loop infinito!
let i = 0
while (i < 10) {
  if (i === 5) continue  // pula o i++ abaixo, i fica 5 pra sempre
  console.log(i)
  i++
}

// CORRETO: incrementar ANTES do continue
let i = 0
while (i < 10) {
  if (i === 5) {
    i++
    continue
  }
  console.log(i)
  i++
}
```

No `for`, isso não é problema porque a expressão de atualização (`i++`) é executada automaticamente ao dar `continue`. No `while`, o incremento manual pode ser pulado.

### continue com label (loops aninhados)

```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer  // pula para a próxima iteração do loop EXTERNO
    console.log(i, j)
  }
}
// Output: 0,0 / 1,0 / 2,0
```

### continue em forEach — NÃO funciona

```javascript
// ERRO CONCEITUAL: continue não funciona em forEach
[1, 2, 3].forEach(num => {
  if (num === 2) continue  // SyntaxError!
})

// Use return ao invés (funciona como "continue" no forEach)
[1, 2, 3].forEach(num => {
  if (num === 2) return
  console.log(num) // 1, 3
})
```

## Quando usar continue vs alternativas funcionais

- **`continue` em for/while:** quando precisa de controle de fluxo imperativo, performance crítica, ou precisa de `break` no mesmo loop
- **`.filter()` + `.map()`:** quando está transformando arrays e quer código declarativo
- **`.reduce()`:** quando está acumulando valores e quer pular certos itens

O instrutor usa `continue` no contexto de loops `for` tradicionais, que é o caso de uso mais claro e direto.