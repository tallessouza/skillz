# Deep Explanation: Listando Projetos no Dropdown

## Por que Skeleton ao inves de Spinner

O Diego enfatiza que Spinners genericos ("um monte de spinner na aplicacao") criam uma experiencia estranha. O Skeleton do shadcn/ui e um componente que renderiza um placeholder animado com as dimensoes aproximadas do conteudo real. Isso da ao usuario uma previsao visual do que vai aparecer, reduzindo a percepcao de tempo de espera.

## Estrategia de verificacao de dados async

Quando se usa React Query (ou similar), o retorno inicial e `undefined`. O Diego mostra o raciocinio de nomeacao: ele primeiro tenta `const { projects } = useQuery(...)` mas percebe que isso causaria `projects.projects` ao acessar o resultado. Entao manteve `data` como nome do retorno e acessa `data.projects`.

A checagem `if (data)` antes do `.map()` e essencial porque no primeiro render os dados ainda nao carregaram.

## Estrutura de rotas dinamicas no Next.js App Router

A estrutura de pastas segue o padrao:
```
app/
  org/
    [slug]/
      project/
        [project]/
          page.tsx
```

O Diego deliberadamente usa `project` (singular) para a pasta, mantendo consistencia com `org` (singular) no nivel acima. O slug do projeto reutiliza o nome `project` nos params.

## O problema do flex shrink

Quando o Skeleton de texto usa `w-full`, ele tenta ocupar todo o espaco disponivel dentro do flex container do trigger. Isso faz com que o Skeleton circular (avatar) seja comprimido. A solucao e `shrink-0` (que mapeia para `flex-shrink: 0`), impedindo que o elemento diminua.

O Diego menciona que `flex-1` no elemento de texto tambem resolveria, porque daria a ele a propriedade de crescer sem comprimir os siblings. "CSS nunca foi uma coisa que a gente tem uma unica solucao" — ambas abordagens funcionam.

## Tecnica de delay artificial para testar loading

Para visualizar o estado de loading durante desenvolvimento, o Diego adiciona um delay temporario na funcao de fetch:

```typescript
await new Promise(resolve => setTimeout(resolve, 2000))
```

Ele mesmo se lembra de marcar com um comentario para remover depois. Essa tecnica e util para garantir que o Skeleton esta visualmente correto antes de ir para producao.

## Derivando estado ativo dos URL params

O `currentProject` nao e armazenado em state — e derivado dos params da URL e dos dados carregados. Isso segue o principio de "URL como fonte de verdade" no Next.js:

```typescript
const currentProject =
  data && projectSlug
    ? data.projects.find((p) => p.slug === projectSlug)
    : null
```

O `find` pode retornar `undefined` se o slug nao corresponder a nenhum projeto, o que e tratado graciosamente no render.

## Icone de loading no chevron

Em vez de simplesmente esconder o chevron durante loading, o Diego substitui por um `Loader2` com `animate-spin`. Isso da feedback visual de que algo esta acontecendo, sem ocupar espaco adicional. O `shrink-0` tambem e aplicado ao chevron/loader para manter tamanho consistente.