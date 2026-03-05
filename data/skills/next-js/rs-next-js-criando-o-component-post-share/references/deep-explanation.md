# Deep Explanation: Separacao de Client e Server Components

## Por que separar?

No Next.js App Router, todo componente e server component por padrao. Isso significa que o React renderiza no servidor e envia HTML puro para o browser — zero JavaScript no client para esses componentes.

O problema surge quando voce precisa de interatividade. APIs como `useState`, `useEffect`, `onClick`, ou qualquer hook que dependa do browser (como `useShare` que acessa `navigator.share`) nao funcionam no servidor. Se voce coloca `'use client'` na pagina inteira, TUDO vira client component — voce perde os beneficios de server rendering para todo o conteudo estatico.

## O padrao "boundary isolation"

A ideia do instrutor e cirurgica: identifique o menor pedaco possivel que precisa ser client e extraia apenas ele. No exemplo da aula, uma pagina inteira de post (titulo, conteudo, metadados) era server component. Apenas o botao de compartilhar precisava de `useShare` (API do browser). Entao:

1. Criou `PostShare` como componente separado
2. Moveu apenas o `<aside>` com o botao para la
3. Adicionou `'use client'` so nesse componente
4. A pagina continuou server component

O resultado: "tudo isso daqui e server component, so esse pedacinho que nao" — nas palavras do instrutor.

## O erro classico

O instrutor demonstrou ao vivo: extraiu o componente mas ESQUECEU de adicionar `'use client'`. Resultado: erro em runtime porque o componente tentou usar APIs de browser sendo server component. Esse e o erro mais comum — lembrar de separar mas esquecer de marcar o boundary.

## Props com significado contextual

Detalhe sutil mas importante: o hook `useShare` espera uma prop `text`, mas no contexto do `PostShare`, esse valor e a descricao do post. O instrutor renomeou a prop de `text` para `description` e fez o mapeamento interno:

```typescript
share({ url, title, text: description })
```

Isso e nomenclatura pelo conteudo, nao pela estrutura — `description` tem significado no dominio do post, `text` e generico demais.

## Propagacao do boundary

Um ponto implicito: quando voce marca um componente com `'use client'`, todos os componentes importados por ele tambem se tornam client components. Por isso o isolamento e crucial — se voce marca a pagina como client, TUDO abaixo dela vira client, incluindo componentes que poderiam ser server.

## Estrutura de pasta

O instrutor usa o padrao de pasta com barrel export:
```
components/
  post-share/
    post-share.tsx   # implementacao
    index.ts          # barrel export
```

Isso permite importar como `from '@/components/post-share'` sem expor detalhes internos.