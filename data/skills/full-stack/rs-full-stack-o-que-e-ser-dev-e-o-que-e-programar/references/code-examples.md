# Code Examples: O Que É Ser Dev e O Que É Programar

## De problema real para código — exemplos concretos

Esta aula é conceitual e não contém código, mas podemos ilustrar o princípio "problema → código" com exemplos simples que conectam a mentalidade ao que o aluno vai aprender no curso.

### Exemplo 1: O problema mais simples do mundo

**Problema real:** Quero saber quanto vou pagar de gorjeta num restaurante.

**Decomposição em passos (algoritmo mental):**
1. Pegar o valor da conta
2. Decidir o percentual de gorjeta
3. Multiplicar o valor pelo percentual
4. Mostrar o resultado

**Tradução para código:**
```javascript
// Cada linha resolve um pedaço do problema
const valorDaConta = 150.00
const percentualGorjeta = 10 / 100

const gorjeta = valorDaConta * percentualGorjeta

console.log(`Gorjeta: R$ ${gorjeta.toFixed(2)}`) // Gorjeta: R$ 15.00
```

O código é literalmente o passo a passo que você pensou — traduzido para uma linguagem que o computador entende.

### Exemplo 2: Problema do iFood simplificado

**Problema real:** O usuário quer ver quanto vai pagar no total do pedido.

**Decomposição:**
1. Listar os itens do pedido
2. Somar os preços
3. Adicionar taxa de entrega
4. Mostrar total

```javascript
const itens = [
  { nome: "Pizza Margherita", preco: 45.90 },
  { nome: "Refrigerante 2L", preco: 12.00 },
  { nome: "Sobremesa", preco: 15.50 }
]

const subtotal = itens.reduce((soma, item) => soma + item.preco, 0)
const taxaEntrega = 8.00
const total = subtotal + taxaEntrega

console.log(`Subtotal: R$ ${subtotal.toFixed(2)}`)  // R$ 73.40
console.log(`Entrega: R$ ${taxaEntrega.toFixed(2)}`) // R$ 8.00
console.log(`Total: R$ ${total.toFixed(2)}`)          // R$ 81.40
```

Perceba: o código resolve o problema passo a passo, exatamente como Mayk descreveu.

### Exemplo 3: Problema do Uber simplificado

**Problema real:** Calcular o preço de uma corrida baseado na distância.

```javascript
const precoBase = 5.00           // taxa fixa
const precoPorKm = 2.50          // preço por quilômetro
const distanciaEmKm = 12         // distância da corrida

const precoCorrida = precoBase + (precoPorKm * distanciaEmKm)

console.log(`Preço da corrida: R$ ${precoCorrida.toFixed(2)}`) // R$ 35.00
```

### O padrão que se repete

Em todos os exemplos, o processo é o mesmo:

```
1. IDENTIFICAR o problema do mundo real
2. DECOMPOR em passos menores
3. TRADUZIR cada passo para código
4. EXECUTAR e verificar o resultado
```

Esse é o trabalho do dev. A linguagem (JavaScript, Python, etc.) é apenas o idioma que você usa no passo 3. A habilidade real está nos passos 1 e 2.