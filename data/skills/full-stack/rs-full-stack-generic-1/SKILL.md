---
name: rs-full-stack-generic-1
description: "Enforces correct TypeScript generics usage when writing functions, hooks, or reusable utilities. Use when user asks to 'create a generic function', 'make this flexible', 'add type parameters', 'write a hook', or 'use generics'. Applies rules: generic constraints with extends, default type parameters, single-letter conventions (T/K/V/E/S), and generic-over-union when type must be locked at declaration. Make sure to use this skill whenever generating TypeScript code that needs flexible but consistent typing. Not for union types, simple type aliases, or interface definitions without type parameters."
---

# TypeScript Generics

> Generics definem o tipo no momento da declaracao e forcam consistencia a partir dali — diferente de union, que permite intercalar tipos livremente.

## Rules

1. **Use generics quando o tipo deve ser travado na declaracao** — `useState<string>()` aceita apenas string a partir dali, porque evita inconsistencia de tipos em runtime
2. **Use union quando intercalar tipos e aceitavel** — `number | string` permite alternar livremente entre os dois, porque cada chamada e independente
3. **Restrinja generics com extends** — `<T extends number | string>` limita as opcoes validas, porque generic sem restricao vira `unknown`
4. **Defina um tipo padrao com =** — `<T extends number | string = string>` garante comportamento previsivel quando o desenvolvedor nao especifica o tipo
5. **Siga convencoes de letras** — `T` (type), `S` (state), `K` (key), `V` (value), `E` (element), porque sao padroes reconhecidos pela comunidade
6. **Propague o generic para todos os pontos dependentes** — se o state e `T`, o setter tambem recebe `T`, porque inconsistencia quebra a garantia do generic

## How to write

### Funcao generica com constraint e default

```typescript
function useState<T extends number | string = string>() {
  let state: T;

  function get() {
    return state;
  }

  function set(newValue: T) {
    state = newValue;
  }

  return { get, set };
}
```

### Uso com tipo explicito

```typescript
const nameState = useState<string>();
nameState.set("Rodrigo");    // OK
nameState.set(123);           // ERRO — tipo travado como string

const countState = useState<number>();
countState.set(42);           // OK
countState.set("texto");      // ERRO — tipo travado como number
```

### Uso com tipo padrao (sem especificar)

```typescript
const defaultState = useState(); // assume string (default)
defaultState.set("Amanda");      // OK
defaultState.set(123);           // ERRO — padrao e string
```

## Example

**Before (union — permite intercalar):**
```typescript
function useState() {
  let state: number | string;

  function set(newValue: number | string) {
    state = newValue;
  }

  return { get: () => state, set };
}

const s = useState();
s.set("texto");  // OK
s.set(123);      // OK — union permite intercalar
s.set("outro");  // OK — sem consistencia forcada
```

**After (generic — trava o tipo na declaracao):**
```typescript
function useState<T extends number | string = string>() {
  let state: T;

  function set(newValue: T) {
    state = newValue;
  }

  return { get: () => state, set };
}

const s = useState<string>();
s.set("texto");  // OK
s.set(123);      // ERRO — declarou string, respeita string
s.set("outro");  // OK
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tipo deve ser consistente apos declaracao | Use generic |
| Tipo pode variar a cada chamada | Use union |
| Generic sem especificacao deve funcionar | Defina default com `= Type` |
| Generic aceita qualquer coisa | Restrinja com `extends` |
| Funcao retorna o mesmo tipo que recebe | Generic e a escolha certa |
| Biblioteca expoe tipo configuravel (React, Axios) | Espere generic na API |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<T>` sem constraint quando ha tipos validos conhecidos | `<T extends number \| string>` |
| `state: any` em funcao reutilizavel | `state: T` com generic |
| Union quando consistencia e necessaria | Generic com extends |
| Generic sem default quando ha tipo obvio | `<T = string>` com default |
| `<Type>` como nome do generic | `<T>` seguindo convencao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre generic vs union, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes