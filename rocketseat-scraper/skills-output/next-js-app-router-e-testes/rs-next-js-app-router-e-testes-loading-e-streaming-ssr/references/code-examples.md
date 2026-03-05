# Code Examples: Loading e Streaming SSR

## Setup da aula — delay artificial para simular fetch lento

O instrutor adicionou uma funcao de delay para tornar o carregamento visivel:

```typescript
// Funcao auxiliar usada na aula para simular latencia
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## Page.tsx com fetch assincrono (Home)

```typescript
// app/page.tsx
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default async function Home() {
  await delay(2000) // Simula latencia de API

  const response = await fetch('https://api.github.com/users/diego3g')
  const user = await response.json()

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  )
}
```

## Root loading.tsx

```typescript
// app/loading.tsx
export default function Loading() {
  return <p>Carregando...</p>
}
```

Comportamento: Ao abrir qualquer pagina da aplicacao que faz fetch assincrono, "Carregando..." aparece instantaneamente junto com o cabecalho do layout. Apos ~2s, os dados da API substituem o texto.

## Page.tsx do catalogo com fetch

```typescript
// app/catalog/page.tsx
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default async function Catalog() {
  await delay(2000)

  return <h1>Catálogo</h1>
}
```

Sem loading.tsx especifico na pasta catalog, o root loading.tsx era usado. O instrutor mostrou que ao acessar `/catalog`, aparecia "Carregando..." (do root loading) e depois "Catalogo".

## Loading especifico do catalogo (override)

```typescript
// app/catalog/loading.tsx
export default function CatalogLoading() {
  return <p>Carregando catálogo...</p>
}
```

Apos criar este arquivo, `/catalog` mostra "Carregando catalogo..." em vez de "Carregando..." generico.

## Demonstracao de proximidade — pagina de produto

```typescript
// app/catalog/product/[slug]/page.tsx
export default async function Product({
  params,
}: {
  params: { slug: string }
}) {
  await delay(2000)

  return <h1>Product: {params.slug}</h1>
}
```

Ao acessar `/catalog/product/any-slug`, o loading exibido era "Carregando catalogo..." (de `app/catalog/loading.tsx`), NAO "Carregando..." (do root), porque o Next busca o loading.tsx mais proximo.

## Demonstracao via curl (Streaming SSR visivel)

O instrutor rodou no terminal:

```bash
curl --no-buffer http://localhost:3000
```

**Primeiro chunk recebido imediatamente:**
```html
<html>
  <body>
    <div>Carregando...</div>
  </body>
</html>
```

**Segundo chunk recebido ~2s depois:**
```html
<div>
  <pre>{"login":"diego3g","id":2254731,...}</pre>
</div>
<script>
  // Script injetado pelo Next.js que substitui o loading pelos dados reais no DOM
</script>
```

Isso prova que uma unica requisicao HTTP envia os dados em dois momentos distintos, mantendo a conexao aberta — o conceito de Streaming SSR.

## Estrutura de arquivos final da aula

```
app/
├── layout.tsx              ← root layout (cabecalho)
├── loading.tsx             ← root loading ("Carregando...")
├── page.tsx                ← Home com fetch GitHub + delay 2s
└── catalog/
    ├── loading.tsx         ← loading especifico ("Carregando catalogo...")
    ├── page.tsx            ← Catalog com delay 2s
    └── product/
        └── [slug]/
            └── page.tsx    ← Product (herda catalog/loading.tsx)
```