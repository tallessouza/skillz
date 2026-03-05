# Deep Explanation: Metadados de Paginas no Next.js

## Como o Next.js resolve metadata

O Next.js usa um sistema de merge hierarquico para metadata. O `layout.tsx` raiz define a base, e cada `page.tsx` pode sobrescrever campos especificos. O framework faz o merge automaticamente — nao e preciso repetir campos que ja estao no layout.

### O sistema de template

Quando voce define `title` como objeto com `template` e `default`:
- **template**: String com `%s` como placeholder. Quando uma pagina filha exporta `title: "Board"`, o `%s` e substituido → "Board | Product Roadmap"
- **default**: Usado quando a pagina filha NAO exporta titulo. Sem default, a aba ficaria sem titulo.

O instrutor destaca que o padrao comum e: `"Titulo da Pagina | Nome do App"` ou `"Titulo da Pagina - Nome do App"`. A barrinha vertical (`|`) e a convencao mais usada.

### Metadata estatico vs dinamico

O instrutor faz uma distincao importante:

**Estatico (`export const metadata`):**
- Valor conhecido em tempo de build
- Mais rapido, sem overhead de runtime
- Ideal para paginas como "Board", "Settings", "About"

**Dinamico (`generateMetadata`):**
- O instrutor usa o exemplo de uma pagina de produto especifico
- O titulo depende de um fetch — ex: buscar o nome do produto por ID
- A funcao pode ser `async` e fazer requisicoes HTTP
- Retorna `Promise<Metadata>`

### O que pode ir no metadata

O instrutor menciona que "quase todos os metatags" sao suportados:
- `title` e `description` (basicos)
- `openGraph` (compartilhamento em redes sociais)
- `twitter` (Twitter cards)
- `robots` (indexacao por buscadores)
- `icons` (favicons)
- E praticamente tudo que voce colocaria num `<head>` HTML

### Por que isso importa

O metadata no Next.js substitui completamente a necessidade de bibliotecas como `next/head` (Pages Router) ou `react-helmet`. E nativo do App Router e funciona tanto em server components quanto em paginas estaticas.

## Contexto do App Router

No App Router do Next.js, metadata e tratado como configuracao declarativa, nao como JSX. Isso permite que o framework otimize a geracao do `<head>` durante o build, ao inves de depender do runtime do React.