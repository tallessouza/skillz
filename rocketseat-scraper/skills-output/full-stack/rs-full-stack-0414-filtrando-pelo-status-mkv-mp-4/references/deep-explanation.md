# Deep Explanation: Filtrando Resultados por Query Parameters

## Por que encapsular filtros em um objeto?

O instrutor mostra que ao inves de passar cada filtro como parametro separado da funcao (`select(table, status, priority)`), voce cria um unico objeto `filters` com todas as chaves. Isso porque:

1. **Extensibilidade** — adicionar um novo filtro e simplesmente adicionar uma chave ao objeto, sem mudar a assinatura de `select()`
2. **Opcionalidade** — se nenhum filtro existe, passa-se `null` e a funcao sabe que nao precisa filtrar
3. **Genericidade** — a logica de filtragem nao precisa conhecer os campos especificos, ela itera sobre as chaves do objeto

## O padrao ternario para filtros opcionais

```javascript
const filters = status ? { status } : null
```

O instrutor explica que o query param pode nao existir na URL. Entao antes de passar para a camada de dados, verifica-se se o valor existe. Se sim, cria um objeto. Se nao, passa `null`. Isso evita passar um objeto vazio `{}` que causaria `Object.entries` retornar array vazio e o `.some()` retornar `false` para tudo — filtrando todos os registros.

## A cadeia filter → Object.entries → some → includes

Essa e a parte central da aula. O instrutor constroi passo a passo:

### Passo 1: `data.filter(row => ...)`
Itera sobre cada registro do "banco" (array de objetos). Retorna apenas os que passam no teste.

### Passo 2: `Object.entries(filters)`
Transforma o objeto `{ status: 'open' }` em `[['status', 'open']]`. O instrutor mostra isso com `console.log` — cada entry e um array com `[chave, valor]`.

### Passo 3: `.some(([key, value]) => ...)`
Usa desestruturacao para separar chave e valor. O `.some()` retorna `true` se **pelo menos um** dos filtros bate. O instrutor explica: "ele testa se ao menos um dos elementos no array passa no teste".

### Passo 4: `row[key].toLowerCase().includes(value.toLowerCase())`
Acessa dinamicamente a propriedade do registro usando a chave do filtro. Normaliza para minusculo para evitar problemas de casing. Usa `includes` para matching parcial (substring).

## Por que toLowerCase em ambos os lados?

O instrutor explica: "pode ser que la da API venha a primeira letra maiuscula ou tem alguma letra maiuscula". Entao normaliza-se tanto o valor do registro quanto o valor do filtro para minusculo antes de comparar. Isso previne bugs sutis onde `"Open" !== "open"`.

## O uso de let em vez de const para data

```javascript
let data = this.#database[table] ?? []
```

O instrutor usa `let` porque o valor de `data` pode ser reatribuido apos a filtragem. Se usasse `const`, nao poderia fazer `data = data.filter(...)`. Isso e intencional — a variavel e mutada condicionalmente.

## Processo de debug do instrutor

O instrutor demonstra um processo pedagogico importante:
1. Primeiro retorna `row` direto (sem filtro real) para verificar que o `.filter()` funciona
2. Depois adiciona `console.log` do `Object.entries` para ver a estrutura
3. Depois adiciona o `.some()` com `console.log` do resultado booleano
4. Testa com valor que nao existe (`closed`) — ve `false`
5. Testa com valor que existe (`open`) — ve `true`
6. Modifica manualmente o banco para ter valores diferentes e confirma filtragem parcial
7. So entao remove todos os `console.log` e deixa o codigo limpo

Essa abordagem de construir incrementalmente e verificar cada etapa e extremamente valiosa para debugging.