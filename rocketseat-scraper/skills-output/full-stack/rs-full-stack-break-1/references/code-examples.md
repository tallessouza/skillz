# Code Examples: Break

## 1. Switch case completo (exemplo da aula)

```javascript
const option = 3

switch (option) {
  case 1:
    console.log("Cadastrar")
    break
  case 2:
    console.log("Atualizar")
    break
  case 3:
    console.log("Remover")
    break
  default:
    console.log("Opção inválida")
}
// Output: "Remover"
```

### Testando cada valor:
- `option = 1` → "Cadastrar"
- `option = 2` → "Atualizar"
- `option = 3` → "Remover"
- `option = 4` → "Opção inválida"

## 2. Switch SEM break (demonstrando fall-through)

```javascript
const option = 1

switch (option) {
  case 1:
    console.log("Cadastrar")
  case 2:
    console.log("Atualizar")
  case 3:
    console.log("Remover")
  default:
    console.log("Opção inválida")
}
// Output: "Cadastrar", "Atualizar", "Remover", "Opção inválida"
```

Com `option = 2`:
```
// Output: "Atualizar", "Remover", "Opção inválida"
```

## 3. For loop com break (exemplo da aula)

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break
  }
  console.log(i)
}
// Output: 0, 1, 2, 3, 4
```

## 4. Diferença de posição do console.log

### Break ANTES do log (5 não aparece):
```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break
  console.log(i)
}
// 0, 1, 2, 3, 4
```

### Log ANTES do break (5 aparece):
```javascript
for (let i = 0; i < 10; i++) {
  console.log(i)
  if (i === 5) break
}
// 0, 1, 2, 3, 4, 5
```

## 5. Variação: buscar item em array

```javascript
const users = ["Ana", "Bruno", "Carlos", "Diana"]
let found = null

for (let i = 0; i < users.length; i++) {
  if (users[i] === "Carlos") {
    found = users[i]
    break // Não precisa verificar Diana
  }
}

console.log(found) // "Carlos"
```

## 6. Variação: while com break

```javascript
let count = 0

while (true) {
  if (count >= 5) {
    break
  }
  console.log(count)
  count++
}
// 0, 1, 2, 3, 4
```

## 7. Variação: break em loop aninhado (só afeta o interno)

```javascript
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break // Só sai do loop interno
    console.log(`i=${i}, j=${j}`)
  }
}
// i=0, j=0
// i=1, j=0
// i=2, j=0
```

## 8. Fall-through intencional (caso legítimo)

```javascript
const day = "saturday"

switch (day) {
  case "saturday":
  case "sunday":
    // fall-through intencional: ambos são fim de semana
    console.log("Fim de semana")
    break
  default:
    console.log("Dia útil")
}
```