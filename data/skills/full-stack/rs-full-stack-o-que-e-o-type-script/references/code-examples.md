# Code Examples: O Que é o TypeScript

## JavaScript não tipado — o problema

```javascript
// JavaScript aceita qualquer valor em qualquer lugar
let valor = 42
valor = "agora sou texto"  // nenhum erro

// Função espera números, mas aceita qualquer coisa
function somar(a, b) {
  return a + b
}

somar(1, 2)        // 3 — funciona
somar("1", 2)      // "12" — bug silencioso, concatenou string
somar(true, [])     // "true" — resultado absurdo, zero erro
```

O JavaScript não reclama de nenhum desses casos. Os bugs só aparecem em runtime.

## TypeScript adicionando tipagem

```typescript
// TypeScript exige declaração de tipo
let valor: number = 42
valor = "agora sou texto"  // ERRO: Type 'string' is not assignable to type 'number'

// Função com parâmetros tipados
function somar(a: number, b: number): number {
  return a + b
}

somar(1, 2)        // 3 — funciona
somar("1", 2)      // ERRO: Argument of type 'string' is not assignable to parameter of type 'number'
```

O erro aparece no editor, antes de executar.

## Pipeline de compilação (3 etapas)

### Etapa 1: Código TypeScript
```typescript
type User = {
  name: string
  age: number
  email: string
}

function createUser(user: User): User {
  return user
}

const newUser = createUser({
  name: "João",
  age: 25,
  email: "joao@email.com"
})
```

### Etapa 2: Remoção das tipagens (compilação)
O compilador remove `type User`, `: User`, `: string`, `: number` — tudo que é anotação de tipo.

### Etapa 3: JavaScript puro (resultado final)
```javascript
function createUser(user) {
  return user
}

const newUser = createUser({
  name: "João",
  age: 25,
  email: "joao@email.com"
})
```

O runtime só vê JavaScript. Zero overhead de TypeScript.

## Exemplo prático: "regras do jogo" para trabalho em equipe

```typescript
// Dev A cria a função com tipos claros
function cadastrarUsuario(params: {
  nome: string
  idade: number
  email: string
}): void {
  // implementação...
}

// Dev B usa a função — o editor mostra exatamente o que passar
cadastrarUsuario({
  nome: "Maria",
  idade: 30,
  email: "maria@email.com"
})

// Dev B tenta passar errado — erro imediato
cadastrarUsuario({
  nome: "Maria",
  idade: "trinta",  // ERRO: Type 'string' is not assignable to type 'number'
  email: "maria@email.com"
})
```

## Autocomplete em ação

```typescript
type Produto = {
  id: number
  nome: string
  preco: number
  categoria: string
}

const produto: Produto = {
  id: 1,
  nome: "Teclado",
  preco: 250,
  categoria: "Periféricos"
}

// Ao digitar "produto." o VSCode sugere: id, nome, preco, categoria
produto.  // ← autocomplete mostra todas as propriedades disponíveis
```

## Adoção gradual: JS e TS coexistindo

```
meu-projeto/
├── src/
│   ├── utils.js          # ainda JavaScript
│   ├── helpers.js         # ainda JavaScript
│   ├── api.ts             # já migrado para TypeScript
│   └── models.ts          # já migrado para TypeScript
├── tsconfig.json          # allowJs: true permite mistura
└── package.json
```

```json
// tsconfig.json para adoção gradual
{
  "compilerOptions": {
    "allowJs": true,        // permite arquivos .js no projeto
    "checkJs": false,       // não verifica tipos em .js (opcional: true para verificar)
    "strict": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

Migre um arquivo por vez, sem quebrar o projeto.