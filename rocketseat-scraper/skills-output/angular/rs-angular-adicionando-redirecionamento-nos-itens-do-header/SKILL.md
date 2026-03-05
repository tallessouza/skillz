---
name: rs-angular-routerlink-active-header
description: "Applies Angular routerLink and routerLinkActive directives for header navigation with active-state styling. Use when user asks to 'add navigation to header', 'highlight active route', 'style active menu item', 'routerLink in navbar', or 'angular router navigation'. Ensures correct import of RouterLink and RouterLinkActive, applies conditional CSS classes on active routes including border, text color, and font weight. Make sure to use this skill whenever building Angular navigation components with active state indicators. Not for route guard configuration, lazy loading, or route resolver setup."
---

# RouterLink e RouterLinkActive no Header Angular

> Aplique `routerLink` para navegacao e `routerLinkActive` para estilizacao condicional de rotas ativas em componentes de navegacao Angular.

## Rules

1. **Importe RouterLink e RouterLinkActive no componente** — adicione ambos nos imports do componente, porque sem eles os atributos no template sao ignorados silenciosamente
2. **Use routerLink no elemento ancora** — `[routerLink]="'/explore'"` em vez de `href`, porque href causa reload completo da pagina SPA
3. **Use routerLinkActive para classes condicionais** — aplique classes CSS que so aparecem quando a rota esta ativa, porque evita logica manual de verificacao de rota
4. **Aplique routerLinkActive tambem em elementos filhos (SVG/icones)** — icones dentro do link precisam de seu proprio `routerLinkActive` para mudar cor, porque a diretiva nao propaga automaticamente para filhos
5. **Use `!important` em borders de estado ativo** — `!border-purple-400` garante que o border ativo sobreponha o `border-transparent` base, porque Tailwind nao garante ordem de especificidade
6. **Replique a mesma estrutura no menu mobile/minimizado** — menu responsivo precisa dos mesmos routerLink e routerLinkActive, porque sao elementos DOM separados

## How to write

### Link de navegacao com estado ativo

```html
<a
  class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
  routerLink="/explore"
  routerLinkActive="!border-purple-400 font-bold text-white"
>
  <svg class="h-5 w-5" routerLinkActive="text-purple-400">
    <!-- icon SVG -->
  </svg>
  Explorar
</a>
```

### Menu minimizado com estado ativo

```html
<a
  class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
  routerLink="/explore"
  routerLinkActive="bg-white/10 font-bold border-l-4 border-purple-500 hover:bg-white/20 text-white"
>
  <svg class="h-5 w-5" routerLinkActive="text-purple-400">
    <!-- icon SVG -->
  </svg>
  Explorar
</a>
```

## Example

**Before (sem navegacao de rota):**
```html
<a class="text-gray-400 hover:text-white" href="/explore">
  <svg class="h-5 w-5 text-purple-400">...</svg>
  Explorar
</a>
<a class="text-gray-400 hover:text-white" href="/favorites">
  <svg class="h-5 w-5 text-purple-400">...</svg>
  Meus Favoritos
</a>
```

**After (com routerLink e routerLinkActive):**
```html
<a
  class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
  routerLink="/explore"
  routerLinkActive="!border-purple-400 font-bold text-white"
>
  <svg class="h-5 w-5" routerLinkActive="text-purple-400">...</svg>
  Explorar
</a>
<a
  class="h-full flex items-center gap-2 text-gray-400 hover:text-white transition px-2 border-b-2 border-transparent hover:border-b-2 box-border focus:outline-none"
  routerLink="/favorites"
  routerLinkActive="!border-purple-400 font-bold text-white"
>
  <svg class="h-5 w-5" routerLinkActive="text-purple-400">...</svg>
  Meus Favoritos
</a>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Header com links de navegacao | Usar routerLink + routerLinkActive em cada ancora |
| Icone dentro do link muda de cor quando ativo | Adicionar routerLinkActive separado no SVG |
| Menu mobile duplica itens do header | Replicar routerLink/routerLinkActive com classes diferentes |
| Border inferior indica rota ativa | Usar `border-b-2 border-transparent` como base + `!border-purple-400` no active |
| Classe fixa no SVG deveria ser condicional | Remover a classe fixa e mover para routerLinkActive |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `href="/explore"` em SPA Angular | `routerLink="/explore"` |
| `[class.active]="router.url === '/explore'"` | `routerLinkActive="active-classes"` |
| Classe `text-purple-400` fixa no SVG que deveria ser condicional | `routerLinkActive="text-purple-400"` no SVG |
| Logica manual no TS para verificar rota ativa | Diretiva `routerLinkActive` no template |
| `border-purple-400` sem `!` quando compete com `border-transparent` | `!border-purple-400` para garantir especificidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
