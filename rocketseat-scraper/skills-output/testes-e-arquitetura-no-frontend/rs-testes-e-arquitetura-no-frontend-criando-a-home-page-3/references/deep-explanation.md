# Deep Explanation: Criando a Home Page

## Por que estruturar o layout desde o inicio?

O instrutor enfatiza que mesmo sem a sidebar pronta, o layout ja deve ser construido com `flex h-screen` no wrapper raiz. Isso evita refatoracao futura — quando a sidebar for adicionada, basta inserir o componente antes do `<main>` e o flexbox ja distribui o espaco corretamente.

## Decisao: section > div para semantica

O instrutor usa `<section>` para o wrapper da home e `<main>` para o conteudo principal no layout. Isso segue semantica HTML5: `<main>` indica o conteudo principal da pagina, enquanto `<section>` agrupa conteudo tematico.

## Estrategia de responsividade

O padding progressivo (`p-4 sm:p-6 md:p-8`) segue a filosofia mobile-first do Tailwind:
- **Base (mobile):** 16px — maximo de area util
- **sm (640px+):** 24px — mais respiro visual
- **md (768px+):** 32px — confortavel em tablets/desktop

O `max-w-3xl` (48rem = 768px) garante que o conteudo nao se espalhe demais em telas grandes, mantendo legibilidade.

## Overflow strategy

O `overflow-auto` vai no `<main>`, nao no body. Isso permite que a sidebar tenha sua propria estrategia de scroll independente. Se o overflow estivesse no body, sidebar e conteudo rolariam juntos.

## Placeholder como UX pattern

O instrutor cria a home com texto instrucional ("Selecione um prompt") em vez de deixa-la vazia. Isso e um padrao de UX chamado "empty state" — guia o usuario sobre o que fazer quando nao ha conteudo selecionado. O texto cinza (`text-gray-400`) indica que e secundario, nao o conteudo principal.

## Contexto do projeto

O projeto e um "Prompt Manager" — uma aplicacao Next.js para gerenciar prompts de IA. A home serve como estado inicial antes do usuario selecionar um prompt na sidebar. O instrutor menciona que futuramente:
- A sidebar tera listagem de prompts
- Navegacao usara o router do Next.js
- Filtros serao refletidos na URL para compartilhamento

## Container Postgres

O instrutor inicia o container Postgres via OrbStack no inicio da aula, mesmo sem usa-lo. Isso e uma pratica de preparacao — manter servicos dependentes rodando para evitar interrupcoes quando forem necessarios.