# Deep Explanation: Pagina de Busca — Next.js App Router

## Estrategia de desenvolvimento incremental

O instrutor segue uma abordagem pragmatica: primeiro monta a pagina com dados estaticos (hardcoded), depois conecta com a API. Isso permite validar visualmente o layout antes de lidar com a complexidade de data fetching.

### Por que comecar estatico?

1. **Feedback visual imediato** — voce ve o resultado no browser sem depender de API
2. **Isolamento de problemas** — se o layout esta errado, voce sabe que nao e problema de dados
3. **Velocidade de iteracao** — menos coisas podem quebrar quando voce esta so montando HTML/CSS

O instrutor explicitamente remove o `Promise` que existia na pagina (provavelmente um loading state) para "nao ficar atrapalhando o desenvolvimento". Isso reforça a ideia: remova fricção durante o desenvolvimento, adicione complexidade incrementalmente.

## Estrutura de rotas no App Router

A pagina de busca vive em `app/(store)/search/page.tsx`. O grupo de rotas `(store)` agrupa paginas que compartilham o mesmo layout de loja sem afetar a URL. Quando o usuario navega para `/search`, o Next.js renderiza essa page.

## Decisao de layout: Grid de 3 colunas

O instrutor escolhe `grid grid-cols-3 gap-6` — um grid simples de 3 colunas. Nao adiciona responsividade neste momento. A ideia e resolver o problema atual (mostrar resultados) sem over-engineering.

## Reutilizacao de componentes da Home

O instrutor copia o card de produto da home page diretamente. Em vez de criar um componente compartilhado (o que seria o ideal em producao), ele copia e adapta. Isso e pragmatico para a aula — mostra que a estrutura e a mesma, e depois pode ser refatorada.

### O que foi copiado do card da Home:
- `Link` envolvendo o produto inteiro
- `Image` com hover scale effect (`group-hover:scale-105`)
- Badge inferior com nome e preco
- Classes de estilizacao (rounded-lg, bg-zinc-900, overflow-hidden)

### O que foi removido/adaptado:
- `col-span` / `row-span` — na busca todos os cards tem o mesmo tamanho
- Dimensoes de imagem reduzidas para 480x480 (nao precisa ser grande na listagem)

## Armadilha do Number constructor

O instrutor tenta usar `new Number(129).toLocaleString(...)` e recebe um lint error: "Do not use Number as a constructor". Em JavaScript, `new Number()` cria um objeto wrapper, nao um primitivo. A solucao e usar o literal numerico diretamente com parenteses: `(129).toLocaleString(...)`.

## Proximo passo mencionado

O instrutor termina dizendo que precisa:
1. Conectar o input de busca do header a esta pagina (navegacao)
2. Fazer a pagina bater na API de busca que ja foi criada

Ou seja, esta pagina e o **esqueleto visual** — a logica vem na proxima etapa.