---
name: rs-next-js-postcard-dinamico
description: "Applies dynamic props and TypeScript interfaces to Next.js card components. Use when user asks to 'create a card component', 'make component dynamic', 'add props to component', 'type component props', or 'build a post card'. Enforces interface-first design with nested types, destructured props, and proper image/link patterns. Make sure to use this skill whenever building presentational card components in Next.js or React with TypeScript. Not for API routes, data fetching, or server-side logic."
---

# PostCard Dinâmico com Props Tipadas

> Defina interfaces antes de consumir dados — componentes recebem dados via props tipadas, nunca hardcoded.

## Rules

1. **Interface antes do componente** — defina o tipo das props no mesmo arquivo, acima do componente, porque garante contrato claro antes da implementacao
2. **Tipos aninhados separados** — quando uma prop e um objeto (ex: author), crie um type separado e referencie, porque melhora legibilidade e reuso
3. **Desestruture as props** — `({ slug, title, description })` direto na assinatura, porque evita `props.` repetitivo e deixa claro o que o componente consome
4. **Imagens com border-radius contextual** — use valores menores que o container pai, porque cria hierarquia visual coerente (container 12px → imagem 8px)
5. **Links dinamicos com slug** — construa hrefs com template literals usando o slug: `` `/blog/${slug}` ``, porque desacopla a rota do conteudo
6. **Optional chaining durante desenvolvimento** — use `?.` em propriedades que ainda nao tem dados reais, porque evita quebra enquanto a integracao nao esta completa

## How to write

### Interface com tipo aninhado

```typescript
type Author = {
  name: string
  avatar: string
}

interface PostCardProps {
  slug: string
  title: string
  description: string
  image: string
  date: string
  author: Author
}
```

### Componente com props desestruturadas

```typescript
export function PostCard({ slug, title, description, image, date, author }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <div className="rounded-[12px] overflow-hidden">
        <img src={image} className="rounded-t-[8px]" />
        <div className="relative">
          <div className="absolute top-0 left-0 bg-gray-600 backdrop-blur-sm rounded-bl-[10px] px-3 py-1">
            <span>{date}</span>
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
          <div>
            <img src={author.avatar} />
            <span>{author.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
```

### Consumo com dados temporarios

```typescript
<PostCard
  slug="transformando-seu-negocio"
  title="Transformando seu negócio em uma loja virtual"
  description="Buscando os melhores produtos"
  date="20/12/2024"
  image="/assets/primeiro-post.png"
  author={{
    name: "John Doe",
    avatar: "/customers/customer01.png"
  }}
/>
```

## Example

**Before (dados hardcoded no componente):**
```typescript
function PostCard() {
  return (
    <Link href="/blog/meu-post">
      <img src="/post1.png" />
      <span>20/12/2024</span>
      <h3>Meu Post</h3>
      <p>Descricao fixa</p>
      <img src="/avatar.png" />
      <span>Autor Fixo</span>
    </Link>
  )
}
```

**After (props tipadas e dinamicas):**
```typescript
interface PostCardProps {
  slug: string
  title: string
  description: string
  image: string
  date: string
  author: { name: string; avatar: string }
}

function PostCard({ slug, title, description, image, date, author }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <img src={image} />
      <span>{date}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <img src={author.avatar} />
      <span>{author.name}</span>
    </Link>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Prop e um objeto com 2+ campos | Crie type separado acima da interface |
| Componente ainda sem dados reais | Passe dados hardcoded no consumo, nao no componente |
| Border-radius de elemento filho | Use valor menor que o container pai |
| Link depende de identificador | Use slug no href via template literal |
| Prop pode ser undefined temporariamente | Use optional chaining `?.` ate integrar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `href="/blog/meu-post"` hardcoded | `` href={`/blog/${slug}`} `` |
| Dados fixos dentro do componente | Props tipadas recebidas de fora |
| `props.title`, `props.author.name` | Desestruture: `{ title, author }` |
| `author: any` | `author: { name: string; avatar: string }` |
| `rounded-2xl` sem verificar o valor real | `rounded-[12px]` com valor exato do design |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
