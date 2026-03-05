# Deep Explanation: Funções de Manipulação de Lista com Try-Catch

## Por que separar criação do objeto da inserção?

O instrutor demonstra um padrão claro: primeiro cria-se o objeto `newExpense` com todos os detalhes (id, nome, categoria, valor), e só depois chama a função `expenseAdd(newExpense)`. Isso não é acidental.

Quando você mistura a criação do objeto com a lógica de inserção na lista, qualquer erro na construção do objeto se confunde com erros de manipulação do DOM. Separando:
- Se o objeto tem dados errados → o problema está na criação
- Se a lista não atualiza → o problema está na função de adição

Cada parte tem uma responsabilidade e um ponto de falha isolado.

## O padrão try-catch com feedback duplo

O instrutor enfatiza dois canais de comunicação no catch:

1. **`console.log(error)`** — Para o desenvolvedor. Mostra o stack trace, a mensagem técnica, o que realmente aconteceu. É o que você olha no DevTools (botão direito → inspecionar → console).

2. **`alert("Não foi possível atualizar a lista de despesas.")`** — Para o usuário. Mensagem genérica, sem jargão. O usuário não precisa saber que houve um `TypeError` na linha 42. Ele precisa saber que a ação dele não funcionou.

## Testando o fluxo de erro

O instrutor demonstra uma técnica prática: colocar `throw new Error("erro de teste")` dentro do try para forçar a execução do catch e verificar que:
- O alert aparece para o usuário
- O console mostra a mensagem técnica

Depois de confirmar que funciona, remove o throw. É um teste manual rápido que valida o fluxo de exceção antes de continuar o desenvolvimento.

## Por que `expenseAdd` e não `addExpense`?

O instrutor usa o padrão `substantivo + verbo` (`expenseAdd`), agrupando funções por recurso. Todas as funções de despesa começam com `expense`: `expenseAdd`, `expenseRemove`, `expenseUpdate`. Isso facilita autocompletar no editor e agrupar funções relacionadas.

## O fluxo completo do instrutor

1. Evento de submit captura dados do formulário
2. Cria objeto `newExpense` com os dados validados
3. Chama `expenseAdd(newExpense)` — função separada, responsabilidade única
4. Dentro de `expenseAdd`: try-catch protege a manipulação da lista
5. Na próxima etapa (aula seguinte): dentro do try, monta os elementos do DOM

A função `expenseAdd` será expandida para criar elementos HTML (ícone, nome, categoria, valor, botão deletar), mas a estrutura try-catch já está pronta para proteger toda essa lógica.