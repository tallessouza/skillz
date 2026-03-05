# Deep Explanation: Usabilidade em Formulários

## Por que limpar o formulário importa

O instrutor demonstra um padrão extremamente comum em aplicações web: formulários de entrada repetida. No projeto Refund, o usuário adiciona múltiplas despesas em sequência. Sem limpeza automática, cada nova entrada exige que o usuário:

1. Selecione o texto do campo nome
2. Delete
3. Mude o select
4. Selecione o texto do campo valor
5. Delete
6. Só então comece a digitar

São 5 ações extras multiplicadas por cada item. Em uma lista de 10 despesas, são 50 ações desperdiçadas.

## O insight do foco automático

O detalhe mais valioso da aula é o `expense.focus()` após limpar. O instrutor demonstra o fluxo completo por teclado:

1. Digita o nome → Tab
2. Seleciona categoria com seta → Tab
3. Digita valor → Enter
4. Formulário limpa e foco volta ao nome
5. Repete sem tocar no mouse

Essa é a diferença entre uma aplicação "funcional" e uma aplicação "profissional". O instrutor enfatiza: **"são detalhes, mas que contribuem muito para a experiência de quem vai usar"**.

## Ordem das operações

O instrutor coloca `formClear()` antes de `updateTotals()`. Isso é intencional:

- A limpeza visual é imediata — o usuário vê o formulário resetado
- A atualização de totais pode envolver cálculos — acontece em seguida
- Se houvesse erro no cálculo de totais, o formulário já estaria limpo para nova tentativa

## Função dedicada vs inline

O instrutor extrai a limpeza em `formClear()` ao invés de colocar `expense.value = ""` diretamente no `expenseAdd()`. Razões:

- Pode ser chamada em outros contextos (botão "Limpar", tecla Escape)
- Centraliza a lista de campos — se adicionar um campo novo, muda em um lugar só
- Nome autodocumentado — `formClear()` é mais legível que 4 linhas de `.value = ""`

## Resetar selects

`category.value = ""` faz o select voltar ao `<option value="">Selecione</option>`. Isso funciona porque o option padrão tem `value=""`. Se o placeholder não existir ou tiver outro valor, o select pode ficar em estado inconsistente.

## Fluxo teclado como métrica de qualidade

O instrutor demonstra Tab → Seta → Tab → Enter → automático volta ao início. Esse é um teste informal de usabilidade: se o usuário consegue completar o fluxo inteiro sem o mouse, a UX está boa para entrada repetida.