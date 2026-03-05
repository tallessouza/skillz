---
name: rs-full-stack-keyof-1
description: "Applies TypeScript keyof operator patterns when extracting object keys as union types. Use when user asks to 'restrict values to object keys', 'create type from object', 'type icon names', 'extract keys as type', or 'limit string values to known keys'. Make sure to use this skill whenever generating TypeScript code that needs to constrain values to known object keys. Not for generic TypeScript basics, interface design, or mapped types."
---

# KeyOf — Extrair Chaves de Objeto como Tipo

> Use `keyof` para restringir valores apenas às chaves conhecidas de um objeto, garantindo seguranca em tempo de compilacao.

## Rules

1. **Use `typeof` antes de `keyof` quando partir de um objeto runtime** — `keyof typeof obj` extrai as chaves do objeto como union type, porque `keyof` opera sobre tipos, nao sobre valores
2. **Prefira `keyof` a union manual** — `keyof typeof icons` em vez de `"home" | "add" | "remove"`, porque a union se atualiza automaticamente quando o objeto muda
3. **Separe o type do keyof** — crie `type Icon = typeof icons` e depois `keyof Icon`, porque melhora legibilidade e permite reusar o tipo base

## How to write

### Extrair chaves de objeto como union type

```typescript
const icons = {
  home: "./path/home.svg",
  add: "./path/add.svg",
  remove: "./path/remove.svg",
}

type Icons = typeof icons
type IconName = keyof Icons // "home" | "add" | "remove"

const selectedIcon: IconName = "add"
```

### Usar em parametros de funcao

```typescript
function getIconPath(name: keyof typeof icons): string {
  return icons[name]
}
```

## Example

**Before (sem restricao):**
```typescript
const icons = { home: "./home.svg", add: "./add.svg" }
const selected: string = "x" // compila, mas "x" nao existe
```

**After (com keyof):**
```typescript
const icons = { home: "./home.svg", add: "./add.svg" }
type IconName = keyof typeof icons
const selected: IconName = "x" // ERRO: '"x"' is not assignable to type '"home" | "add"'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Objeto com chaves fixas e conhecidas | Extrair chaves com `keyof typeof` |
| Biblioteca de icones, temas, rotas | Usar `keyof` para restringir selecao |
| Precisa do valor, nao da chave | Usar o tipo direto (`typeof obj`), sem `keyof` |
| Chaves dinamicas em runtime | `keyof` nao ajuda — use `Record<string, T>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const icon: string = "add"` | `const icon: keyof typeof icons = "add"` |
| `type IconName = "home" \| "add" \| "remove"` (manual) | `type IconName = keyof typeof icons` (derivado) |
| `keyof icons` (objeto direto) | `keyof typeof icons` (tipo do objeto) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes