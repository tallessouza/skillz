# Deep Explanation: Removendo Produtos

## Por que verificar existência antes de deletar?

O instrutor demonstra ao vivo o problema: ao tentar deletar o produto com id 3 (que não existe), a API retorna sucesso (200). Do ponto de vista do cliente, a operação foi realizada — mas na verdade nada aconteceu no banco.

Isso é um bug silencioso. O cliente pode pensar que removeu algo que nunca existiu, ou pior, pode estar em um fluxo onde a remoção é pré-requisito para outra ação.

A solução é simples: antes de qualquer operação destrutiva (delete) ou modificadora (update), faça um SELECT para verificar se o registro existe.

## O papel crítico do `await`

O instrutor mostra um bug real durante a aula: ele implementou a verificação de existência no update mas esqueceu o `await`. O resultado:

```typescript
// SEM await — BUG
const product = knex("products").select().where({ id }).first()
// product é uma Promise (truthy), então !product é false
// a verificação NUNCA dispara
if (!product) {
  throw new AppError("Product not found") // nunca executa
}
```

Sem `await`, `product` é uma Promise — que é um objeto, portanto truthy. A verificação `!product` sempre retorna false, e o código segue como se o produto existisse.

Com `await`, o código espera a resolução da Promise e recebe `undefined` quando o registro não existe, fazendo a verificação funcionar corretamente.

O instrutor enfatiza: "Olha como o await é importante — como não tinha o await, ele pulou e seguiu a vida, ele não esperou aqui esse select."

## Por que usar `.first()`

O Knex por padrão retorna um array de resultados. Quando você busca por id (que é único), não faz sentido trabalhar com array.

- Sem `.first()`: resultado é `[{ id: 1, name: "..." }]` — um array
- Com `.first()`: resultado é `{ id: 1, name: "..." }` — um objeto direto

Vantagens do `.first()`:
1. Acesso direto às propriedades (`product.name` em vez de `product[0].name`)
2. Retorna `undefined` quando não encontra (útil para verificação de existência)
3. TypeScript infere o tipo correto do objeto

## Padrão: mesma verificação para update e delete

O instrutor aplica a MESMA lógica de verificação tanto no delete quanto no update. Isso é intencional — qualquer operação que depende de um registro existente deve verificar sua existência antes.

O padrão é idêntico:
1. Extrair id dos params
2. SELECT + WHERE + FIRST
3. Se não existe, lançar AppError
4. Se existe, executar a operação (delete ou update)

## Fluxo completo controller → rota → teste

O instrutor segue um padrão consistente:
1. Implementa o método no controller (com async/await, try/catch)
2. Registra a rota com o verbo HTTP correto (`productRoutes.delete("/:id", ...)`)
3. Testa no Insomnia para validar tanto o caso de sucesso quanto o de erro