# Deep Explanation: SSG e ISR na App Router

## De Pages Router para App Router — o que mudou

No Pages Router, a geracao estatica usava duas funcoes separadas:
- `getStaticPaths` — definia quais rotas gerar
- `getStaticProps` — buscava dados para cada rota, com opcao de `revalidate`

No App Router, tudo e simplificado:
- **`generateStaticParams`** substitui `getStaticPaths` — retorna apenas os parametros, sem o wrapper `{ paths, fallback }`
- **`export const revalidate = N`** substitui o `revalidate` dentro de `getStaticProps`
- **`export const dynamicParams = true|false`** substitui o `fallback: true|false|'blocking'` do `getStaticPaths`

## Por que o nome da funcao importa tanto

O instrutor cometeu um erro ao vivo: escreveu `generateStaticPaths` em vez de `generateStaticParams`. O Next simplesmente ignorou a funcao — sem erro, sem warning. Isso acontece porque o Next reconhece funcoes exportadas por convencao de nome exato. Se o nome nao bate, e tratado como uma exportacao qualquer.

Nomes que o Next reconhece em arquivos `page.tsx`:
- `generateStaticParams`
- `generateMetadata`
- `revalidate` (constante)
- `dynamicParams` (constante)
- `dynamic` (constante)

## Como o ISR funciona no App Router

O fluxo com `revalidate = 60`:
1. **Build time:** Next gera paginas estaticas para todos os params retornados por `generateStaticParams`
2. **Request dentro de 60s:** Serve a versao em cache (instantaneo)
3. **Request apos 60s:** Serve a versao em cache MAS dispara regeneracao em background
4. **Proximo request:** Recebe a versao atualizada

Isso significa que o primeiro usuario apos o periodo de revalidacao ainda recebe a versao antiga — e o proximo recebe a nova. Nao ha downtime.

## dynamicParams em detalhe

- `dynamicParams = true` (default): Se um usuario acessa `/blog/novo-post` que nao foi gerado em build, o Next tenta renderizar sob demanda, gera o HTML, e cacheia para proximos requests
- `dynamicParams = false`: Qualquer rota que nao foi retornada por `generateStaticParams` recebe 404 imediatamente

O instrutor comparou isso com o `fallback` do Pages Router:
- `fallback: false` → `dynamicParams = false`
- `fallback: true` / `fallback: 'blocking'` → `dynamicParams = true`

## Server Components e geracao estatica coexistem

Um ponto importante da aula: mesmo com `generateStaticParams`, o componente continua sendo um Server Component. A diferenca e QUANDO ele executa:
- Sem `generateStaticParams`: executa a cada request (server-side rendering)
- Com `generateStaticParams`: executa em build time (static generation) + opcionalmente em revalidacao

O resultado e o mesmo HTML — a diferenca e performance e custo de servidor.

## Observacao sobre console.log

O instrutor mostrou que `console.log(slug)` dentro da page so aparece no terminal do servidor, nunca no browser. Isso confirma que mesmo com SSG, o componente e executado no servidor (em build time). No browser, apenas o HTML resultante e entregue.