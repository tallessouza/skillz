# Deep Explanation: Propriedades em Classes JavaScript

## O que e `this` em uma classe

O instrutor explica que `this` significa "eu estou me referindo ao contexto onde estou inserido". Dentro de uma classe `Product`, `this` e o proprio `Product` — ou mais precisamente, a instancia que sera criada.

Quando escrevemos:

```javascript
this.name = name
```

Estamos dizendo: "esta instancia da classe agora possui uma propriedade `name`, cujo valor e o parametro `name` recebido no construtor."

## Por que sem `this` a propriedade nao existe

O instrutor demonstra ao vivo: ao comentar a linha `this.name = name`, o `product.name` retorna `undefined`. Isso acontece porque:

1. O parametro `name` do construtor e uma variavel local — vive apenas dentro do escopo da funcao `constructor()`
2. Sem `this.name = name`, nada e "publicado" na instancia
3. A instancia e criada vazia, sem propriedades

E como receber uma encomenda no correio mas nunca colocar na estante — o pacote chegou (parametro), mas voce nao guardou (nao atribuiu via `this`).

## Classes como fabricas de objetos

A analogia central do instrutor: **classes sao fabricas**. Cada `new Product(...)` produz um objeto independente na memoria.

```javascript
const product1 = new Product("Teclado")  // objeto 1 na memoria
const product2 = new Product("Mouse")    // objeto 2 na memoria
```

`product1` e `product2` sao constantes que apontam para lugares diferentes na memoria. Alterar um nao afeta o outro. Essa e a essencia da "instancia" — cada `new` cria uma copia independente com seus proprios valores.

## PascalCase vs camelCase — case-sensitivity

O instrutor destaca a vantagem de usar PascalCase para a classe (`Product`) e camelCase para a instancia (`product`). JavaScript e case-sensitive, entao `Product` e `product` sao identificadores completamente diferentes.

Essa convencao visual permite diferenciar rapidamente:
- `Product` → a fabrica (classe/blueprint)
- `product` → o produto fabricado (instancia)

## O papel do construtor

O construtor e o metodo especial chamado automaticamente quando usamos `new`. E o momento de:
1. Receber dados iniciais (parametros)
2. Configurar o estado da instancia (atribuicoes com `this`)

Todo dado que a instancia precisa ter disponivel deve ser atribuido no construtor via `this`.