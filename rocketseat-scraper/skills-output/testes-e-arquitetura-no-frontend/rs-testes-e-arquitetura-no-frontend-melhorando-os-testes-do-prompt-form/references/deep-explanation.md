# Deep Explanation: Melhorando Testes do PromptForm

## Por que limpar inputs antes de digitar

O instrutor destaca um ponto sutil mas critico: quando um formulario esta em modo de edicao, os inputs ja vem pre-preenchidos com os valores existentes (title e content do prompt). Se voce usar `user.type()` diretamente, o Testing Library **concatena** o novo texto com o existente, ao inves de substituir.

Exemplo: se o input tem "old title" e voce faz `user.type(input, 'new title')`, o valor final sera "old titlenew title". Por isso, o `user.clear(input)` e obrigatorio antes de digitar.

## A armadilha do mock incompleto

O teste falhou inicialmente porque o mock do `updateActionMock` retornava apenas `{ success: true }`, mas o componente acessava `result.message` para exibir no toast. Como `message` era `undefined`, o `expect(toastSuccess).toHaveBeenCalledWith('Prompt atualizado com sucesso')` falhava.

Licao: **sempre verifique quais campos do retorno o componente consome** e inclua todos no mock.

## Piramide de testes — quando parar de duplicar

O instrutor faz uma reflexao importante sobre a piramide de testes:

```
        /\
       / E2E \        <- Caro, lento, fluxo completo
      /--------\
     / Integracao \   <- Interacao entre componentes
    /--------------\
   /   Unitarios    \ <- Rapido, barato, isolado
  /------------------\
```

**Principio:** a medida que voce sobe na piramide, nao repita cenarios ja cobertos nos niveis inferiores.

- **Unitario:** testou cenario de erro da action? Validado.
- **Integracao:** nao precisa re-testar o mesmo cenario de erro. Teste o fluxo de sucesso e a interacao entre componentes.
- **E2E:** teste apenas o fluxo completo do usuario.

**Razao economica:** testes mais altos na piramide sao mais caros (tempo de execucao, complexidade de setup, fragilidade). Duplicar cenarios desperdia recursos.

## Como identificar branches nao cobertas

O instrutor usa o coverage report para identificar que a linha 50 (o `if` que verifica se e update ou create) nao estava coberta. A branch estava em 87.5% ao inves de 100%.

Abordagem:
1. Rode `pnpm coverage`
2. Identifique linhas/branches nao cobertas
3. Escreva testes que forcem a execucao daquela branch especifica
4. Re-rode coverage para confirmar 100%

## makeSUT como factory flexivel

O padrao `makeSUT` (System Under Test) precisa ser flexivel o suficiente para receber props opcionais. Nos testes de criacao, nenhum prompt e passado. Nos testes de edicao, o prompt com id e passado.

A solucao: aceitar props opcionais com default para objeto vazio, evitando quebrar testes existentes ao adicionar novos parametros.