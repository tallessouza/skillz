# Code Examples: Criando a Pagina de Blog

## Exemplo 1: Pagina minima para verificar rota

O instrutor comeca com o minimo para validar que a rota funciona:

```typescript
// pages/blog/index.tsx
export default function BlogPage() {
  return <h2>Blog</h2>
}
```

Depois adiciona classes para visualizar melhor:

```typescript
export default function BlogPage() {
  return <h2 className="mt-96 text-green-400">Blog</h2>
}
```

**Insight:** Sempre valide a rota com conteudo minimo antes de construir o layout completo. O `mt-96` foi usado apenas para empurrar o conteudo para baixo do header fixo e confirmar visualmente.

## Exemplo 2: Estrutura completa da pagina

```typescript
// pages/blog/index.tsx
export default function BlogPage() {
  return (
    <div className="flex flex-col py-24 flex-grow">
      <div className="container space-y-6 flex flex-col items-center md:items-end lg:items-end">
        <header>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            {/* Tag */}
            <span className="w-fit rounded-md text-center md:text-left py-2 px-8 bg-cyan-300 text-body-tag text-cyan-950">
              Blog
            </span>

            {/* Titulo */}
            <h1 className="text-balance text-start md:text-left heading-lg md:heading-xl max-w-2xl text-gray-50">
              Dicas e estratégias para impulsionar o seu negócio
            </h1>
          </div>
        </header>

        {/* Search component (proxima aula) */}

        {/* Grid de posts (futuro) */}
      </div>
    </div>
  )
}
```

## Exemplo 3: Como o header ja referenciava a rota

```typescript
// components/Header.tsx (ja existia)
<Link href="/blog">Blog</Link>
```

O link ja existia antes da pagina ser criada. Ao criar `pages/blog/index.tsx`, o Next.js automaticamente resolve essa rota.

## Variacoes: Criando outras paginas seguindo o mesmo padrao

```typescript
// pages/about/index.tsx
export default function AboutPage() {
  return (
    <div className="flex flex-col py-24 flex-grow">
      <div className="container space-y-6 flex flex-col items-center md:items-end">
        <header>
          <div className="flex flex-col gap-4 px-4 md:px-0">
            <span className="w-fit rounded-md py-2 px-8 bg-purple-300 text-purple-950">
              Sobre
            </span>
            <h1 className="text-balance heading-lg md:heading-xl max-w-2xl text-gray-50">
              Conheça nossa história
            </h1>
          </div>
        </header>
      </div>
    </div>
  )
}
```

## Classes Tailwind customizadas usadas

O projeto usa classes customizadas definidas no Tailwind config:
- `text-body-tag` — tamanho de fonte para tags/categorias
- `heading-lg` — tamanho de heading para mobile
- `heading-xl` — tamanho de heading para desktop
- `container` — container centralizado com max-width