# Deep Explanation: Loading State com Skeleton Screen

## Por que loading states sao necessarios

O instrutor demonstra o problema simulando delay com `setTimeout` de 2 segundos na requisicao `getIssue`. Em localhost a requisicao e instantanea, entao o problema nao e visivel — mas em producao, qualquer fetch pode demorar. Sem feedback visual, o usuario ve uma tela em branco e nao sabe se a pagina quebrou ou esta carregando.

## Convencao do Next.js App Router

No App Router, qualquer pasta que tem `page.tsx` pode ter um `loading.tsx` ao lado. O Next detecta automaticamente e usa como fallback do Suspense boundary implicito. Nao precisa configurar nada — basta criar o arquivo e exportar um componente default.

O nome do componente exportado nao importa (`IssueLoading`, `Loading`, qualquer nome). O que importa e ser o export default do arquivo `loading.tsx`.

## Filosofia do Skeleton Screen

A ideia e criar uma "representacao da pagina sem os dados". O instrutor copia a estrutura da `page.tsx` (mesmas classes de layout, mesmos containers) e substitui o conteudo dinamico por blocos com `animate-pulse`.

Elementos que nao dependem de dados — como o link "Back to board" — ficam reais no loading. Isso da ao usuario contexto imediato de onde ele esta.

## Tecnica de inspecao para tamanhos

O instrutor mostra uma tecnica pratica: quando o skeleton parece grande demais, ele abre o DevTools, inspeciona o elemento real, ve que tem 28px de altura, e mapeia para a classe Tailwind correspondente (`h-7` = 28px). Mas ele tambem enfatiza que nao precisa ser exato — o conteudo varia (status com textos maiores ou menores) e o loading e transitorio.

## Evolucao para componente reutilizavel

O instrutor percebe que toda div de skeleton repete as mesmas 3 classes: `bg-nave-700`, `animate-pulse`, `rounded-lg`. Ao inves de manter isso duplicado, ele cria um `skeleton.tsx` que:

1. Define essas 3 classes como padrao
2. Recebe dimensoes via `className` (altura e largura)
3. Usa `twMerge` para merge seguro de classes Tailwind
4. Extende `ComponentProps<'div'>` para repassar qualquer prop HTML

Isso segue o mesmo padrao que eles usaram antes no curso com "TwinBird" (twMerge) — manter classes base no componente e permitir override/extensao via className.

## Simulando delay para testar

```typescript
import { setTimeout } from 'node:timers/promises'

// Dentro da server function:
await setTimeout(2000)
```

Essa tecnica e util durante desenvolvimento para testar loading states que seriam imperceptiveis em localhost.