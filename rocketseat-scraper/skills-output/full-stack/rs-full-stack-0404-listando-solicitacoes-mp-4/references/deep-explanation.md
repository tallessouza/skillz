# Deep Explanation: Listando e Filtrando Dados com Prisma

## Por que validar query params com Zod

Query parameters chegam como strings da URL. Sem validação, qualquer valor pode entrar na query do banco. O padrão do instrutor é criar um `querySchema` com Zod que:

1. Define o tipo esperado (`z.string()`)
2. Marca como opcional (`.optional()`) porque o usuário pode não passar o parâmetro
3. Define um valor padrão (`.default("")`) para que o código nunca lide com `undefined`

A string vazia como default é intencional: quando usada com `contains`, uma string vazia retorna todos os registros. Isso elimina a necessidade de condicionais `if (name) { ... }` na query.

## Como funciona o `contains` do Prisma

O `contains` é equivalente ao `LIKE '%valor%'` do SQL. Quando o instrutor faz:

```typescript
where: {
  user: {
    name: {
      contains: name.trim(),
    },
  },
}
```

O Prisma gera algo como:
```sql
SELECT * FROM refunds
JOIN users ON refunds.user_id = users.id
WHERE users.name LIKE '%Rodrigo%'
```

O `.trim()` é importante porque parâmetros de URL podem vir com espaços acidentais (encoding de `+` como espaço, por exemplo).

## Navegando relações no `where`

O Prisma permite filtrar por campos de tabelas relacionadas navegando a estrutura do objeto. Se o modelo `Refund` tem uma relação com `User`, você pode filtrar por `user.name` diretamente:

```typescript
where: {
  user: {        // navega para a tabela users
    name: {      // campo na tabela users
      contains: "João"
    }
  }
}
```

Isso só funciona se o relacionamento está definido no `schema.prisma`. O instrutor mostrou no Prisma Studio que cada `Refund` tem um `User` vinculado — essa definição no schema é o que permite a navegação.

## O papel do `include`

Sem `include`, o Prisma retorna apenas os campos da tabela principal. Os dados da solicitação viriam sem informação de quem fez o pedido. Com `include: { user: true }`, o Prisma faz o JOIN e inclui o objeto completo do usuário no resultado.

O instrutor demonstrou isso ao mostrar que inicialmente a listagem não mostrava quem fez a solicitação. Após adicionar o `include`, os dados do usuário (nome, email) apareceram junto com cada refund.

Você pode incluir múltiplas relações:
```typescript
include: {
  user: true,
  category: true,
}
```

## Ordenação com `orderBy`

O `orderBy` aceita `asc` (ascendente — padrão do banco) e `desc` (descendente). Para listagens de registros, quase sempre queremos `desc` no campo de data, porque o usuário espera ver os mais recentes primeiro.

O instrutor demonstrou isso: com `asc`, a primeira solicitação (mais antiga) aparecia primeiro. Trocando para `desc`, a última solicitação criada (Uber do João) apareceu no topo da lista.

## Fluxo completo da aula

1. Começou com `findMany()` simples — lista tudo sem filtro
2. Adicionou validação de query param `name` com Zod
3. Testou que o parâmetro chega corretamente via URL (`?name=Rodrigo`)
4. Implementou `where` com `contains` para filtrar pelo nome do usuário relacionado
5. Adicionou `include: { user: true }` para exibir dados do usuário junto
6. Criou um segundo usuário (João) para testar o filtro com múltiplos registros
7. Adicionou `orderBy: { createdAt: "desc" }` para mostrar mais recentes primeiro
8. Demonstrou que sem parâmetro (ou string vazia), a listagem retorna tudo

## Por que não filtrar no JavaScript

O instrutor sempre faz o filtro no Prisma (banco de dados), nunca busca tudo e filtra no JS. Razões:

- Performance: o banco é otimizado para filtrar, o JS não
- Memória: trazer todos os registros para filtrar desperdiça memória
- Escalabilidade: com milhares de registros, filtrar no JS trava a aplicação
- Paginação: eventualmente você vai paginar, e precisa que o filtro seja no banco