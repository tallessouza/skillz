# Deep Explanation: Mensagens de Erro com Computed Signals

## Por que computed e nao um signal manual?

O instrutor explica a cascata de signals: quando o `registerResource.error()` muda (porque uma requisicao falhou), a expressao dentro do `computed` e recalculada automaticamente. O retorno dessa expressao (uma string) e alocado como novo valor do signal `registerError`. Nao precisa setar nada manualmente — o Angular reage sozinho.

Essa e a diferenca fundamental entre:
- **Signal normal**: voce precisa chamar `.set()` para atualizar o valor
- **Computed signal**: ele recalcula baseado em uma expressao que contem outros signals

## O problema do catchError com rxResource

Na aula de login, o instrutor mostrou um bug: ao usar `catchError` no pipe do observable passado ao rxResource, o console exibe um erro dizendo que "a instancia nao e do tipo Error". Isso acontece porque o rxResource encapsula o erro de forma diferente — ele coloca o erro original na propriedade `.cause`.

A solucao "feia" seria usar `.pipe(catchError(...))` no observable e setar um signal manualmente. A solucao elegante e acessar `resource.error()` diretamente e processar via `setErrorMessage`.

## Como o setErrorMessage funciona

A funcao `setErrorMessage` foi criada em `shared/utils` e faz o seguinte:
1. Se nao ha erro (`!error`), retorna string vazia
2. Extrai o `HttpErrorResponse` da propriedade `.cause` do erro
3. Se nao tem status (sem conexao), retorna mensagem de offline
4. Se tem `error.message` (mensagem do backend), retorna ela
5. Caso contrario, retorna mensagem generica de erro inesperado

## Cascata de signals no Angular

```
formData signal muda
    → rxResource dispara nova requisicao
        → requisicao falha
            → registerResource.error() atualiza
                → computed recalcula setErrorMessage()
                    → registerError signal atualiza
                        → template re-renderiza
```

O instrutor enfatiza: "quando o valor desse signal muda, essa expressao e recalculada, toda essa expressao aqui e recalculada, e o retorno dela vai ser alocado para esse signal."

## Testando cenarios de erro

O instrutor demonstra dois cenarios:
1. **Campos vazios**: envia requisicao com payload vazio → backend retorna "Todos os campos são obrigatórios" (bad request 400)
2. **Aplicacao offline**: desconecta internet → mensagem "Sem conexão com a internet ou servidor offline"

Detalhe importante: para re-disparar a validacao, e preciso mudar o valor do formulario, porque senao o signal de request nao muda e o rxResource nao dispara novamente.