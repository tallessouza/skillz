# Deep Explanation: Removendo um Ticket

## Por que splice e nao filter?

O instrutor usa `splice(index, 1)` em vez de `filter()`. A razao e arquitetural: o array no banco de dados e mutado in-place. Com `filter()`, voce cria um array novo e precisa reatribuir a referencia — o que quebra o encapsulamento da classe database que mantem `this.#database[table]` como referencia privada.

```javascript
// filter() cria novo array — a referencia antiga fica orfã
this.#database[table] = this.#database[table].filter(row => row.id !== id)

// splice() muta o array existente — a referencia continua valida
this.#database[table].splice(index, 1)
```

O segundo argumento do splice e crucial: `splice(index, 1)` remove exatamente 1 elemento. Se voce colocar `splice(index, 3)`, remove 3 elementos a partir daquele indice. Sem o segundo argumento, remove tudo do indice ate o final.

## Padrao de controller dedicado

Cada operacao CRUD tem seu proprio arquivo controller:
- `create.js` — POST
- `index.js` — GET (listar)
- `update.js` — PUT
- `close.js` — PATCH (atualizar parcial)
- `remove.js` — DELETE

Isso segue o principio de responsabilidade unica. Cada controller faz uma coisa e faz bem.

## Por que response.end() sem body?

O padrao HTTP para DELETE bem-sucedido e retornar 200 OK sem conteudo. O cliente ja sabe qual recurso deletou (ele enviou o ID). Retornar o objeto deletado ou `{ deleted: true }` e redundante.

Alternativas validas:
- `204 No Content` — mais semanticamente correto
- `200 OK` com `response.end()` — o que o instrutor usa

## Fluxo completo da requisicao

1. Cliente envia `DELETE /tickets/:id` (sem body)
2. Rota extrai o ID dos params e chama o controller
3. Controller chama `database.delete("tickets", id)`
4. Database busca o indice com `findIndex`
5. Se encontrou (`index > -1`), faz `splice(index, 1)`
6. Database persiste o arquivo JSON atualizado
7. Controller retorna `response.end()` (200 OK, sem body)

## Testando com Insomnia

O instrutor demonstra:
1. Criar request HTTP com metodo DELETE
2. URL: `http://localhost:3333/tickets/{id}`
3. Sem body na requisicao
4. Verificar no index (GET /tickets) que o recurso sumiu
5. Verificar no db.json que o arquivo foi atualizado

## Reutilizacao do padrao findIndex

O mesmo padrao de busca por indice usado no `update` e reutilizado no `delete`:

```javascript
const index = this.#database[table].findIndex(row => row.id === id)
if (index > -1) {
  // operacao no registro encontrado
}
```

Isso evita duplicacao e garante consistencia na validacao de existencia.