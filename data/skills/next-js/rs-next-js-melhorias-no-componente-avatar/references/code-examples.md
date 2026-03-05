# Code Examples: Melhorias no Componente Avatar

## Exemplo completo do componente Avatar

### Tipagem

```typescript
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

type AvatarSize = 'xs' | 'sm'

const avatarSize: Record<AvatarSize, string> = {
  xs: 'h-5 w-5',   // 20px (5 * 4)
  sm: 'h-9 w-9',   // 36px (9 * 4)
}

type AvatarProps = Omit<ImageProps, 'height' | 'width'> & {
  size?: AvatarSize
}
```

### Componente

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

## Uso na pagina de post (slug)

```typescript
// Dentro de /pages/blog/[slug].tsx ou similar
<Avatar
  src={post.author.avatar}
  alt={post.author.name}
  size="sm"  // 36px — tamanho maior para contexto de leitura
/>
```

## Uso no componente PostCard (listagem)

```typescript
// Antes — codigo duplicado com Image direto
<Image
  src={author.avatar}
  alt={author.name}
  height={20}
  width={20}
  className="rounded-full border border-blue-200"
/>
<span>{author.name}</span>

// Depois — componente reutilizavel
<Avatar
  src={author.avatar}
  alt={author.name}
  size="xs"  // 20px — tamanho menor para listagem
  title={author.name}
/>
```

## Extensao: adicionando novos tamanhos

```typescript
// Se precisar de tamanhos maiores no futuro:
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

const avatarSize: Record<AvatarSize, string> = {
  xs: 'h-5 w-5',    // 20px
  sm: 'h-9 w-9',    // 36px
  md: 'h-12 w-12',  // 48px
  lg: 'h-16 w-16',  // 64px
}
// Nenhuma outra mudanca necessaria — o componente ja usa o objeto
```

## Pattern: cn() para combinar estilos fixos + dinamicos

```typescript
// Primeiro argumento: estilos que SEMPRE se aplicam
// Segundo argumento: estilos que VARIAM conforme props
className={cn(
  'relative overflow-hidden rounded-full border border-blue-200',  // fixo
  avatarSize[size]  // dinamico baseado na variante
)}
```

## Referencia de conversao Tailwind → pixels

| Classe Tailwind | Calculo | Pixels |
|-----------------|---------|--------|
| `h-5 w-5` | 5 × 4 | 20px |
| `h-9 w-9` | 9 × 4 | 36px |
| `h-12 w-12` | 12 × 4 | 48px |
| `h-16 w-16` | 16 × 4 | 64px |