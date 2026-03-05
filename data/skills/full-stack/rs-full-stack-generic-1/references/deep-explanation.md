# Deep Explanation: TypeScript Generics

## Mental model: Generic vs Union

O instrutor usa uma analogia implicita muito clara: **union e um buffet livre, generic e um pedido fixo.**

Com union (`number | string`), voce declara que aceita qualquer um dos tipos a qualquer momento. Pode intercalar livremente — uma hora string, outra hora number. E como um buffet: voce escolhe o que quiser, quando quiser.

Com generic (`<T extends number | string>`), voce faz um pedido no momento da declaracao. A partir dali, o tipo esta travado. Se pediu string, so recebe string. E como escolher um prato fixo no restaurante — depois que pediu, nao troca.

## Por que generic existe se union ja e flexivel?

A chave esta na **consistencia pos-declaracao**. Union da flexibilidade demais — o compilador nao consegue garantir que voce vai manter o mesmo tipo ao longo do uso. Generic resolve isso:

1. No momento da declaracao, voce escolhe o tipo
2. O TypeScript propaga esse tipo para todos os pontos dependentes
3. Qualquer violacao gera erro de compilacao

Isso e especialmente importante em:
- **Hooks de estado** (React useState): o estado deve manter consistencia
- **Funcoes de fetch** (Axios): o retorno deve casar com o tipo esperado
- **Estruturas de dados** (Map, Set, Array): os elementos devem ser homogeneos

## O papel do `extends`

Sem `extends`, o generic aceita literalmente qualquer tipo — o TypeScript trata como `unknown`. Com `extends`, voce restringe o universo de tipos validos:

```typescript
// Sem extends — aceita qualquer coisa
function foo<T>() { ... }
foo<boolean>(); // OK
foo<Date>();    // OK
foo<number>();  // OK

// Com extends — apenas number ou string
function bar<T extends number | string>() { ... }
bar<boolean>(); // ERRO
bar<Date>();    // ERRO
bar<number>();  // OK
```

## O papel do default (`= Type`)

Quando o desenvolvedor nao especifica o tipo do generic, o TypeScript assume `unknown`. Definir um default resolve isso:

```typescript
<T extends number | string = string>
```

Isso significa:
- `useState()` → T = string (default)
- `useState<number>()` → T = number (explicito)

O default **nao afeta** as restricoes do extends. Se o extends diz `number | string`, voce nao pode usar `boolean` mesmo com default.

## Convencoes de nomenclatura

As letras usadas em generics sao convencoes da comunidade, nao regras do TypeScript:

| Letra | Significado | Uso comum |
|-------|-------------|-----------|
| `T` | Type | Tipo generico principal |
| `S` | State | Estado em hooks/stores |
| `K` | Key | Chaves de objetos |
| `V` | Value | Valores de objetos |
| `E` | Element | Elementos de colecoes |

Voce pode usar qualquer nome (`<MeuTipo>`), mas letras unicas sao o padrao.

## Onde generics aparecem no ecossistema

O instrutor menciona que generics sao ubiquos:

- **React:** `useState<string>()`, `useRef<HTMLInputElement>()`, `createContext<Theme>()`
- **Axios:** `axios.get<User[]>('/api/users')` — o retorno ja vem tipado
- **Express:** `Request<Params, ResBody, ReqBody>`
- **Prisma:** tipos gerados automaticamente usam generics internamente
- **Zod:** `z.object<Schema>()` para validacao tipada

## Edge cases discutidos

### Generic sem especificacao e sem default
```typescript
function useState<T>() { ... }
const s = useState(); // T = unknown — nenhuma garantia
```
O compilador nao reclama, mas voce perde toda a seguranca de tipos.

### Extends com tipos complexos
```typescript
<T extends { name: string; age: number }>
```
Funciona com qualquer objeto que tenha pelo menos `name` e `age`.

### Multiplos generics
```typescript
function merge<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}
```
Cada generic e independente e pode ser especificado separadamente.