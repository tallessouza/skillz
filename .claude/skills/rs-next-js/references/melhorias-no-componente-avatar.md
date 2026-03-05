---
name: rs-next-js-melhorias-componente-avatar
description: "Enforces size-variant pattern for reusable UI components when writing React/Next.js code. Use when user asks to 'create a component', 'add size variants', 'make component flexible', 'reusable avatar', or 'component with different sizes'. Applies rules: use typed size unions, map sizes to style objects, omit raw width/height from props, provide sensible defaults, wrap images in styled containers. Make sure to use this skill whenever creating components that need multiple size variations. Not for layout components, page routing, or data fetching logic."
---

# Componente com Variantes de Tamanho

> Componentes reutilizaveis definem tamanhos como variantes tipadas mapeadas a objetos de estilo, nunca como props numericas livres.

## Rules

1. **Defina tamanhos como union type** — `type AvatarSize = 'xs' | 'sm'` nao `size: number`, porque variantes nomeadas garantem consistencia visual e previnem valores arbitrarios
2. **Mapeie variantes a objetos de estilo** — use um objeto `const avatarSize = { xs: {...}, sm: {...} }` porque centraliza todos os valores e facilita adicionar novos tamanhos
3. **Omita width/height das props** — use `Omit<ImageProps, 'height' | 'width'>` e controle tamanho apenas via variante, porque props numericas livres quebram o design system
4. **Sempre defina um default** — `size = 'xs'` na desestruturacao, porque o componente deve funcionar sem configuracao explicita
5. **Envolva em container estilizado** — use uma div com `relative overflow-hidden rounded-full` ao redor da imagem com `fill`, porque o container controla dimensoes e a imagem se adapta
6. **Combine estilos com cn()** — estilos fixos no primeiro argumento, variante dinamica no segundo, porque permite sobrescrever classes condicionalmente

## How to write

### Tipagem e mapeamento de tamanhos

```typescript
type AvatarSize = 'xs' | 'sm'

const avatarSize: Record<AvatarSize, string> = {
  xs: 'h-5 w-5',   // 20px
  sm: 'h-9 w-9',   // 36px
}

type AvatarProps = Omit<ComponentProps<typeof Image>, 'height' | 'width'> & {
  size?: AvatarSize
}
```

### Componente com container

```typescript
export function Avatar({ src, alt, size = 'xs', ...props }: AvatarProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-full border border-blue-200',
      avatarSize[size]
    )}>
      <Image src={src} alt={alt} fill {...props} />
    </div>
  )
}
```

## Example

**Before (props numericas, sem reuso):**
```typescript
// No post (36px)
<Image src={author.avatar} alt={author.name} height={36} width={36} className="rounded-full" />

// No card (20px) — codigo duplicado com valores diferentes
<Image src={author.avatar} alt={author.name} height={20} width={20} className="rounded-full" />
```

**After (componente com variantes):**
```typescript
// No post
<Avatar src={author.avatar} alt={author.name} size="sm" />

// No card — default xs, pode ser explicito
<Avatar src={author.avatar} alt={author.name} size="xs" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mesmo componente visual em 2+ tamanhos | Criar variantes tipadas |
| Imagem precisa ser redonda e contida | Container com relative + overflow-hidden + rounded-full, imagem com fill |
| Props de dimensao (height/width) existem no tipo base | Omit do tipo e controlar via variante |
| Novo tamanho necessario (md, lg) | Adicionar ao union type E ao objeto de mapeamento |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `size: number` como prop | `size?: 'xs' \| 'sm'` com union type |
| `height={20} width={20}` repetido em cada uso | `size="xs"` via variante |
| Copiar Image + classes em cada lugar | Componente Avatar reutilizavel |
| Estilos de borda/arredondamento na Image diretamente | Container div com os estilos, Image com fill |
| Sem default no size | `size = 'xs'` na desestruturacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-melhorias-no-componente-avatar/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-melhorias-no-componente-avatar/references/code-examples.md)
