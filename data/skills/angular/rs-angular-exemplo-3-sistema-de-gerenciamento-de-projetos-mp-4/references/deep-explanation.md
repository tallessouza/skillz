# Deep Explanation: Organização de Features por Domínio

## O processo mental do instrutor

O instrutor demonstra um processo em 4 etapas que deve ser seguido sempre que se estrutura uma aplicação Angular:

1. **Listar requisitos** — Antes de qualquer decisão de arquitetura, enumere tudo que o sistema precisa fazer. No exemplo, foram: estruturar projetos, gerenciar tarefas, criação/movimentação/deleção, quadros Kanban, gerenciar membros, permissões, comentários, notificações, calcular métricas como burn down, tempo gasto em tarefas, relatórios.

2. **Parar e agrupar** — O instrutor enfatiza: "paramos um tempo, separamos aqui as responsabilidades, esses requisitos por responsabilidade, agrupamos eles e vamos dar o nome de domínio." Esse momento de pausa é intencional — não é para sair criando pastas imediatamente.

3. **Nomear domínios** — Cada grupo de requisitos recebe um nome que representa sua responsabilidade:
   - **Projetos e Tarefas**: estruturar projetos, gerenciar tarefas, quadros
   - **Colaboração e Usuários**: membros, permissões, comentários, notificações
   - **Relatórios e Análises**: métricas, burn down, tempo gasto, relatórios

4. **Mapear para Angular** — Cada domínio vira uma feature com rota:
   - Projetos e Tarefas → `/tasks` ou `/projects`
   - Colaboração e Usuários → `/collaboration`
   - Relatórios e Análises → `/reporting`

## Identificação de entidades por domínio

O instrutor lista explicitamente as entidades de cada domínio, o que é crucial para definir os models e services:

| Domínio | Entidades |
|---------|-----------|
| Projetos e Tarefas | Projeto, Tarefa, Quadro, Lista, Status |
| Colaboração e Usuários | Usuário, Equipe, Permissão, Comentário |
| Relatórios e Análises | Métrica de Tempo, Log de Atividades, Relatório |

Essa listagem de entidades é o que diferencia uma organização por domínio de uma organização arbitrária — as entidades são o critério objetivo para decidir o que pertence a cada feature.

## Analogia com Trello/Jira

O instrutor usa o Trello/Jira como referência familiar ("um Trello ou um Jira simplificado"). Isso ajuda a visualizar: mesmo num sistema aparentemente monolítico como o Trello, há domínios claramente separáveis. O quadro Kanban com suas listas e cards é um domínio. Os membros e permissões são outro. Os relatórios e métricas são outro.

## A importância da prática

O instrutor reforça várias vezes: "no dia a dia, é claro que vai depender de muita prática." A habilidade de identificar domínios e agrupar requisitos corretamente melhora com experiência. Não existe fórmula exata — o importante é seguir o processo (listar → agrupar → nomear → mapear) consistentemente.