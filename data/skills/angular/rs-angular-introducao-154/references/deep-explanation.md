# Deep Explanation: Definicao de Fluxo de Dados em Angular

## Por que planejar antes de codar?

O instrutor da Skillz enfatiza um ponto que muitos desenvolvedores ignoram: **parar e pensar antes de implementar**. A frase chave e: "Para a gente nao ter dados voando para la, para ca, nao. Nos queremos algo organizado."

Isso reflete um problema real em aplicacoes Angular de medio/grande porte: sem um fluxo de dados bem definido, componentes acabam se comunicando de formas imprevisíveis — inputs encadeados, EventEmitters em cascata, services duplicados — e o resultado e uma aplicacao dificil de debugar e manter.

## O que definir antes de implementar

O instrutor lista explicitamente o que precisa ser definido:

1. **Estrutura da tarefa** — o modelo de dados (interface TypeScript)
2. **Lista de tarefas** — onde ela vive, quem a gerencia
3. **Responsabilidades dos modais** — quem abre, quem fecha, que dados passam
4. **Fluxo componente → service** — como dados circulam

## Diagramas como ferramenta reutilizavel

Um insight importante do instrutor: os diagramas criados para este projeto podem ser **reutilizados em projetos futuros**. Isso sugere criar templates de diagramas de fluxo de dados que sigam um padrao:

- **Diagrama 1:** Arvore de componentes com setas indicando fluxo de dados (Input/Output/Service)
- **Diagrama 2:** Fluxo de acoes do usuario (clicou → modal abriu → formulario preenchido → service chamado → lista atualizada)

## Conexao com arquitetura Angular

Em Angular, o padrao natural para esse planejamento e:
- **Services** como fonte unica de verdade (injetados via DI)
- **Components** como consumidores/apresentadores
- **Modals** como componentes efemeros com responsabilidade clara de quem os invoca

O planejamento previo evita o anti-pattern mais comum em Angular: componentes "gordos" que fazem tudo — buscam dados, gerenciam estado, abrem modais, e renderizam UI.