# Deep Explanation: Busca com Command Palette (cmdk)

## Por que levantar o estado de open/close

O instrutor enfatiza que o SearchBar nao pode controlar seu proprio estado de abertura porque ha multiplas fontes que precisam abrir/fechar a busca:

1. **Hotkey (Cmd+K)** — evento global de teclado
2. **Botao "Busca rapida"** na sidebar — click event
3. **Selecao de item** — precisa fechar apos navegacao
4. **Click fora** — o proprio cmdk gerencia via `onOpenChange`

A solucao e o padrao classico de React: levantar estado para o componente pai e passar `open` + `onOpenChange` como props. O instrutor explicitamente menciona que nao quer usar Context para isso — props simples sao suficientes.

## React Query cache sharing — a feature "muito legal"

O instrutor destaca com entusiasmo que o React Query automaticamente deduplica chamadas quando dois componentes usam a mesma query key:

- `Sidebar` usa `useQuery({ queryKey: ['documents'] })`
- `SearchBar` usa `useQuery({ queryKey: ['documents'] })`
- React Query percebe: "dois componentes buscando a mesma coisa ao mesmo tempo"
- Faz **uma unica chamada** e compartilha o resultado

O instrutor enfatiza: "se isso fosse uma chamada HTTP, que e muito mais custosa, ele faria uma unica vez." Isso e especialmente relevante em apps Electron onde a comunicacao IPC ja tem overhead.

**Implicacao pratica:** nao crie query keys diferentes para o mesmo recurso so porque componentes diferentes o consomem. A key identifica o RECURSO, nao o COMPONENTE.

## Plugin tailwind-scrollbar

O instrutor encontrou um bug visual ao vivo: a lista de resultados aparecia "bugada" com itens saindo do container. A causa era que as classes `scrollbar-thin`, `scrollbar-thumb-*` estavam sendo ignoradas porque o plugin `tailwind-scrollbar` nao estava instalado.

Passos para resolver:
1. `npm install tailwind-scrollbar`
2. Adicionar `require('tailwind-scrollbar')` no array `plugins` do `tailwind.config.js`
3. Reiniciar o dev server para garantir

## Fluxo de selecao de documento

O `Command.Item` tem uma prop `onSelect` que dispara quando o usuario da Enter no item focado. O instrutor implementa:

```
onSelect → handleOpenDocument(id) → navigate(`/documents/${id}`) → onOpenChange(false)
```

A ordem e importante: navegar PRIMEIRO, fechar DEPOIS. Se fechasse antes, poderia causar unmount antes da navegacao completar.

## Command.Empty — posicionamento correto

O `Command.Empty` do cmdk so aparece quando a busca nao retorna resultados (digitou algo que nao existe). Ele deve ficar como filho direto de `Command.List`, NAO dentro do `.map()`. O instrutor inicialmente hesitou sobre onde colocar e depois confirmou: "vai ficar fora mesmo" porque e um empty state da busca por texto, nao da lista vazia.