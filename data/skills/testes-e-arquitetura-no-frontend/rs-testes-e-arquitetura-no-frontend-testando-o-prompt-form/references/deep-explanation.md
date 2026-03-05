# Deep Explanation: Testando o Prompt Form

## Por que mockar dependencias externas

No ambiente de teste com Jest, features do framework (como `useRouter` do Next.js) nao existem. O Jest roda em Node.js puro — nao ha browser, nao ha Next.js runtime. Quando o componente importa `next/navigation`, o Jest precisa de uma substituicao.

O `jest.mock('next/navigation')` intercepta a importacao e substitui pelo objeto que voce definir. Isso permite:
- Controlar o comportamento do `useRouter` (ex: espiar chamadas ao `refresh`)
- Testar o componente de forma isolada, sem dependencia do framework

## O padrao de mock com wrapper para server actions

O instrutor usa um padrao especifico para mockar server actions:

```typescript
const createActionMock = jest.fn()
jest.mock('@/app/actions/create-prompt', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}))
```

Por que o wrapper `(...args) => createActionMock(...args)` em vez de atribuir direto `jest.fn()`? Porque o `jest.mock` e hoisted (executado antes de qualquer codigo). Se voce referenciar uma variavel diretamente dentro do factory, o Jest pode nao conseguir resolve-la. O wrapper com spread args garante que a referencia ao mock funcione corretamente.

## Por que mocks quebram entre testes

O instrutor demonstra um bug real ao vivo: o teste de erro falhava porque o `refreshMock` do teste de sucesso anterior ainda retinha o estado de "foi chamado uma vez". Ele prova isso dando skip no teste de sucesso — e o de erro passa sozinho.

Isso acontece porque `jest.fn()` acumula chamadas. Sem reset, `toHaveBeenCalledTimes(0)` falha porque o mock ja foi chamado no teste anterior.

Solucao: `beforeEach` com `mockReset()` em todos os mocks compartilhados. O instrutor prefere `beforeEach` em vez de reset no final de cada teste porque:
- Fica mais explicito e centralizado
- Voce nao precisa lembrar de resetar em cada `it`
- O teste em si fica mais limpo

## `mockResolvedValueOnce` vs `mockResolvedValue`

- `mockResolvedValueOnce`: configura o retorno para UMA chamada. Ideal para testes isolados onde cada cenario precisa de um retorno diferente.
- `mockResolvedValue`: configura o retorno para TODAS as chamadas. Perigoso em testes compartilhados porque persiste.

## O `debug()` do render

O `render()` retorna um objeto com `debug()`. Ao chamar `debug()`, ele imprime no console toda a arvore HTML renderizada. Util para:
- Verificar se o componente esta renderizando os elementos esperados
- Encontrar placeholders, roles, e textos para queries
- Debugar quando um `getBy*` nao encontra o elemento

O instrutor mostra isso como curiosidade — nao deve ficar no codigo commitado.

## Cobertura 100% nao significa zero bugs

O instrutor enfatiza: apos esses dois testes (sucesso e erro), o componente `PromptForm` mostra 100% de cobertura. Mas cobertura mede quais LINHAS foram executadas, nao quais CENARIOS foram validados. Exemplos de gaps:
- E se o usuario submeter com campos vazios?
- E se a action retornar um formato inesperado?
- E se o tipo do input mudar?

A mentalidade correta: cobertura alta e melhor que baixa, mas nunca confie nela como prova de qualidade.

## userEvent vs fireEvent

O instrutor usa `userEvent` em vez de `fireEvent`. A diferenca:
- `fireEvent` dispara um evento sintetico diretamente no DOM
- `userEvent` simula a interacao real: foco, digitacao caractere por caractere, blur

`userEvent.type()` e assincrono porque simula a digitacao real. `userEvent.click()` tambem. Sempre usar `await`.