# Code Examples: Criando e Conectando Arquivo JavaScript

## Exemplo 1: Setup basico (exato da aula)

### index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convert</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- conteudo HTML do projeto -->

  <script src="scripts.js"></script>
</body>
</html>
```

### scripts.js (teste de conexao)
```javascript
console.log("javascript carregado")
```

### Verificacao no navegador
1. Abrir index.html no navegador
2. Botao direito > Inspecionar
3. Ir na aba Console
4. Deve aparecer: `javascript carregado`

### scripts.js (apos confirmacao — limpo)
```javascript
// arquivo pronto para receber o codigo do projeto
```

## Exemplo 2: Variacao com multiplos scripts

```html
<body>
  <h1>Meu App</h1>

  <!-- bibliotecas externas primeiro -->
  <script src="libs/utils.js"></script>
  <!-- seu codigo por ultimo -->
  <script src="scripts.js"></script>
</body>
```

## Exemplo 3: Erro comum — script no head

```html
<!-- ERRADO: pode causar gargalo -->
<head>
  <script src="scripts.js"></script>
</head>
```

Se o `scripts.js` tenta acessar elementos do DOM, vai falhar porque o HTML ainda nao foi parseado:

```javascript
// scripts.js
const titulo = document.querySelector("h1")
console.log(titulo) // null — elemento ainda nao existe!
```

## Exemplo 4: Alternativa moderna com defer

```html
<head>
  <!-- defer: baixa em paralelo, executa apos HTML pronto -->
  <script defer src="scripts.js"></script>
</head>
```

Comportamento identico a colocar no final do body, mas permite que o download comece antes.

## Exemplo 5: Console.log para debug de fluxo

```javascript
function calcularTotal(preco, quantidade) {
  console.log("entrou na funcao calcularTotal")
  console.log("preco:", preco, "quantidade:", quantidade)

  const total = preco * quantidade
  console.log("total calculado:", total)

  return total
}
```

Apos confirmar que tudo funciona, remover todos os console.log:

```javascript
function calcularTotal(preco, quantidade) {
  return preco * quantidade
}
```