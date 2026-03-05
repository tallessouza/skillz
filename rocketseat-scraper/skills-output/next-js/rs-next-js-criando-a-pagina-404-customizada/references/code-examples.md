# Code Examples: Pagina 404 Customizada no Next.js App Router

## Exemplo 1: not-found.tsx completo

```typescript
// app/not-found.tsx
import Link from "next/link";
import { FileQuestion, Search } from "lucide-react";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-16">
      <div className="flex flex-col items-center">
        {/* Icone principal */}
        <FileQuestion
          size={64}
          className="text-gray-500 mx-auto mb-6"
        />

        {/* 404 estilizado com spans individuais */}
        <div className="relative">
          <span className="text-8xl font-bold font-sans inline-block m-3 transform rotate-12 translate-y-2 -translate-x-1">
            4
          </span>
          <span className="text-8xl font-bold font-sans inline-block m-3">
            0
          </span>
          <span className="text-8xl font-bold font-sans inline-block m-3">
            4
          </span>
        </div>

        {/* Texto descritivo */}
        <p className="text-gray-500 mb-8">Pagina nao encontrada</p>

        {/* Botoes de acao */}
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/">
            <Button variant="primary">Home</Button>
          </Link>
          <Link href="/blog?search">
            <Button variant="secondary">
              <Search size={16} />
              Pesquisar Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

## Exemplo 2: Componente Search com auto-focus

```typescript
// components/search.tsx
"use client";

import { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function Search() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detecta se o parametro ?search esta presente na URL
  const hasQuery = !!searchParams.has("search");

  // Auto-focus quando vem do 404 com ?search
  useEffect(() => {
    if (hasQuery) {
      inputRef.current?.focus();
    }
  }, [hasQuery]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Buscar posts..."
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

## Exemplo 3: Uso programatico de notFound()

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  // Se o post nao existe, dispara o not-found.tsx mais proximo
  if (!post) {
    notFound();
  }

  return <article>{post.content}</article>;
}
```

## Exemplo 4: not-found.tsx especifico de rota

```typescript
// app/blog/not-found.tsx
// Este 404 so aparece para rotas dentro de /blog/*
import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Post nao encontrado</h2>
      <p className="text-gray-500 mt-2">
        O post que voce procura nao existe ou foi removido.
      </p>
      <Link href="/blog" className="mt-4 inline-block text-blue-500">
        Ver todos os posts
      </Link>
    </div>
  );
}
```

## Fluxo completo: 404 → Busca com auto-focus

```
1. Usuario acessa /blog/post-inexistente
2. Next.js renderiza app/not-found.tsx (ou app/blog/not-found.tsx)
3. Usuario ve pagina 404 estilizada com botoes
4. Clica em "Pesquisar Posts" → navega para /blog?search
5. Componente Search monta, useSearchParams detecta ?search
6. useEffect dispara inputRef.current.focus()
7. Usuario ja pode digitar imediatamente
```