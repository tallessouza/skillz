# Deep Explanation: Testando Copy Button

## Por que Object.defineProperty para clipboard?

O `navigator.clipboard` e uma propriedade read-only do navigator. Tentar atribuir diretamente (`navigator.clipboard = ...`) falha silenciosamente ou lanca erro. O `Object.defineProperty` com `configurable: true` permite sobrescrever a propriedade para fins de teste, e o `configurable: true` garante que outros testes possam redefini-la.

## Fake Timers + UserEvent: por que precisam estar conectados?

O userEvent simula interacoes reais do usuario, incluindo delays internos (como debounce de cliques). Quando `jest.useFakeTimers()` esta ativo, esses delays internos do userEvent tambem ficam "congelados". Por isso e necessario passar `advanceTimers: jest.advanceTimersByTime` no setup do userEvent — isso permite que o userEvent avance os timers fake quando precisar de delays internos.

Sem essa configuracao, o teste trava esperando um timer que nunca avanca.

## findBy vs waitFor: quando usar cada um

O instrutor destacou que muitos desenvolvedores usam `waitFor` para tudo, mas existe uma alternativa mais limpa:

- **findBy**: retorna uma Promise que resolve quando o elemento aparece no DOM. Rejeita apos timeout (default 1s). Ideal para: "espere este elemento aparecer".
- **waitFor**: repete uma callback ate ela passar ou timeout. Ideal para: "espere ate que esta condicao complexa seja verdadeira" (ex: verificar propriedades, multiplas condicoes).

Regra pratica: se voce esta apenas checando `toBeInTheDocument()`, use `findBy`. Se precisa de `toBeDisabled()`, `toHaveBeenCalledWith()`, ou multiplas assertions, use `waitFor`.

## O papel do act()

O `act()` do React Testing Library garante que todas as atualizacoes de estado pendentes sejam processadas antes de continuar. Quando voce avanca timers com `jest.advanceTimersByTime()`, callbacks de setTimeout sao executadas, o que pode causar `setState`. Sem `act()`, o React reclama que atualizacoes de estado aconteceram fora do contexto esperado.

## Estrategia de cenarios de teste

O instrutor identificou 4 cenarios essenciais para um copy button:

1. **Botao desabilitado** — conteudo vazio, clipboard nao deve ser chamado
2. **Ciclo de copia completo** — copiar → copiado → (2s) → copiar
3. **Erro na copia** — clipboard rejeita, toast de erro exibido, label permanece "copiar"
4. **Limpeza de timer anterior** — ao copiar novamente antes do timeout, clearTimeout deve ser chamado

Esses 4 cenarios atingem 100% de cobertura. O instrutor reforçou que 100% de cobertura nao garante 100% dos comportamentos testados, mas e melhor ter 100% do que menos.

## Mock de toast (sonner)

O toast e um efeito colateral externo. Mockar o modulo inteiro (`jest.mock('sonner')`) e a abordagem correta porque:
- Evita renderizar componentes visuais do toast no teste
- Permite verificar `toast.error` com `toHaveBeenCalledWith`
- Isola o teste do componente de toast

## SpyOn em clearTimeout

Para testar que o timer anterior e limpo antes de iniciar um novo, o instrutor usou `jest.spyOn(window, 'clearTimeout')`. Isso verifica o comportamento defensivo do componente: ao clicar novamente enquanto o timer esta ativo, o timeout anterior deve ser cancelado para evitar conflitos de estado.