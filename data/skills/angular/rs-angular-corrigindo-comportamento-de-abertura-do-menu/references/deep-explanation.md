# Deep Explanation: LinkedSignal para Estado Reativo

## Por que linkedSignal existe?

O instrutor apresenta o problema de forma muito clara: existe um gap entre `computed` e `signal` puro.

- **computed**: reage automaticamente a mudancas de outros signals, mas e **read-only**. Voce nao consegue fazer `.set()` ou `.update()` nele.
- **signal()**: aceita `.set()` e `.update()`, mas nao tem reatividade automatica baseada em outros signals.
- **linkedSignal**: combina os dois — reage a mudancas de um signal fonte (source) E permite `.set()` / `.update()` manual.

## O problema concreto

O header e um componente que **nunca morre** — ele persiste em todas as rotas. Quando o usuario abre o menu mobile e clica em "Explorar Favoritos", a navegacao acontece mas o menu continua aberto porque nada disse para ele fechar.

## Cadeia reativa completa

```
router.events (Observable)
    │ pipe(filter(NavigationEnd))
    ▼
toSignal() → navigationEnd (Signal)
    │ source do linkedSignal
    ▼
linkedSignal({ source, computation: () => false })
    │ computation executa → retorna false
    ▼
isMenuOpen = false → menu fecha
```

Quando o usuario clica no botao toggle:
```
toggleMenu()
    │ this.isMenuOpen.update(current => !current)
    ▼
isMenuOpen = !current → menu abre ou fecha
```

## Por que nao computed?

O instrutor explica: "o computed eu nao consigo setar um valor nele posteriormente, so naquele momento da expressao". Se usasse computed, o toggle do botao nao funcionaria — voce nao pode fazer `computed.set(true)`.

## Por que nao subscribe manual?

O instrutor mostra que poderia usar `ngOnInit` + `subscribe` + `tap`, mas prefere converter para signal porque:
1. Signals integram melhor com o sistema reativo do Angular moderno
2. linkedSignal permite encadear a reatividade de forma declarativa
3. Nao precisa gerenciar unsubscribe manualmente

## toSignal — ponte RxJS → Signals

`toSignal` vem de `@angular/core/rxjs-interop`. Converte qualquer Observable em um Signal. Cada vez que o Observable emite, o Signal e atualizado. Isso permite usar observables existentes (como router.events) dentro do ecossistema de signals.

## Analogia com rxResource

O instrutor menciona que linkedSignal e "bem parecido com o rxResource" — ambos tem um `source` signal que, quando atualizado, dispara uma computacao/request. A diferenca e que linkedSignal e sincrono e local, enquanto rxResource faz requests assincronos.