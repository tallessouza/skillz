# Deep Explanation: Banco de Dados JSON em Node.js

## Por que nao usar um array direto?

O instrutor comeca mostrando o problema: quando voce armazena dados em um array na memoria (`const users = []`), toda vez que o servidor reinicia (e com `--watch` isso acontece a cada save), voce perde tudo.

A solucao em duas etapas:
1. **Esta aula:** Criar uma classe Database que organiza os dados em memoria de forma estruturada
2. **Proxima aula:** Persistir esse objeto em um arquivo JSON fisico

## Por que um objeto e nao um array?

O instrutor explica a decisao de design: se voce usa um array, esta preso a apenas "users". Com um objeto, cada chave funciona como uma "tabela":

```javascript
{
  users: [{ id: 1, name: 'Diego' }, { id: 2, name: 'Mayk' }],
  posts: [{ id: 1, title: 'Hello' }],
  comments: [...]
}
```

Isso torna o banco de dados generico — o mesmo codigo serve para qualquer tipo de dado.

## Propriedades privadas com # (Private Class Fields)

O instrutor faz questao de ensinar esse conceito do JavaScript moderno. O `#` antes do nome torna a propriedade inacessivel fora da classe:

```javascript
const db = new Database()
db.#database // SyntaxError — nao pode acessar
db.database  // undefined — nao existe como propriedade publica
```

A motivacao: os metodos `insert` e `select` sao a "porta de entrada" da classe. Ninguem deve manipular o objeto `#database` diretamente, porque isso quebraria a logica de persistencia (que sera adicionada depois).

O instrutor faz uma brincadeira sobre o simbolo `#`: "Se voce e musico, e um sustenido. Se e das midias sociais, e uma hashtag. Se nao, e uma cerquilha, jogo da velha..."

## O pattern de verificacao no insert

```javascript
if (Array.isArray(this.#database[table])) {
  this.#database[table].push(data)
} else {
  this.#database[table] = [data]
}
```

Isso e necessario porque na primeira insercao em uma tabela, a chave nao existe no objeto. Sem essa verificacao, `this.#database['users'].push(data)` daria erro de "Cannot read property push of undefined".

## O pattern de fallback no select

```javascript
const data = this.#database[table] ?? []
return data
```

O operador `??` (nullish coalescing) retorna `[]` quando a tabela nao existe. O instrutor enfatiza: "eu nao quero que quando o usuario faca um SELECT possa retornar undefined". Isso facilita o consumo — quem chama `select` sempre recebe um array iteravel.

## Conexao com o servidor

A substituicao no servidor e direta:
- `users.push(...)` → `database.insert('users', ...)`
- `users` (o array) → `database.select('users')`

O nome da tabela ('users') e passado como string, tornando tudo dinamico.