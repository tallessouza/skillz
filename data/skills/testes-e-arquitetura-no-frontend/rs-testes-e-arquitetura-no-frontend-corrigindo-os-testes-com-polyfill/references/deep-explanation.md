# Deep Explanation: Polyfills em Testes e Inversao de Dependencias

## O que e um polyfill (alem de navegadores)

A definicao classica de polyfill (Mozilla MDN) e: um pedaco de codigo que fornece funcionalidades modernas a navegadores mais antigos que nao suportam nativamente. Porem, polyfills vao muito alem de navegadores.

No contexto de testes, o ambiente jsdom (usado pelo Jest) nao implementa todas as APIs do Node.js ou do browser. Quando o Next.js importa server actions, internamente usa `TextEncoder` — que existe no Node e nos browsers modernos, mas nao no jsdom do Jest. O polyfill preenche essa lacuna.

### Analogia do instrutor

O instrutor usa o exemplo historico do `sessionStorage` no IE7: se a API nao existe naquele ambiente, voce cria uma implementacao simplificada que supre a necessidade. O mesmo principio se aplica ao ambiente de teste — o jsdom e como um "navegador antigo" que nao tem certas APIs.

## Por que nao mocar?

O instrutor e enfatico: mocks em excesso fazem os testes ficarem "nao muito reais, muito longe da realidade". Quando voce mocka tudo, esta programando o comportamento esperado — o teste valida o mock, nao o codigo.

### Hierarquia de test doubles (preferencia do instrutor)

1. **Fake** (preferido) — objeto simplificado que implementa a mesma interface. Tem comportamento real, so que mais simples.
2. **Stub** — retorna valores fixos, sem logica.
3. **Spy** — registra chamadas para verificacao.
4. **Mock** (evitar) — programa expectativas de comportamento. Ultimo recurso.

Todos sao "test doubles" (dublas de teste), mas fakes mantem a realidade porque implementam logica de verdade.

## Dependency Inversion Principle (DIP) aplicado a testes

O instrutor conecta o conceito ao SOLID (o D):

> "High-level modules nao devem depender de low-level modules. Ambos devem depender de abstracoes."

**Aplicacao pratica:**
- High-level module = seu componente ou use case
- Low-level module = Axios, Fetch, banco de dados
- Abstracao = interface (ex: `PromptRepository`, `HttpGateway`)

Quando o componente depende da interface (nao do Axios diretamente), nos testes voce substitui por um fake que implementa a mesma interface. Isso da controle total, inclusive para cenarios de erro.

## Gateway Pattern (Martin Fowler)

O instrutor cita diretamente Martin Fowler: "Software interessante raramente existe isoladamente." O gateway e um wrapper simples que encapsula acesso a recursos externos.

**Beneficios para teste:**
- Voce pode ter adapters diferentes (Fetch, Axios) da mesma interface
- No teste, o fake gateway pode simular erros facilmente com `throw new Error()`
- Testar cenarios de erro com Axios mockado e "sofrido"; com fake gateway e trivial

## Por que cenarios de erro sao o ponto critico

O instrutor destaca que testes de sucesso com mocks sao "relativamente simples", mas testes de erro sao "um pouquinho mais chatos". Com fakes + inversao de dependencia, basta fazer `throw new Error()` dentro do metodo do fake — controle total sem configuracao complexa de mock.