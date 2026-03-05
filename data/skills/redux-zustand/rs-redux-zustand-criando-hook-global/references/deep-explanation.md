# Deep Explanation: Criando Hook Global de Seletor

## Por que extrair hooks de selecao?

O instrutor identifica um problema pratico muito comum em aplicacoes Redux: a logica de selecao de estado se repete em multiplos componentes. No exemplo da aula, tanto o Header quanto o Video precisam acessar o modulo e a aula ativos. Sem o hook, cada componente repete toda a logica de derivacao (pegar indices, buscar no array de modulos, buscar a lesson).

O insight central e: **seletores sao a API publica do seu estado**. Assim como voce nao expoe a estrutura interna de um banco de dados diretamente para a UI, voce nao deveria expor a estrutura interna do slice para cada componente.

## Por que no slice e nao em pasta de hooks?

O instrutor exporta `useCurrentLesson` diretamente do arquivo do slice (`player.ts`). Isso nao e acidental — o hook depende intimamente da estrutura do estado (`currentModuleIndex`, `currentLessonIndex`, `course.modules[]`). Se a estrutura do slice mudar, o hook precisa mudar junto. Co-localizando os dois, voce garante que mudancas no slice atualizam o hook no mesmo commit.

Se o hook estivesse em `hooks/useCurrentLesson.ts`, seria facil esquecer de atualiza-lo quando o slice muda, criando bugs sutis.

## Destructuring seletivo como otimizacao implicita

Quando o instrutor mostra `const { currentLesson } = useCurrentLesson()` no Video.tsx (ignorando `currentModule`), ele demonstra um padrao importante: o componente declara explicitamente o que precisa. Isso e possivel porque o hook retorna um objeto (nao um array), permitindo que cada consumidor pegue apenas os campos relevantes.

## Side effects pertencem ao componente

O instrutor mostra um exemplo pratico: mudar o `document.title` quando a aula muda. Ele faz isso com `useEffect` no componente `Player.tsx`, nao dentro do hook. Essa separacao e fundamental — o hook e puro (apenas selecao), e o componente decide o que fazer com o dado.

O instrutor tambem menciona React Helmet como alternativa para manipular o titulo da pagina, mas opta por `document.title` direto por simplicidade. A escolha do Helmet vs `document.title` e ortogonal ao padrao do hook — ambos seriam side effects no componente.

## Escalabilidade do padrao

O instrutor menciona que "em qualquer lugar que eu queira ter acesso" pode usar o hook. Isso revela a visao de design: o hook e uma API estavel para consumir dados derivados do player. Se amanha o titulo da aula precisar aparecer em um breadcrumb, sidebar, ou notificacao, basta importar `useCurrentLesson()`.

## Quando NAO extrair

O padrao so faz sentido quando ha repeticao real ou previsivel. Uma selecao usada em apenas um componente nao precisa de hook — extrair prematuramente adiciona indirection sem beneficio. O gatilho para extrair e: "estou copiando essa mesma logica de useSelector para outro componente".