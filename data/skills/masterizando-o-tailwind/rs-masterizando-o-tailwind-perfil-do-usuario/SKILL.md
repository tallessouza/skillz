---
name: rs-tailwind-perfil-do-usuario
description: "Applies Tailwind CSS patterns for user profile components with avatar, text truncation, and responsive grid layouts. Use when user asks to 'create a profile card', 'build a sidebar profile', 'truncate long text', 'handle overflow text in Tailwind', or 'create avatar with name layout'. Covers truncate utility, custom grid-template-columns, and hover states on icon buttons. Make sure to use this skill whenever building profile sections or handling text overflow in Tailwind. Not for form inputs, authentication logic, or backend user management."
---

# Perfil do Usuario com Tailwind

> Construa componentes de perfil responsivos que lidem graciosamente com texto longo usando truncate e grid layouts customizados.

## Rules

1. **Use `truncate` na div pai E no span filho** — aplicar truncate apenas no span nao funciona porque o span inline nao controla seu proprio tamanho; a div pai precisa truncate tambem para restringir o container
2. **Use grid com `max-content 1fr max-content` para layouts de 3 colunas** — a coluna do meio (texto) cresce/encolhe enquanto as laterais (avatar, botao) ocupam apenas o necessario, porque flex sozinho nao restringe o texto longo
3. **Use `rounded-full` para avatares circulares** — com `w-10 h-10` (40px) e `rounded-full` para arredondamento total
4. **Adicione padding antes de hover:bg** — um botao de icone precisa de padding (ex: `p-2`) para que a cor de fundo do hover tenha area visivel, e `rounded-md` para arredondar o fundo
5. **Use a classe `px` do Tailwind para linhas divisorias de 1px** — `h-px bg-zinc-200` cria um separador fino sem valores arbitrarios

## How to write

### Componente de perfil completo

```tsx
// Grid de 3 colunas: avatar (max-content) | texto (1fr) | botao (max-content)
<div className="grid grid-cols-profile items-center gap-3">
  <img
    src="https://github.com/username.png"
    alt=""
    className="h-10 w-10 rounded-full"
  />
  <div className="flex flex-col truncate">
    <span className="text-sm font-semibold text-zinc-700 truncate">
      Nome do Usuario
    </span>
    <span className="text-sm text-zinc-500 truncate">
      email-muito-longo@dominio.com.br
    </span>
  </div>
  <button type="button" className="p-2 hover:bg-zinc-50 rounded-md">
    <LogOut className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

### Configuracao do grid customizado no tailwind.config

```js
// tailwind.config.js
theme: {
  extend: {
    gridTemplateColumns: {
      profile: 'max-content 1fr max-content',
    },
  },
}
```

### Linha divisoria

```tsx
<div className="h-px bg-zinc-200" />
```

## Example

**Before (texto longo quebra o layout):**
```tsx
<div className="flex items-center gap-3">
  <img src="..." className="h-10 w-10 rounded-full" alt="" />
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-zinc-700">Diego</span>
    <span className="text-sm text-zinc-500">
      email-extremamente-longo@empresa.com.br
    </span>
  </div>
  <button className="ml-auto"><LogOut /></button>
</div>
```

**After (truncate + grid customizado):**
```tsx
<div className="grid grid-cols-profile items-center gap-3">
  <img src="..." className="h-10 w-10 rounded-full" alt="" />
  <div className="flex flex-col truncate">
    <span className="text-sm font-semibold text-zinc-700 truncate">Diego</span>
    <span className="text-sm text-zinc-500 truncate">
      email-extremamente-longo@empresa.com.br
    </span>
  </div>
  <button type="button" className="p-2 hover:bg-zinc-50 rounded-md">
    <LogOut className="h-5 w-5 text-zinc-500" />
  </button>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Texto pode ser longo (email, nome) | `truncate` na div pai + span filho |
| Layout com icone + texto + acao | Grid com `max-content 1fr max-content` |
| Avatar de usuario | `rounded-full` + dimensoes fixas (`w-10 h-10`) |
| Botao apenas com icone | `p-2` + `hover:bg-zinc-50` + `rounded-md` |
| Separador visual fino | `h-px bg-zinc-200` (nao use border) |
| Imagem de perfil do GitHub | `github.com/{username}.png` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `truncate` so no span sem truncate no container | `truncate` na div pai E no span |
| `flex` + `ml-auto` para layout 3 colunas com texto truncavel | `grid` com `grid-cols-profile` customizado |
| `h-[1px]` para divisoria | `h-px` (classe nativa do Tailwind) |
| Botao de icone sem padding com hover:bg | `p-2 hover:bg-zinc-50 rounded-md` |
| `overflow-hidden text-ellipsis whitespace-nowrap` separados | `truncate` (agrupa as 3 propriedades) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
