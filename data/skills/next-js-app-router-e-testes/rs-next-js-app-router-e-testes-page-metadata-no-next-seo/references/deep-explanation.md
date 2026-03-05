# Deep Explanation: Page Metadata no Next.js (SEO)

## Por que metadata importa no App Router

No Next.js App Router, metadados sao a forma declarativa de compor as meta tags do `<head>` HTML. Diferente do Pages Router onde voce usava `<Head>` component, no App Router voce exporta um objeto ou funcao tipados.

O tipo `Metadata` do Next.js cobre todas as tags comuns: title, description, keywords, icons (PWA), manifest, openGraph, twitter, robots, sitemap. Ao dar Ctrl+Space no objeto, todas as opcoes aparecem com autocomplete.

## Sistema de heranca e substituicao

Metadados sao **herdados e substituiveis** na arvore de componentes:

1. `app/layout.tsx` define metadata base (titulo, favicon)
2. Qualquer pagina filha pode exportar `metadata` que **substitui** os valores do layout
3. Se a pagina nao exporta metadata, o layout prevalece

Essa substituicao e por campo — se a pagina so define `title`, o `description` do layout continua valendo.

## Title template: o padrao %s

O instrutor destaca um pattern elegante: ao inves de cada pagina repetir "| DevStore" no titulo, o layout raiz usa template:

```typescript
title: {
  template: '%s | DevStore',  // %s = titulo da pagina filha
  default: 'DevStore',         // fallback se nenhum titulo for passado
}
```

Isso significa:
- Pagina exporta `title: 'Home'` → browser mostra "Home | DevStore"
- Pagina nao exporta titulo → browser mostra "DevStore"
- Pagina de produto exporta `title: 'Camiseta'` → "Camiseta | DevStore"

## generateMetadata: metadados dinamicos

Para paginas com rotas dinamicas (`[slug]`), o titulo depende de dados do servidor. A funcao `generateMetadata` resolve isso:

- Recebe os mesmos `params` que o componente da pagina
- E async — pode fazer fetch de dados
- Retorna `Promise<Metadata>`
- Executa no servidor antes do render

## Memoizacao: a magia da deduplicacao

O ponto mais sutil da aula: quando `generateMetadata` e o componente da pagina chamam a **mesma funcao fetch com os mesmos argumentos**, o React Server Components detecta isso e **deduplica automaticamente**.

Isso significa que voce pode chamar `getProduct(slug)` tanto no `generateMetadata` quanto no `ProductPage` sem preocupacao — a chamada HTTP acontece apenas uma vez. O React identifica:
1. Mesma URL de fetch
2. Mesmos parametros
3. Dentro da mesma pagina (mesmo request)

E automaticamente reutiliza o resultado. Nao precisa de cache manual, Context, ou prop drilling.

## Analogia do instrutor

O instrutor usa o termo "deduplicar" — remover a duplicacao. E enfatiza: "nao tem problema eu fazer uma chamada HTTP tanto aqui no generateMetadata quanto no ProductPage, o React vai automaticamente deduplicar". Isso libera o desenvolvedor para pensar em termos de **o que cada parte precisa**, sem otimizar manualmente.