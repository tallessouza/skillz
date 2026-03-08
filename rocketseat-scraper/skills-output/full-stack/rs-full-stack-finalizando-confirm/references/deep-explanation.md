# Deep Explanation: Finalizando Confirm

## Por que uma tela de confirmação precisa de estrutura

O instrutor começa substituindo um simples `<h1>` por uma estrutura completa. A razão é que telas de confirmação são **pontos de decisão do usuário** — após submeter um formulário, o usuário precisa de:

1. **Feedback visual claro** — o ícone SVG grande (`w-28`) comunica sucesso instantaneamente
2. **Contexto textual** — o parágrafo explica o que acontece a seguir ("será analisada")
3. **Próxima ação óbvia** — o link "Nova solicitação" evita que o usuário fique perdido

## Importação de SVG como módulo

O instrutor importa `okSvg` de `../assets/ok.svg`. Isso é uma prática importante porque:

- O bundler (Vite/Webpack) valida que o arquivo existe em build time
- O asset recebe hash no nome para cache busting
- Se o arquivo for removido, o build falha em vez de gerar 404 silencioso em produção

## Composição com Flex Column + Gap

Em vez de usar `margin-bottom` individual em cada elemento, o instrutor usa `flex flex-col gap-6` no container. Isso:

- Centraliza o controle de espaçamento em um único lugar
- Facilita ajustes globais (mudar `gap-6` para `gap-8` afeta todos)
- Elimina o problema de "margin collapse" que acontece com margins verticais

## Responsividade com breakpoint `lg:`

O card usa `lg:w-[512px]` e `lg:rounded-xl`. A estratégia é:

- **Mobile first:** sem o breakpoint, o card ocupa 100% da largura (comportamento padrão de div)
- **Desktop:** com `lg:`, o card ganha largura fixa de 512px e bordas arredondadas
- O `rounded-xl` só aparece em desktop porque em mobile o card vai de borda a borda

## Hover com transition

O link de "Nova solicitação" usa `hover:bg-green-200 transition ease-linear`. O instrutor demonstra passando o mouse: "Passou o mouse, pronto, foi, volto. Maravilha."

A combinação `transition ease-linear` garante que a mudança de cor não seja abrupta. Sem transition, a mudança é instantânea e parece "quebrada".

## Padrão completo de navegação pós-submit

O fluxo demonstrado pelo instrutor:
1. Preenche formulário com dados de teste
2. Seleciona categoria ("outros")
3. Informa valor ("134.20")
4. Faz upload de arquivo (imagem)
5. Clica enviar → console.log mostra dados → redireciona para confirmação
6. Tela mostra "Solicitação enviada!" com ícone, texto e link
7. "Nova solicitação" redireciona de volta ao formulário

Esse é o padrão clássico de **Post/Redirect/Get** adaptado para SPA — o formulário submete, navega para a rota de confirmação, e o link volta para a rota inicial.

## Hierarquia visual com cores

O instrutor usa uma hierarquia de cores deliberada:
- **Título:** `text-green-100` — cor de destaque positiva, confirma sucesso
- **Descrição:** `text-gray-200` — tom secundário, informação complementar
- **Background:** `bg-gray-500` — container com contraste
- **CTA:** `bg-green-100` com `text-white` — botão de ação principal

Essa hierarquia guia o olho: ícone → título verde → texto cinza → botão verde.