# Deep Explanation: Testando Sucesso na Deleção

## Filosofia: Teste antes da implementação

O instrutor demonstra um princípio fundamental de TDD aplicado a feedback de UI: **você pode validar que o toast de sucesso será exibido antes mesmo de ter a server action implementada**. Isso inverte a ordem natural que muitos devs seguem (implementar → depois testar).

A lógica é: se o teste exige que `toast.success` seja chamado com "Prompt removido com sucesso", o componente precisa ter essa chamada. Isso guia a implementação — o dev adiciona o `toast.success()` no componente para o teste passar, e depois implementa a action real.

## Por que mocar o sonner/toast?

O sonner é uma biblioteca de toasts que renderiza elementos visuais. Em testes unitários/integração, não queremos depender da renderização real do toast. Mocando o módulo inteiro, substituímos `toast.success` e `toast.error` por `jest.fn()`, que são funções espiãs — permitem verificar se foram chamadas e com quais argumentos.

O mock fica no topo do arquivo, fora de qualquer `describe` ou `it`, porque `jest.mock()` é hoisted automaticamente pelo Jest.

## Interação multi-step: o padrão de confirmação

O instrutor destaca que ações destrutivas geralmente têm um modal de confirmação. Isso significa que o teste precisa simular **dois cliques**:

1. Clique no botão de deletar → abre o modal/dialog de confirmação
2. Clique no botão "Confirmar remoção" → executa a ação

Sem o segundo clique, o teste não chega ao ponto onde o toast é chamado. O instrutor descobriu isso ao analisar a UI — "quando eu clico aqui, vai aparecer a confirmação, então eu vou ter que clicar e clicar na confirmação."

## Estado do componente e o dialog

O instrutor menciona que o estado de `isDelete` (que controla a visibilidade do dialog de confirmação) precisou ser ajustado. Inicialmente estava guardado de uma forma que o dialog não aparecia corretamente no teste. Ele moveu o estado e garantiu que o fluxo funcionasse.

## Preparação para o caminho triste

Ao criar o mock com `success: jest.fn()` e `error: jest.fn()`, o instrutor já prepara o terreno para o próximo teste — quando a deleção falha. Isso mostra pensamento incremental: resolva o happy path primeiro, depois o error path.

## Ordem de implementação guiada por testes

1. Escreve o teste que espera `toast.success` ser chamado
2. Teste falha (toast não é chamado em lugar nenhum)
3. Importa toast no componente e adiciona `toast.success('Prompt removido com sucesso')`
4. Teste passa — feedback validado
5. Próximo passo: implementar a action real de deleção