# Deep Explanation: Formulário de Busca no Next.js App Router

## Hard Navigation vs Soft Navigation

O conceito central desta aula é a diferença entre dois tipos de navegação no Next.js:

### Hard Navigation
Quando você usa `<form action="/search">` ou `<a href="/page">`, o browser faz a navegação nativa. Isso significa:
- Todo o JavaScript já carregado é descartado
- A aplicação inteira é recalculada do zero
- Cabeçalho, layout, webpack bundles — tudo recarrega
- Perde completamente o benefício de SPA (Single Page Application)

O instrutor demonstrou isso na aba Network do DevTools: ao fazer hard navigation, aparecem todos os chunks novamente — layout, page, hooks, elements, webpack, mainapp.

### Soft Navigation
Quando você usa `router.push()` ou o componente `<Link>` do Next.js:
- O Next faz a navegação via JavaScript
- Não precisa recalcular/recarregar todo o JS
- Apenas o conteúdo da nova página é carregado
- Layout, cabeçalho e JS compartilhado permanecem intactos

Na aba Network, ao fazer soft navigation, aparece apenas o chunk da página `search` — nenhum dos bundles base é recarregado.

### Por que `<Link>` existe
O instrutor faz a pergunta retórica: "por que será que eu não uso o `<a href>` e uso o `<Link>`, que é um componente do Next?" — a resposta é exatamente essa: `<Link>` faz soft navigation, `<a>` faz hard navigation.

## Por que extrair para Client Component

O `useRouter` e `useSearchParams` são hooks que só funcionam em Client Components (`'use client'`). Como o Header pode ser um Server Component (e é vantajoso que seja), a solução é extrair apenas o formulário de busca para um Client Component separado.

Isso é um padrão recorrente no App Router: manter o máximo possível como Server Component e extrair apenas as partes interativas para Client Components.

## FormData + Object.fromEntries como alternativa a useState

O instrutor destaca que existem várias formas de ler o valor do input (useState, refs, etc.), mas a mais simples é usar a API nativa do browser:

```typescript
const data = Object.fromEntries(new FormData(event.currentTarget))
```

`event.currentTarget` retorna o elemento que disparou o evento (o `<form>`). `FormData` extrai todos os campos nomeados. `Object.fromEntries` transforma isso em um objeto JavaScript simples.

## Preservação de estado com useSearchParams

O problema: ao dar F5 (refresh), o input perde o valor porque não há estado React persistido. A solução é ler o parâmetro `q` da URL usando `useSearchParams` e usá-lo como `defaultValue` do input.

Importante: usa-se `defaultValue` (não `value`) porque não queremos controlar o input via React — apenas definir o valor inicial. Isso é um input não-controlado, que é suficiente para este caso.

## Cuidado com imports do useRouter

Existem DOIS `useRouter` no Next.js:
- `next/navigation` → App Router (atual) ✓
- `next/router` → Pages Router (legado) ✗

Usar o import errado causa erros silenciosos ou comportamento inesperado.