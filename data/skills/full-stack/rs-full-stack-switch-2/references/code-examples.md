# Code Examples: Switch Case em JavaScript

## Exemplo 1: Estrutura basica da aula

Evolucao passo a passo como o instrutor construiu:

### Passo 1 — Sem break (demonstrando o problema)

```javascript
let option = 1

switch (option) {
  case 1:
    console.log("Consultar pedido")
  case 2:
    console.log("Falar com atendente")
}
// Output: "Consultar pedido" E "Falar com atendente"
// Bug! Ambos executam porque nao ha break
```

### Passo 2 — Com break

```javascript
let option = 1

switch (option) {
  case 1:
    console.log("Consultar pedido")
    break
  case 2:
    console.log("Falar com atendente")
    break
  case 3:
    console.log("Cancelar pedido")
    break
}
// Output: apenas "Consultar pedido"
```

### Passo 3 — Tentativa errada de cobrir invalidos

```javascript
// NAO FACA ISSO — impossivel cobrir todos os valores
switch (option) {
  case 1:
    console.log("Consultar pedido")
    break
  case 2:
    console.log("Falar com atendente")
    break
  case 3:
    console.log("Cancelar pedido")
    break
  case 4:
    console.log("Opção inválida")
    break
  case 5:
    console.log("Opção inválida")
    break
  // E o 6? E o 7? Infinito...
}
```

### Passo 4 — Versao final com default

```javascript
let option = 4

switch (option) {
  case 1:
    console.log("Consultar pedido")
    break
  case 2:
    console.log("Falar com atendente")
    break
  case 3:
    console.log("Cancelar pedido")
    break
  default:
    console.log("Opção inválida")
}
// Output: "Opção inválida"
```

## Exemplo 2: Multiplos comandos por case

```javascript
let option = 1

switch (option) {
  case 1:
    console.log("Consultar pedido")
    console.log("Aguarde...")
    break
  case 2:
    console.log("Falar com atendente")
    break
  default:
    console.log("Opção inválida")
}
// Output: "Consultar pedido" e "Aguarde..."
```

## Exemplo 3: Aplicacao pratica — Status de pedido

```javascript
let status = "enviado"

switch (status) {
  case "pendente":
    console.log("Seu pedido está sendo processado")
    break
  case "enviado":
    console.log("Seu pedido está a caminho")
    break
  case "entregue":
    console.log("Seu pedido foi entregue")
    break
  case "cancelado":
    console.log("Seu pedido foi cancelado")
    break
  default:
    console.log("Status desconhecido")
}
```

## Exemplo 4: Fall-through intencional (agrupamento)

```javascript
let dia = "sabado"

switch (dia) {
  case "segunda":
  case "terca":
  case "quarta":
  case "quinta":
  case "sexta":
    console.log("Dia útil")
    break
  case "sabado":
  case "domingo":
    console.log("Final de semana")
    break
  default:
    console.log("Dia inválido")
}
```

## Exemplo 5: Switch com strings

```javascript
let comando = "sair"

switch (comando) {
  case "ajuda":
    console.log("Lista de comandos disponíveis...")
    break
  case "sair":
    console.log("Encerrando...")
    break
  case "limpar":
    console.log("Tela limpa")
    break
  default:
    console.log("Comando não reconhecido")
}
```