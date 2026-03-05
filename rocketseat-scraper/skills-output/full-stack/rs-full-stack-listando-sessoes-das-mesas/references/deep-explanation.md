# Deep Explanation: Listando Sessoes Das Mesas

## Por que o metodo se chama `index`

Na convencao REST, cada operacao CRUD tem um nome padrao no controller:

| Operacao | Metodo HTTP | Nome do metodo |
|----------|-------------|----------------|
| Listar todos | GET / | `index` |
| Buscar um | GET /:id | `show` |
| Criar | POST / | `create` |
| Atualizar | PUT /:id | `update` |
| Deletar | DELETE /:id | `delete` |

O instrutor segue essa convencao consistentemente — o metodo de criacao ja existia como `create`, e o de listagem e `index`.

## Estrutura do controller

O padrao usado pelo instrutor para todo metodo de controller:

```typescript
async nomeDoMetodo(request: Request, response: Response, next: NextFunction) {
  try {
    // logica
    return response.json(resultado)
  } catch (error) {
    next(error)
  }
}
```

Pontos importantes:
- **async** porque usa await para queries do Knex
- **request, response, next** — sempre os tres parametros, mesmo que request nao seja usado no index
- **try/catch com next(error)** — delega ao middleware de erro centralizado em vez de tratar localmente
- **return response.json()** — retorna JSON diretamente

## O erro do typo: licao pratica

O instrutor cometeu um erro ao vivo — escreveu `table_session` (sem o "s" final) em vez de `table_sessions`. Isso causou um erro que so foi percebido ao testar no Insomnia.

Licao: **nomes de tabelas no Knex sao strings literais** — nao ha validacao em tempo de compilacao. Um typo so aparece em runtime. Por isso:

1. Sempre teste apos implementar
2. Considere usar constantes para nomes de tabelas
3. Verifique o plural/singular do nome

## orderBy: por que e importante

Sem `orderBy`, o banco de dados retorna registros em ordem arbitraria (geralmente ordem de insercao, mas nao garantido). O instrutor ordena por `closed_at` (data de fechamento) para que sessoes mais recentes aparecam em posicao previsivel.

## select() do Knex: quando usar

O instrutor demonstrou duas formas:

1. **Sem select** — retorna todas as colunas (equivale a `SELECT *`)
2. **Com select** — retorna apenas as colunas especificadas

```typescript
// Retorna tudo
await knex("table_sessions").orderBy("closed_at")

// Retorna apenas id e table_id
await knex("table_sessions").select("id", "table_id").orderBy("closed_at")
```

A dica do instrutor: "o select voce pode usar quando voce quer especificar as colunas. Quero trazer tudo, pode omitir ele."

## Registro da rota

A rota e registrada no arquivo de rotas do resource:

```typescript
tableSessionRoutes.get("/", tableSessionController.index)
```

- GET porque e listagem (leitura)
- "/" porque e a raiz do resource (o prefixo ja foi definido no router pai)
- Aponta para o metodo `index` do controller