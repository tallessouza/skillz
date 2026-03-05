# Deep Explanation: Atualizando Status de Itens entre BehaviorSubject Lists

## Por que receber o status atual como parametro?

O instrutor explica com clareza: "Eu nao quero ficar pegando o ID da tarefa e fazer um for em todas as listas da fonte de verdade, nas tres, ate encontrar essa tarefa. Eu ja quero saber em qual lista minha tarefa esta." Isso e uma otimizacao de design — quando voce tem o contexto de onde o drag iniciou (o CDK DnD ja fornece o container de origem), passe essa informacao adiante ao inves de recalcula-la.

## Objeto de lookup vs if/else/switch

Ao inves de criar um switch/case ou cadeia de ifs para mapear `TaskStatus.TODO -> this.todoTasks$`, o instrutor usa um pattern elegante: computed property names em um objeto literal.

```typescript
const obj = {
  [TaskStatus.TODO]: this.todoTasks$,
  [TaskStatus.DOING]: this.doingTasks$,
  [TaskStatus.DONE]: this.doneTasks$,
};
return obj[status];
```

Isso e mais extensivel (adicionar novo status = adicionar uma linha), mais limpo, e elimina complexidade ciclomatica.

## Fluxo de dados com BehaviorSubject

O BehaviorSubject tem duas facetas:
1. **`.value`** — acesso sincrono ao ultimo valor emitido (para leitura/manipulacao)
2. **`.next()`** — emite um novo valor E atualiza o `.value` interno

Quando voce faz `.next([...newArray])`, dois efeitos acontecem simultaneamente:
- O valor interno do BehaviorSubject e atualizado
- Todos os subscribers (templates com `| async`, outros services) recebem o novo valor

O instrutor enfatiza: "Quando eu faco um ponto next, alem de atualizar o valor do BehaviorSubject interno dele, eu vou estar emitindo esse novo valor como parametro para todo mundo que estiver inscrito no Observable."

## Por que criar novo array com spread?

Ao fazer `currentTaskList.next([...listWithoutTask])` ao inves de `currentTaskList.next(listWithoutTask)`, o instrutor garante imutabilidade — um novo array e criado. Isso e importante porque:
- O Angular (e o async pipe) detecta mudancas por referencia
- Um novo array = nova referencia = change detection dispara
- Evita side effects de mutacao acidental

## Tres etapas da movimentacao

1. **Atualizar propriedade** — `currentTask.status = taskNextStatus` (muta o objeto)
2. **Remover da lista origem** — `.filter()` cria nova lista sem o item, `.next()` emite
3. **Adicionar na lista destino** — spread da lista atual + novo item, `.next()` emite

O instrutor apresentou cada etapa como mini-desafio para o aluno, reforçando que a logica e simples quando decompostas (1 linha, 2 linhas, 1 linha).

## Erro real encontrado durante a aula

O instrutor encontrou um bug ao vivo: o case do switch no componente tinha o texto errado para a coluna "done" (`t down` ao inves de `done`), causando um "coluna nao identificada". Isso reforça a importancia de manter IDs de colunas consistentes entre template e logica.