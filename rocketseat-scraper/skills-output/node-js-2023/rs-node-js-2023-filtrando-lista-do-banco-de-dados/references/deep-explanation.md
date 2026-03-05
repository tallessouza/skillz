# Deep Explanation: Filtrando Listas do Banco de Dados

## Por que Object.entries?

O instrutor explica que trabalhar com objetos quando voce precisa iterar (percorrer inteiro) e "um pouquinho mais chato" — objetos nao tem metodos como forEach, filter, some nativamente. A solucao e converter com `Object.entries()`.

### Como Object.entries funciona

Dado um objeto:
```javascript
{ name: "Diego", email: "Diego" }
```

`Object.entries()` produz:
```javascript
[
  ["name", "Diego"],
  ["email", "Diego"]
]
```

Cada sub-array tem: indice 0 = chave, indice 1 = valor. Isso permite desestruturar como `([key, value])` no callback.

## O papel do Array.some

O `some` percorre um array e retorna `true` se **pelo menos uma** iteracao retornar true. Isso cria logica OR natural:

- Se `name` contem o termo → inclui o item
- Se `email` contem o termo → inclui o item
- Se nenhum contem → exclui o item

Isso e diferente de `every` (AND) que exigiria match em TODOS os campos.

## O problema do search vazio

O instrutor descobriu um bug apos gravar: quando search nao era enviado, a lista retornava vazia ao inves de retornar todos os usuarios. A causa: o objeto search era construido dentro da rota mesmo sem valor, e o filter rodava com valores undefined.

### Solucao

Mover a logica de construcao do objeto search para a rota, enviando `null` quando nao ha busca:

```javascript
search ? { name: search, email: search } : null
```

E no database, so filtrar se search existir (`if (search)`).

## Case-insensitive: por que nos dois lados

O instrutor destaca que voce precisa normalizar AMBOS os lados da comparacao:

```javascript
row[key].toLowerCase().includes(value.toLowerCase())
```

Se so normalizar um lado, "Diego" vs "diego" ainda falha. Normalizando ambos para minusculo, a comparacao funciona independente de como o dado foi salvo.

## let vs const

Curiosidade mencionada pelo instrutor: o nome `let` vem de "let it change" — indica que o valor pode ser reatribuido. Quando `data` pode ser filtrada (reatribuida), deve ser `let`. Se nunca muda, use `const`.

## Separacao de responsabilidades

O pattern final separa bem:
- **Rota**: decide SE vai filtrar e QUAIS campos
- **Database**: recebe o filtro generico e aplica

O database nao sabe quais campos existem — ele recebe um objeto e aplica. Isso torna o metodo `select` reutilizavel para qualquer tabela.