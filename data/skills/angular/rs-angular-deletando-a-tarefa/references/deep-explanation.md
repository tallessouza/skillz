# Deep Explanation: Deletando Tarefa com BehaviorSubject

## Por que filter() e não splice()?

O instrutor usa `filter()` para criar uma **nova lista** sem o item deletado. Isso é fundamental no Angular porque:

1. **Imutabilidade** — `splice()` muta o array existente. O BehaviorSubject não detecta mudança interna no array, apenas mudança de referência. Ao criar um novo array com `filter()`, a referência muda e `.next()` propaga corretamente.

2. **Change detection** — Angular (especialmente com `OnPush`) compara referências. Array mutado = mesma referência = sem re-render.

3. **Previsibilidade** — `filter()` é declarativo ("quero todos exceto X"), enquanto `splice()` é imperativo ("remova o item na posição N"). Filter é mais legível e menos propenso a bugs de off-by-one.

## Padrão de parâmetros: id + status

O instrutor destaca como desafio: "quais parâmetros esse método precisa receber?"

A resposta é `taskId` + `taskCurrentStatus` porque:
- O `taskId` identifica QUAL tarefa deletar
- O `taskCurrentStatus` identifica EM QUAL BehaviorSubject ela está (a aplicação GoTask tem BehaviorSubjects separados por status: todo, in-progress, done)

Sem o status, seria necessário buscar em todos os BehaviorSubjects — ineficiente e propenso a erros.

## Fluxo completo de deleção

```
Template (click) → Component.deleteTask() → Service.deleteTask(id, status)
  → getTaskListByStatus(status) → retorna BehaviorSubject correto
  → .value.filter(task => task.id !== id) → nova lista sem o item
  → behaviorSubject.next(newList) → todos subscribers atualizam
  → Colunas re-renderizam automaticamente sem lógica adicional
```

## Importância dos testes manuais

O instrutor enfatiza: "esses testes que eu estou fazendo aqui com você, é importantíssimo que você faça nos seus projetos". Ele demonstra:

1. Criar múltiplas tarefas
2. Mover entre colunas
3. Adicionar comentários em cada uma
4. Verificar que comentários e descrições refletem corretamente
5. Deletar e verificar que a mensagem "nenhuma tarefa disponível" aparece

O ponto é: **estresse as funcionalidades antes de considerar pronto**. Isso reduz bugs em produção.

## Sobre persistência

O instrutor menciona que a deleção funciona em memória, mas ao recarregar a página tudo se perde. Isso será tratado na próxima aula com persistência (provavelmente localStorage ou API).