# Deep Explanation: Cache & Memoization no Next.js App Router

## Dois conceitos distintos que se conectam

O instrutor Diego faz uma distincao fundamental:

- **Memoization** = nao repetir algo que ja foi calculado/buscado *dentro do mesmo contexto*. Vem do mesmo conceito do `useMemo`, `memo()`, `useCallback` do React. No mundo dos Server Components, isso significa: se o mesmo fetch (mesma URL, mesmos parametros) acontece 2x durante o carregamento de uma unica pagina, o React faz apenas 1 requisicao.

- **Cache** = armazenar dados para reutilizacao *entre contextos diferentes* (paginas diferentes, usuarios diferentes, acessos diferentes). Isso e especifico do Next.js — nao funciona em React puro ou outros frameworks.

### A analogia do fluxo

Memoization = "durante o carregamento desta pagina, nao repita". Se a Home renderiza 2 componentes que ambos fazem fetch de `/products/featured`, o React faz 1 chamada so.

Cache = "entre carregamentos diferentes, reutilize". Se o usuario carregou a Home (que busca `/products/featured`) e depois navega para outra pagina que tambem busca `/products/featured`, sem cache essa requisicao seria feita do zero. Com cache, os dados da primeira chamada sao reaproveitados.

## As tres opcoes de cache do Next.js

O Next.js estende a Fetch API nativa com opcoes adicionais:

### 1. `cache: 'force-cache'` (padrao)
- A requisicao e feita uma unica vez
- O resultado e cacheado por tempo indeterminado
- Todos os usuarios veem os mesmos dados
- Equivalente a gerar uma pagina estatica

### 2. `cache: 'no-store'`
- A requisicao e feita toda vez que alguem acessa a pagina
- Zero cache — dados sempre frescos
- Necessario para dados personalizados (recomendacoes, dashboards)

### 3. `next: { revalidate: N }` (o meio-termo)
- O primeiro usuario faz a requisicao real e o resultado e cacheado
- Pelos proximos N segundos, todos os usuarios recebem dados do cache
- Apos N segundos, o proximo acesso refaz a requisicao e atualiza o cache
- Exemplo do Diego: `60 * 60` = 1 hora, ou seja, no maximo 1 requisicao por hora ao backend

## O grande insight: arma e armadilha

Diego destaca que cache e "uma das maiores armas do Next, mas tambem um dos maiores problemas caso utilize da maneira incorreta". O exemplo concreto:

- **Correto**: produtos em destaque com `revalidate: 3600` — dados compartilhados que mudam pouco
- **Errado**: recomendacoes personalizadas (tipo YouTube) com `revalidate` — cachear recomendacoes mostraria as mesmas para todos os usuarios por 1 hora

A regra de ouro: **se o retorno da API muda por usuario, use `no-store`. Se e compartilhado, use `revalidate` com tempo proporcional a frequencia de mudanca.**

## Economia de backend

Diego enfatiza o impacto no backend: com `revalidate: 3600` em produtos em destaque, em vez de N requisicoes por hora (uma por usuario), voce faz exatamente 1. Em e-commerces com milhares de acessos, isso e uma reducao massiva de carga.