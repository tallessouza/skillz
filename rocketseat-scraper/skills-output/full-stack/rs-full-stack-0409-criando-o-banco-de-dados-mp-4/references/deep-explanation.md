# Deep Explanation: Banco de Dados JSON com Persistencia

## Por que uma classe e nao um objeto simples?

O instrutor escolhe uma classe porque:
1. **Encapsulamento** — propriedades privadas (`#database`) impedem acesso direto aos dados
2. **Metodos como API** — `insert`, `select` sao a interface publica; `#persist` e interno
3. **Instanciacao** — `new Database()` dispara o construtor que auto-cria o arquivo
4. **Compartilhamento** — uma unica instancia e passada para todas as rotas, garantindo consistencia

## O padrao construtor com readFile + catch

```javascript
constructor() {
  fs.readFile(databasePath, 'utf-8')
    .then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
}
```

**Fluxo:**
1. Tenta ler o arquivo `db.json`
2. Se existe → faz `JSON.parse` (texto → JSON) e carrega em memoria
3. Se nao existe → `catch` chama `#persist()` que faz `writeFile` criando o arquivo vazio (`{}`)

O instrutor demonstra isso apagando o arquivo e reiniciando o servidor — o arquivo reaparece automaticamente com `{}`.

## Por que `new URL()` com `import.meta.url`?

```javascript
const databasePath = new URL('db.json', import.meta.url)
```

- `import.meta.url` retorna o caminho absoluto do arquivo atual (ex: `file:///home/user/src/database/database.js`)
- `new URL('db.json', import.meta.url)` resolve `db.json` **relativo ao arquivo database.js**, nao relativo a onde o `node` foi executado
- Isso e o equivalente ESM do antigo `__dirname + '/db.json'` do CommonJS
- Funciona independente de qual diretorio voce roda `node server.js`

## Por que `node:fs/promises`?

- O prefixo `node:` deixa explicito que e modulo nativo do Node.js, nao uma dependencia de terceiros (npm)
- `/promises` permite usar `.then()/.catch()` ou `async/await` em vez de callbacks
- O instrutor usa `.then()` no construtor porque construtores nao podem ser `async`

## Ciclo JSON ↔ Texto

| Direcao | Metodo | Quando |
|---------|--------|--------|
| Texto → JSON | `JSON.parse(data)` | Ao ler o arquivo (construtor) |
| JSON → Texto | `JSON.stringify(this.#database)` | Ao escrever o arquivo (`#persist`) |

O arquivo `db.json` armazena texto. A aplicacao trabalha com objetos JavaScript em memoria. Toda vez que os dados mudam, `#persist()` converte de volta para texto e salva.

## Compartilhamento da instancia

```javascript
const database = new Database() // UMA instancia

// Passada para TODAS as rotas
handleRoute({ request, response, database })
```

O instrutor enfatiza: todas as rotas devem usar **a mesma referencia**. Se cada rota criasse `new Database()`, teriam copias independentes e dados inconsistentes.

## Convencao de nomenclatura

- `Database` (maiuscula) = a classe (definicao)
- `database` (minuscula) = a instancia (objeto criado com `new`)
- Isso e convencao padrao em JavaScript/TypeScript

## Encoding utf-8

O segundo parametro do `readFile` e `'utf-8'` — o conjunto de caracteres usado para interpretar o conteudo do arquivo. Sem isso, `readFile` retornaria um Buffer em vez de string.