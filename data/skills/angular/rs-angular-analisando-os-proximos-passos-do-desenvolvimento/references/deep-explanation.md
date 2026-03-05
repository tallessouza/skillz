# Deep Explanation: Task Service como Fonte Unica de Verdade

## Contexto do instrutor

O instrutor faz um checkpoint antes de comecar a implementacao, reforçando a importancia de **planejar a ordem de desenvolvimento**. A mensagem central e: nao saia implementando features — primeiro estruture a base.

## Por que tres listas e nao uma?

O projeto GoTask e um kanban com tres colunas: To Do, Doing, Done. Cada coluna renderiza uma lista separada. Se voce mantiver uma unica lista e filtrar no template, toda mudanca de status forca re-renderizacao e filtragem. Com tres listas no service, cada coluna tem acesso direto aos seus dados.

## Fonte unica de verdade (Single Source of Truth)

O conceito e fundamental em Angular: um service `providedIn: 'root'` garante que todos os componentes compartilham a mesma instancia. Isso significa:

- Criar uma tarefa no dialog atualiza a coluna automaticamente
- Mover uma tarefa entre colunas e consistente em toda a aplicacao
- Excluir uma tarefa remove de qualquer lugar que a exiba

## Ordem de dependencia

O instrutor enfatiza que as funcionalidades tem dependencias claras:

1. **TaskService** — sem ele, nada funciona
2. **CRUD** — depende do service para saber onde colocar/remover
3. **Comentarios** — depende da tarefa existir
4. **Renderizacao** — depende das listas estarem populadas
5. **Movimentacao** — depende de tudo acima

Essa cadeia de dependencias e o motivo pelo qual o instrutor dedica um video inteiro so para mapear os proximos passos antes de codar.

## Principio geral

Em qualquer projeto Angular com gerenciamento de estado, a primeira coisa a construir e o service que centraliza os dados. Features sao construidas em cima dessa fundacao, nunca ao lado dela.