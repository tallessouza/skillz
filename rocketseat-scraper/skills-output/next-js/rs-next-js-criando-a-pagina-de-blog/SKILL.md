---
name: rs-next-js-criando-a-pagina-de-blog
description: "Applies Next.js Pages Router file-based routing patterns when creating new pages or routes. Use when user asks to 'create a page', 'add a route', 'create blog page', 'setup pages router', or 'add a new section' in Next.js. Enforces folder-based routing with index.tsx, proper page structure with semantic HTML, and Tailwind layout patterns. Make sure to use this skill whenever scaffolding new pages in Next.js Pages Router projects. Not for App Router, API routes, or dynamic routing."
---

# Criando Paginas no Next.js Pages Router

> Cada pasta dentro de `pages/` define uma rota, e o `index.tsx` dentro dela define o conteudo da pagina.

## Rules

1. **Crie pastas para rotas** — `pages/blog/index.tsx` gera a rota `/blog`, porque o Pages Router usa o filesystem como router
2. **Exporte default function** — toda pagina precisa de `export default function NomePage()`, porque o Next.js usa o default export para renderizar a pagina
3. **Estruture com semantic HTML** — use `header`, `h1`, `span` para tags/categorias, porque melhora acessibilidade e SEO
4. **Envolva conteudo em container** — use uma div container com `max-width` e spacing consistente, porque evita conteudo colado nas bordas
5. **Separe componentes reutilizaveis** — elementos como search, cards e grids devem ser componentes separados, porque facilita manutencao e reutilizacao

## How to write

### Nova pagina com rota

```typescript
// pages/blog/index.tsx
export default function BlogPage() {
  return (
    <div className="flex flex-col py-24 flex-grow">
      <div className="container space-y-6 flex flex-col items-center md:items-end lg:items-end">
        <header>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <span className="w-fit rounded-md text-center md:text-left py-2 px-8 bg-cyan-300 text-body-tag text-cyan-950">
              Blog
            </span>
            <h1 className="text-balance text-start md:text-left heading-lg md:heading-xl max-w-2xl text-gray-50">
              Dicas e estrategias para impulsionar o seu negocio
            </h1>
          </div>
        </header>
        {/* Search component */}
        {/* Posts grid */}
      </div>
    </div>
  )
}
```

### Estrutura de pastas para rotas

```
pages/
├── index.tsx          # rota /
├── blog/
│   └── index.tsx      # rota /blog
├── about/
│   └── index.tsx      # rota /about
```

## Example

**Before (rota inexistente, link quebrado):**
```typescript
// Header tem <Link href="/blog"> mas nao existe pages/blog/
// Resultado: 404
```

**After (pagina criada corretamente):**
```typescript
// pages/blog/index.tsx criado
// Header <Link href="/blog"> agora funciona
// Resultado: pagina renderizada em /blog
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova secao do site (blog, about, pricing) | Criar pasta em `pages/` com `index.tsx` |
| Pagina precisa de tag/categoria visual | Usar `span` com bg colorido, rounded, padding |
| Layout de pagina com titulo e conteudo | Flex column com container, spacing vertical |
| Link no header aponta para rota nova | Criar a pagina correspondente antes de testar |
| Componente sera reutilizado (search, card) | Extrair para arquivo separado em `components/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Criar pagina direto em `pages/blog.tsx` para rotas que terao sub-rotas | `pages/blog/index.tsx` (permite futuras sub-rotas como `/blog/[slug]`) |
| Exportar named export da pagina | `export default function BlogPage()` |
| Colocar todo o conteudo sem container | Envolver em div com classe container e spacing |
| Estilizar inline sem sistema de design | Usar classes Tailwind consistentes com o projeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
