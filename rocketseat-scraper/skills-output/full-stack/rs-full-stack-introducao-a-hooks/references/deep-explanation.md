# Deep Explanation: Introdução a Hooks no React

## Por que hooks existem

Antes dos hooks, componentes funcionais eram "burros" — não tinham estado nem ciclo de vida. Toda lógica complexa vivia em classes, com problemas conhecidos:

- **Lógica fragmentada**: `componentDidMount` + `componentDidUpdate` + `componentWillUnmount` espalhavam a mesma preocupação em 3 métodos
- **Reuso difícil**: HOCs e render props resolviam, mas criavam "wrapper hell"
- **`this` confuso**: binding de métodos e contexto de `this` eram fonte constante de bugs

Hooks resolvem os três problemas: uma função pode ter estado, efeitos são colocalizados por preocupação (não por momento do ciclo de vida), e custom hooks permitem reuso sem wrappers.

## Modelo mental: hooks como "conexões"

O instrutor enfatiza que hooks são a forma de "conectar" funcionalidades do React aos componentes. Pense neles como plugues:

- `useState` → plugue para **memória** (o componente lembra de valores entre renders)
- `useEffect` → plugue para **o mundo externo** (API calls, timers, DOM direto)
- Custom hooks → **adaptadores** que combinam múltiplos plugues em uma interface limpa

## Os dois hooks fundamentais

### useState — O mais básico e frequente

O `useState` é o hook mais utilizado. Ele cria uma variável reativa: quando seu valor muda via setter, o React sabe que precisa re-renderizar.

**Regra fundamental**: nunca mude estado diretamente. Sempre use o setter:
```typescript
// ERRADO — React não detecta a mudança
user.name = 'Novo nome'

// CORRETO — React re-renderiza
setUser({ ...user, name: 'Novo nome' })
```

### useEffect — Efeitos colaterais controlados

O `useEffect` é o segundo hook mais utilizado. Ele executa código "fora" do fluxo de renderização normal:

- **Sem array de dependências**: executa em TODO render (raramente desejado)
- **Array vazio `[]`**: executa apenas na montagem (equivalente aproximado ao `componentDidMount`)
- **Com dependências `[x, y]`**: executa quando `x` ou `y` mudam

**Cleanup function**: o retorno do useEffect é executado antes da próxima execução ou na desmontagem. Essencial para evitar memory leaks:

```typescript
useEffect(() => {
  const interval = setInterval(tick, 1000)
  return () => clearInterval(interval) // cleanup
}, [])
```

## Custom hooks — Criando seus próprios

O instrutor destaca que além de usar os hooks do React, você pode criar os seus próprios. Isso é poderoso porque:

1. **Encapsula lógica complexa** — o componente consumidor fica limpo
2. **Facilita testes** — teste o hook isoladamente
3. **Composição** — hooks podem usar outros hooks (incluindo custom hooks)

A única regra: o nome DEVE começar com `use` (convenção que o React usa para aplicar as regras de hooks).

## Regras dos hooks (Rules of Hooks)

Estas regras são invioláveis:

1. **Só chame hooks no top-level** — nunca dentro de `if`, `for`, ou funções aninhadas
2. **Só chame hooks em componentes funcionais ou custom hooks** — nunca em funções regulares
3. **A ordem dos hooks deve ser consistente entre renders** — por isso a regra #1 existe

O React identifica cada hook pela ordem em que é chamado. Se a ordem muda entre renders (por causa de um `if`, por exemplo), o React associa o estado errado ao hook errado.

## Perspectiva do instrutor

O instrutor posiciona `useState` e `useEffect` como **os dois hooks que você mais vai usar** — "de longe os mais utilizados". Outros hooks (useContext, useRef, useMemo, useCallback, useReducer) serão abordados em módulos subsequentes, mas o fundamento começa com esses dois.

A mensagem central: domine useState e useEffect primeiro, porque eles formam a base sobre a qual todos os outros hooks fazem sentido.