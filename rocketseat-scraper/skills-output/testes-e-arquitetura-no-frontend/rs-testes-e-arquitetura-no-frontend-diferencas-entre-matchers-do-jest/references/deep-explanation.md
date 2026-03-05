# Deep Explanation: Matchers do Jest — toBeVisible vs toBeInTheDocument

## Por que animacoes quebram testes

Quando voce adiciona animacoes CSS (como Framer Motion) a componentes, elementos podem existir no DOM mas estar invisveis durante a transicao. O `toBeInTheDocument` nao detecta isso — ele so checa se o nodo existe na arvore DOM. Ja o `toBeVisible` checa propriedades CSS reais:

- `display` diferente de `none`
- `opacity` maior que `0`
- `visibility` diferente de `hidden`
- Elemento nao pode ter `hidden` attribute

O instrutor demonstrou isso na pratica: adicionou animacoes na sidebar (Framer Motion com `opacity: 0` initial), e 4 testes quebraram. Ao trocar `toBeVisible` por `toBeInTheDocument`, todos passaram — provando que os elementos existiam no DOM mas nao estavam visiveis.

## A solucao correta: ajustar o componente, nao o teste

O instrutor fez questao de nao "baixar o nivel" do teste trocando para `toBeInTheDocument`. Em vez disso, ajustou o componente:

1. Removeu `hidden` de botoes que deveriam ser visiveis no estado colapsado
2. Setou `initial={false}` nas animacoes Framer Motion para que o estado inicial nao tenha opacity 0
3. Manteve `toBeVisible` nos testes

Isso preserva a qualidade do teste — ele continua verificando o que o usuario realmente ve.

## Centralizacao de mocks: quando e por que

O `jest.mock('next/navigation')` aparecia em 3 arquivos: `PromptForm`, `SidebarContent`, e `PromptCard`. O instrutor centralizou no `jest.setup.ts` por dois motivos:

1. **DRY** — evitar duplicacao
2. **Cascata de dependencias** — quando `PromptCard` comecou a usar `useRouter`, o `PromptList` (que renderiza `PromptCard`) tambem quebrou. Centralizar o mock resolve todas as dependencias de uma vez.

A alternativa rejeitada foi mockar o `PromptCard` inteiro dentro do teste do `PromptList`. O instrutor disse explicitamente "eu nao gosto tanto da ideia" — porque perde a verificacao de integracao entre os componentes.

## Coverage 100% nao e suficiente

O instrutor mostrou que apos adicionar `router.refresh()` no `PromptCard`, o coverage continuava 100%. Mas o `refresh` nao estava sendo testado. Ele adicionou:

- `expect(refreshMock).toHaveBeenCalledTimes(1)` no caso de sucesso
- `expect(refreshMock).not.toHaveBeenCalled()` nos casos de erro

E validou que nao eram falsos positivos invertendo as assertions para confirmar que quebravam.

## Filosofia: explicito > implicito

O instrutor adicionou `beforeEach` com `mockReset` mesmo que os testes ja passassem. Sua justificativa: "sempre prefira deixar explicito do que deixar as coisas implicitas. Se acontecer algum erro, geralmente pode dar um pouquinho de trabalho pra debugar." Isso e defensive testing — prevenir problemas futuros de isolamento entre testes.