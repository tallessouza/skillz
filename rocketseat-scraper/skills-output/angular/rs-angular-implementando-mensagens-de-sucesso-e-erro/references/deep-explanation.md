# Deep Explanation: Mensagens de Sucesso e Erro com Signals

## Por que computed e nao signal comum?

O instrutor explica que tanto `errorMessage` quanto `successMessage` sao `computed` porque **dependem de outro signal** — o `createMovieResource`. Nao ha necessidade de setar o valor manualmente depois, entao `computed` e suficiente. Ele contrasta com `linkedSignal`, que seria necessario apenas se o valor precisasse ser alterado externamente apos a derivacao.

A frase-chave do instrutor: "Nao tem por que ele ser um linked signal, um computed ja e o suficiente."

## O papel do setErrorMessage

A funcao `setErrorMessage` fica em `utils/` e e reutilizada entre componentes (o instrutor menciona que ja foi usada no register form). Ela recebe o erro do rxResource e extrai a mensagem legivel. Isso padroniza o tratamento de erros HTTP — seja falta de conexao ("Sem conexao com a internet ou servidor offline") ou bad request do back-end ("Todos os campos sao obrigatorios").

## hasValue() como indicador de sucesso

O `rxResource` expoe o signal `hasValue()` que indica se a operacao retornou um valor. O instrutor usa isso como proxy para "criacao bem-sucedida" — se o resource tem valor, a criacao funcionou. Isso e mais idiomatico do que checar `value() !== null` porque `hasValue` e um signal booleano dedicado.

## Estrutura do template

O instrutor copia a estrutura do `register-user-form.html` e substitui os nomes dos signals. Isso reforça o padrao: a mesma estrutura de `@if/@else if/@else` para feedback de formularios e reutilizada entre componentes, apenas trocando os signals.

Ele tambem envolve o bloco em uma `div` com `flex justify-end` para posicionar as mensagens a direita, proximo ao botao de salvar.

## Cenarios de erro demonstrados

1. **Sem internet**: desabilita a rede, clica em salvar → "Sem conexao com a internet ou servidor offline"
2. **Campo obrigatorio faltando**: remove o titulo, clica em salvar → back-end retorna bad request com "Todos os campos sao obrigatorios"
3. **Sucesso**: preenche todos os campos → "Filme criado com sucesso"

O `setErrorMessage` lida com ambos os cenarios de erro transparentemente.