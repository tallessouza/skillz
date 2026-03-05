# Code Examples: Listagem do Catalogo no Frontend

## 1. Configuracao do Axios

```typescript
// src/api.ts
import axios from "axios";
import type { Product } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333",
});

export async function getCatalog(search?: string) {
  const { data } = await api.get<Product[]>("/catalog", {
    params: { search },
  });
  return data;
}
```

## 2. Tipagem dos produtos

```typescript
// src/types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
}
```

## 3. Teste inicial de integracao (versao minima)

```typescript
"use client";

import useSWR from "swr";
import { getCatalog } from "@/api";

export default function Home() {
  const products = useSWR("catalog", () => getCatalog());

  return (
    <pre>{JSON.stringify(products.data, null, 2)}</pre>
  );
}
```

## 4. Pagina de produtos completa com pesquisa

```typescript
"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { getCatalog } from "@/api";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: products } = useSWR(
    ["catalog", search],
    () => getCatalog(search)
  );

  function handleSearch(search: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("search", search);
    window.history.pushState({}, "", url);
  }

  return (
    <div className="p-10">
      <Input
        placeholder="Pesquisar produtos..."
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-6"
      />

      {products?.map((product) => (
        <div key={product.id} className="mb-4">
          <h3>{product.name}</h3>
          <p>R$ {(product.priceInCents / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

## 5. CORS no NestJS (main.ts)

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3333);
}
bootstrap();
```

## 6. Layout com Sidebar e Toaster

```typescript
// app/layout.tsx
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
```

**Erro comum:** colocar `<Toaster />` fora do `<body>`, o que causa warning de `<section>` como filho direto de `<html>`.

## 7. Instalacao das dependencias

```bash
# Libs de integracao
npm install axios swr

# Componentes shadcn/ui usados
npx shadcn@latest add button badge card input
npx shadcn@latest add sonner  # Toast notifications
```

## 8. Variacao: SWR key dinamica

A key do SWR `["catalog", search]` e um array. Quando `search` muda, o SWR trata como uma nova key e faz nova requisicao. Se o valor ja foi buscado antes, retorna do cache imediatamente.

```typescript
// Key fixa - mesma requisicao sempre
useSWR("catalog", () => getCatalog());

// Key dinamica - nova requisicao quando search muda
useSWR(["catalog", search], () => getCatalog(search));

// Key condicional - so busca se search tiver valor
useSWR(search ? ["catalog", search] : null, () => getCatalog(search));
```