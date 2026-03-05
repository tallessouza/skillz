# Code Examples: O que são Variáveis

## Exemplo básico — criando variáveis

```javascript
// Reservando "gavetas" na memória com nomes descritivos
let nomeDoProduto = "Camiseta"
let preco = 49.90
let quantidade = 3
let total = preco * quantidade
```

O instrutor menciona esses exemplos conceituais: guardar nome, preço, quantidade e total. Cada variável tem um propósito claro pelo nome.

## Exemplo — variável pode variar (reatribuição)

```javascript
// Gaveta começa com "meia"
let conteudoGaveta = "meia"
console.log(conteudoGaveta) // "meia"

// Substitui o conteúdo — agora guarda "camiseta"
conteudoGaveta = "camiseta"
console.log(conteudoGaveta) // "camiseta"
```

## Exemplo — tipagem dinâmica do JavaScript

```javascript
// JavaScript permite trocar até o tipo do conteúdo
let gaveta = "meia"       // string
gaveta = 42               // number (permitido em JS)
gaveta = true             // boolean (também permitido)
```

Em linguagens com tipagem estática (TypeScript em modo strict, Java, C), isso causaria erro. JavaScript permite por ser dinamicamente tipada.

## Analogia em código — armário com etiquetas

```javascript
// Armário organizado (bons nomes)
let camisa = "Polo azul"
let meia = "Par branco"
let calca = "Jeans escuro"

// Armário bagunçado (nomes genéricos) — evitar
let a = "Polo azul"
let b = "Par branco"
let c = "Jeans escuro"
// Qual é qual? Precisa "abrir a gaveta" (inspecionar o valor) toda vez
```

## Exemplo — variáveis na prática de uma aplicação

```javascript
// Cenário real: carrinho de compras
let nomeCliente = "Maria"
let produtoEscolhido = "Tênis Runner"
let precoProduto = 299.90
let quantidadeDesejada = 2
let totalCompra = precoProduto * quantidadeDesejada

console.log(nomeCliente + " comprou " + quantidadeDesejada + "x " + produtoEscolhido)
console.log("Total: R$ " + totalCompra)
```

## Exemplo — RAM vs persistência (conceitual)

```javascript
// Variável: vive na RAM, temporária
let pontuacaoAtual = 150

// Quando o programa termina ou o computador desliga,
// pontuacaoAtual desaparece

// Para persistir, seria necessário salvar em arquivo ou banco de dados
// (conceito que será visto em aulas futuras)
```

## Variações da analogia para diferentes contextos

### Calculadora
```javascript
let primeiroNumero = 10
let segundoNumero = 5
let resultado = primeiroNumero + segundoNumero
// "resultado" é a gaveta onde guardamos a resposta para usar depois
```

### Formulário de cadastro
```javascript
let nome = "João Silva"
let email = "joao@email.com"
let idade = 28
// Cada campo do formulário → uma variável → uma gaveta etiquetada
```

### Jogo simples
```javascript
let vidas = 3
let pontos = 0
let nivel = 1

// Variáveis mudam conforme o jogo avança
pontos = pontos + 100  // ganhou pontos
vidas = vidas - 1      // perdeu uma vida
nivel = nivel + 1       // subiu de nível
```