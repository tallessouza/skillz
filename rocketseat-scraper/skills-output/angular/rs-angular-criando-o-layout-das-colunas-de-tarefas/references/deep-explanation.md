# Deep Explanation: Layout de Colunas de Tarefas

## Filosofia mobile-first

O instrutor enfatiza que todo o desenvolvimento parte da visao mobile (390px de largura). A ideia e que se o layout funciona bem no mobile, ele naturalmente se adapta ao desktop com `flex-1`. Isso elimina a necessidade de media queries para esse componente.

## Por que flex-1 + min-w ao inves de larguras fixas

A combinacao `flex-1` + `min-w-[240px]` resolve dois problemas simultaneamente:
- No desktop: colunas crescem igualmente para preencher o espaco
- No mobile: colunas respeitam o tamanho minimo e ativam scroll horizontal

Se usasse `width: 33%`, as colunas seriam comprimidas em telas pequenas ao inves de ativar scroll.

## Overflow-x-auto como estrategia de scroll

O `overflow-x-auto` na div pai so ativa a barra de scroll quando o conteudo (colunas com `min-w-[240px]`) ultrapassa a largura do container. Em telas maiores, como `flex-1` faz as colunas se adaptarem, o scroll desaparece naturalmente.

## Separacao header/tarefas com flex-col + gap

Cada coluna e internamente organizada com `flex flex-col gap-6`:
- Primeira div: header com titulo + badge
- Segunda div: container de tarefas

O `gap-6` (24px) cria espaçamento consistente sem precisar de margins individuais. Isso e mais previsivel e facil de manter.

## Utility customizado vs CSS inline

O instrutor cria um `@utility scrollbar-hidden` no `styles.css` global ao inves de colocar CSS inline no componente. Isso segue o padrao do Tailwind de composicao por classes e permite reutilizar em qualquer elemento que precise esconder scrollbar.

A sintaxe usa `&::-webkit-scrollbar` com `display: none` — funciona em Chrome, Safari e Edge (Chromium). Para Firefox, seria necessario `scrollbar-width: none` adicionalmente.

## Cores dos badges por status

As cores nao sao aleatorias — seguem o Figma do projeto:
- **A fazer**: `bg-black` (neutro, ainda nao iniciado)
- **Fazendo**: `bg-[#FF850A]` (laranja, em progresso/atencao)
- **Concluido**: `bg-[#15BE78]` (verde, sucesso)

O badge usa `rounded-xl` (12px de border-radius) com padding assimetrico (`py-1 px-2`) para ficar em formato de pilula.

## Decomposicao de componentes

O instrutor extrai a secao de colunas para um componente `task-list-section` separado do `main-content`. Isso permite que futuramente:
- O componente receba dados via `@Input()`
- O badge de contagem se torne dinamico
- Os cards de tarefa sejam outro componente aninhado

## Processo de debug com cores

Tecnica usada pelo instrutor: aplicar `bg-amber-300`, `bg-amber-500`, `bg-amber-600` temporariamente nas divs para visualizar limites e espaçamentos. Depois de confirmar o layout, as cores sao removidas. Essa e uma pratica comum de debug visual com Tailwind.