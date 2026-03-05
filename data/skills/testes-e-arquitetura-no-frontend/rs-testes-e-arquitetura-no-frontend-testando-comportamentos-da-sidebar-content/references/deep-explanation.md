# Deep Explanation: Testando Comportamentos da Sidebar Content

## Por que makeSUT?

O instrutor introduz o padrao **makeSUT (System Under Test)** como uma funcao que encapsula o `render()` do componente sendo testado. A motivacao imediata parece pequena — substituir uma linha por outra — mas o valor real aparece quando:

- Testes precisam de props diferentes (ex: sidebar inicialmente colapsada)
- Providers ou wrappers sao necessarios (ex: ThemeProvider, Router)
- Setup complexo precisa ser compartilhado entre testes

O instrutor enfatiza: "Isso aqui vai ser muito util daqui a pouco. Talvez voce olhar agora e falar, nao faz tanta diferenca. Daqui a pouco, vai fazer muita diferenca."

## getByRole e acessibilidade

O instrutor faz uma conexao forte entre **testes e acessibilidade**: ao usar `getByRole`, voce e forcado a usar tags semanticas (`aside` = `complementary`, `button`, `banner`, etc.). Isso cria um ciclo virtuoso:

1. Teste exige `getByRole('button', { name: /minimizar/i })`
2. Componente precisa de `title` ou `aria-label` para o teste funcionar
3. Resultado: componente mais acessivel

O caso concreto na aula: o botao de colapsar nao tinha `title` nem `aria-label`, apenas um icone. O teste quebrou porque `getByRole` nao conseguiu encontra-lo. A solucao foi adicionar ambos os atributos — melhorando a acessibilidade do componente como efeito colateral do teste.

## getBy vs queryBy vs findBy — quando usar cada um

O instrutor explica as tres variantes de queries do Testing Library:

| Query | Retorno quando nao encontra | Uso |
|-------|----------------------------|-----|
| `getBy` | **Lanca erro** | Quando o elemento DEVE existir |
| `queryBy` | **Retorna null** | Quando voce quer verificar que o elemento NAO existe |
| `findBy` | **Retorna Promise** | Quando o elemento vai aparecer de forma assincrona |

O erro classico: usar `getByRole` para verificar que um elemento nao esta no DOM. Como `getByRole` lanca erro quando nao encontra, o teste falha antes mesmo de chegar ao `expect`.

## Renderizacao condicional vs CSS hidden

Ponto importante do instrutor: no caso da sidebar, o botao de expandir **nao existe no DOM** quando a sidebar esta expandida. Nao e que ele esta oculto com CSS — ele simplesmente nao e renderizado (renderizacao condicional com `&&`). Por isso `queryByRole` retorna null, e `not.toBeInTheDocument()` e a asserção correta.

Se o elemento existisse mas estivesse oculto via CSS, a asserção correta seria `not.toBeVisible()`.

## userEvent vs fireEvent

O instrutor usa `userEvent` (de `@testing-library/user-event`) em vez de `fireEvent`. A diferenca:

- `fireEvent.click()` dispara um unico evento de click sincrono
- `userEvent.click()` simula a sequencia completa de eventos que um usuario real produziria (mousedown, mouseup, click, etc.) e e assincrono

Por isso o teste precisa ser `async` e usar `await user.click()`.

## O valor dos testes contra regressao

O instrutor demonstra ao vivo: comenta o `onClick` do botao de colapsar e o teste quebra imediatamente. Isso exemplifica o conceito de **regressao** — quando algo que funcionava para de funcionar apos uma alteracao.

A analogia do instrutor: "Imagina que voce tenha varios elementos. Voce comeca com um projeto simples, uma tela, poucos componentes. E toda vez que voce tem alguma modificacao ali, voce vai la e testa manual de novo. Clica aqui. Nao, esta funcionando... So que daqui a pouco, essa tela vai ficando cada vez mais complexa."

Testes automatizados escalam; testes manuais nao.