# Deep Explanation: TypeScript Record Utility Type

## O que o Record faz internamente

`Record<K, V>` e equivalente a:

```typescript
type Record<K extends keyof any, V> = {
  [P in K]: V
}
```

Ele cria um mapped type onde cada chave em `K` mapeia para o tipo `V`. Isso significa que quando `K` e um union type, TODAS as opcoes do union se tornam propriedades obrigatorias.

## Mental model: Record como contrato de objeto

O instrutor apresenta o Record como uma ferramenta de **mapeamento de estrutura**. A analogia principal e: Record define o "formato" que um objeto deve respeitar, como um contrato.

- **Chave = string** → qualquer propriedade textual e aceita
- **Chave = union** → somente as opcoes listadas sao aceitas, e TODAS devem existir
- **Valor = primitivo** → valores simples
- **Valor = interface** → valores complexos que devem satisfazer a interface

## Por que Record e nao index signature?

Index signatures (`[key: string]: number`) fazem o mesmo para chaves dinamicas, mas Record e mais legivel e componivel:

```typescript
// Index signature — funcional mas verboso
const scores: { [key: string]: number } = {}

// Record — mais limpo e idiomatico
const scores: Record<string, number> = {}
```

A diferenca real aparece com union types como chave — index signatures nao suportam isso.

## Completude obrigatoria com union types

Ponto enfatizado pelo instrutor: quando voce usa um union type como chave, o TypeScript **exige** que todas as opcoes estejam presentes. Isso e poderoso para garantir que nenhuma opcao foi esquecida:

```typescript
type Status = "pending" | "active" | "inactive"

// ERRO: faltou "inactive"
const labels: Record<Status, string> = {
  pending: "Pendente",
  active: "Ativo"
}
```

Isso funciona como um **exhaustiveness check** — se voce adicionar um novo status ao union, o TypeScript vai reclamar em todos os Records que usam esse tipo ate voce adicionar a nova chave.

## Chaves extras sao proibidas

O instrutor demonstrou que adicionar uma chave que nao existe no union type gera erro:

```typescript
type Profile = "admin" | "user" | "guest"

const user: Record<Profile, number> = {
  admin: 1,
  user: 2,
  guest: 3,
  default: 4  // ERRO: "default" nao existe em Profile
}
```

## Aspas em chaves

O instrutor mencionou que chaves string podem ser escritas com ou sem aspas quando sao texto valido como identificador JavaScript:

```typescript
// Ambos validos
const a: Record<string, number> = { Rodrigo: 10 }
const b: Record<string, number> = { "Rodrigo": 10 }

// Aspas obrigatorias quando a chave tem caracteres especiais
const c: Record<string, number> = { "nome completo": 10 }
```

## Combinando com Partial

Se voce quer union types como chave mas nao quer obrigar todas as chaves:

```typescript
type Profile = "admin" | "user" | "guest"

const partialPermissions: Partial<Record<Profile, number>> = {
  admin: 1
  // user e guest sao opcionais agora
}
```

## Quando NAO usar Record

- Quando o objeto tem propriedades de tipos diferentes (use `interface`)
- Quando voce precisa de metodos no objeto (use `class` ou `interface`)
- Quando as chaves sao conhecidas e os valores tem tipos diferentes por chave (use `interface`)