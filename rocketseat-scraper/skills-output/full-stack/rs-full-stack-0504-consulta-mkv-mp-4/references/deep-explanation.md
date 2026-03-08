# Deep Explanation: Consulta — Form Submit sem Refresh

## Por que a pagina recarrega?

O comportamento padrao de um `<form>` HTML ao receber submit (Enter ou clique no botao submit) e fazer uma requisicao HTTP e recarregar a pagina. Isso vem da web tradicional, onde formularios enviavam dados para o servidor e a resposta era uma nova pagina HTML.

Em React (SPA), nao queremos esse comportamento. Precisamos interceptar o evento de submit e impedir o comportamento padrao com `preventDefault()`.

## O problema especifico da aula

O instrutor tinha uma funcao `fetchRefunds` sendo chamada tanto no `onSubmit` do form quanto no `useEffect`. O problema: o `useEffect` nao recebe um `React.FormEvent`, entao nao e possivel chamar `preventDefault()` dentro dele.

Ao colocar `fetchRefunds` diretamente no `onSubmit`, o evento de formulario nao era tratado — a funcao `fetchRefunds` nao esperava um evento como parametro e nao chamava `preventDefault()`.

## A solucao: separacao de responsabilidades

A estrategia e criar uma funcao intermediaria `onSubmit` que:

1. Recebe o `React.FormEvent`
2. Chama `e.preventDefault()` para impedir o refresh
3. Chama a funcao de busca (`fetchRefunds`)

Assim, cada funcao tem uma unica responsabilidade:
- `onSubmit` → trata o evento do formulario
- `fetchRefunds` → busca os dados
- `useEffect` → dispara a busca inicial ao montar o componente

## Analogia

Pense no `onSubmit` como um porteiro: ele intercepta a entrada (o evento), verifica se deve permitir o comportamento padrao (nao, nao deve — preventDefault), e entao encaminha para quem realmente faz o trabalho (fetchRefunds).

## Por que nao colocar preventDefault no fetchRefunds?

Porque `fetchRefunds` tambem e chamada pelo `useEffect`, que nao passa nenhum evento. Se voce adicionasse `e.preventDefault()` dentro de `fetchRefunds`, receberia um erro quando chamada pelo `useEffect` (evento seria `undefined`).

Voce poderia fazer `e?.preventDefault()`, mas isso mistura responsabilidades. A funcao de busca nao deveria saber nada sobre eventos de formulario.

## Enter vs Clique no botao

Ambos disparam o evento `submit` do formulario:
- **Enter** em qualquer input dentro do form → dispara submit
- **Clique em `<button type="submit">`** → dispara submit

Por isso, tratar o `onSubmit` do form cobre ambos os casos automaticamente. Nao e necessario adicionar `onKeyDown` para capturar Enter separadamente.

## Edge cases

- Se o formulario tiver apenas um input, Enter dispara submit automaticamente mesmo sem botao de submit
- Se voce usar `<button>` sem `type`, o padrao e `type="submit"` — cuidado com botoes que nao devem submeter o form (use `type="button"`)
- Em formularios com multiplos botoes submit, o `event.submitter` indica qual botao foi clicado