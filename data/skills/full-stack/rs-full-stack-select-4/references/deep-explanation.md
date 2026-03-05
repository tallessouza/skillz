# Deep Explanation: Select com Query Builder (Knex.js)

## Por que method chaining sobre raw?

O instrutor demonstra propositalmente as duas abordagens — primeiro `knex.raw("SELECT * FROM courses")` e depois `knex("courses").select()` — para mostrar que o resultado é idêntico, mas a segunda forma é superior.

A razão é **composabilidade**: com method chaining, você adiciona comportamentos encadeando métodos. O instrutor mostra isso ao vivo — após o `.select()`, ele simplesmente adiciona `.orderBy("name")` na sequência. Com raw, você teria que reescrever a string SQL inteira.

Nas palavras do instrutor: *"veja que aqui a gente vai adicionando os métodos pra gente chegar no resultado que a gente quer"* — essa é a essência do query builder.

## Como o orderBy funciona

O `orderBy` aceita dois parâmetros:
1. **Coluna** (string) — por qual coluna ordenar
2. **Direção** (string, opcional) — `"asc"` ou `"desc"`

### Comportamento por tipo de dado:
- **Texto:** `asc` = A a Z, `desc` = Z a A
- **Números:** `asc` = menor para maior, `desc` = maior para menor

O instrutor demonstra com a coluna `name` (texto): quando usa `desc`, "JavaScript" aparece antes de "HTML" (J > H alfabeticamente invertido). Quando usa `asc`, "HTML" vem primeiro (ordem alfabética normal).

Ele também mostra rapidamente com `id` (número): `asc` começa do 1.

### Padrão implícito

O `asc` é o padrão quando a direção é omitida. Porém, o instrutor nota que é melhor ser explícito para clareza do código.

## Fluxo completo demonstrado

1. Criar rota GET com `app.get("/courses", async (req, res) => {})`
2. Usar `await` porque a query é assíncrona
3. Guardar resultado em constante (`const courses = ...`)
4. Retornar com `response.json(courses)`
5. Testar no Insomnia criando request GET para `localhost:3303/courses`

## Relação com o INSERT anterior

O instrutor conecta com a aula anterior: os cursos listados no SELECT são os mesmos que foram inseridos via POST. Isso mostra o ciclo completo de escrita e leitura no banco.