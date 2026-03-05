# Deep Explanation: Exibindo Todos os Registros

## Por que convenções de nomenclatura importam

O instrutor destaca que existe um padrão amplamente adotado na comunidade para nomear controllers CRUD:

| Nome | Operação | Método HTTP |
|------|----------|-------------|
| `index` | Listar todos | GET |
| `create` | Criar novo | POST |
| `show` | Exibir um | GET /:id |
| `update` | Atualizar | PUT/PATCH /:id |
| `remove` | Remover | DELETE /:id |

Essa convenção vem do Rails e foi adotada em praticamente todo ecossistema web. Quando outro dev abre a pasta `controllers/tickets/` e vê `index.js`, sabe instantaneamente que ali está a listagem. Não precisa ler o código.

O instrutor enfatiza: "Você pode escolher o nome que quiser, mas vai perceber em outras APIs por aí que é comum utilizar esses termos." Isso é pragmatismo — seguir convenções reduz atrito em times e ao ler código alheio.

## O padrão de organização: um arquivo por operação

A estrutura proposta é:

```
controllers/
  tickets/
    create.js    → POST /tickets
    index.js     → GET /tickets
    show.js      → GET /tickets/:id (futuro)
    update.js    → PUT /tickets/:id (futuro)
    remove.js    → DELETE /tickets/:id (futuro)
```

Cada arquivo exporta uma única função com o mesmo nome do arquivo. Isso cria uma correspondência 1:1 entre arquivo e responsabilidade.

## O método select e o fallback com array vazio

O instrutor implementa o `select` no banco de dados retornando `this.#database[table] ?? []`. O fallback é importante porque:

1. Na primeira execução, antes de qualquer insert, a tabela pode não existir no objeto `#database`
2. Retornar `undefined` causaria erro no controller ao tentar serializar
3. Um array vazio é o contrato correto — "não há registros" é diferente de "erro"

## O fluxo completo da requisição de listagem

```
Cliente (Insomnia) → GET /tickets
  → Router identifica método GET + path /tickets
    → Chama controller index({ request, response, database })
      → database.select('tickets') retorna array
        → response.end(JSON.stringify(tickets))
          → Cliente recebe JSON com array de tickets
```

## Mesmo path, métodos diferentes

O instrutor mostra que `/tickets` serve tanto para POST (criar) quanto para GET (listar). Essa é a essência do REST: o recurso é identificado pela URL, e a operação pelo método HTTP. Não é `/tickets/list` vs `/tickets/create` — é `GET /tickets` vs `POST /tickets`.

## Testando com Insomnia

O instrutor demonstra o fluxo de teste:
1. Criar uma nova requisição HTTP no Insomnia
2. Definir método como GET
3. Usar a mesma URL do POST (`http://localhost:PORT/tickets`)
4. Verificar que retorna os registros cadastrados
5. Adicionar mais um registro via POST e verificar novamente com GET

Esse fluxo de "criar dados → listar → verificar" é essencial para validar que tanto o insert quanto o select funcionam corretamente juntos.