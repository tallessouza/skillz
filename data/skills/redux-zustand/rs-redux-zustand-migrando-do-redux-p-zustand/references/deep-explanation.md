# Deep Explanation: Migrando do Redux para Zustand

## Por que Zustand e mais simples para acoes assincronas

O instrutor destaca que no Redux, acoes assincronas exigem `createAsyncThunk`, que funciona mas e "meio estranho". E o padrao da arquitetura Flux que o Redux segue. No Zustand, voce simplesmente cria um metodo `async` dentro do `create()` — e pronto. Nao precisa de middleware, nao precisa de thunks, nao precisa de cases separados para pending/fulfilled/rejected.

A vantagem concreta: o loading (`isLoading`) pode ser controlado dentro da propria acao. Antes da request, `set({ isLoading: true })`. Depois, `set({ isLoading: false })`. Tudo num unico lugar, ao inves de estar espalhado em reducers com cases.

## Eliminacao do Provider

Uma das maiores vantagens do Zustand e nao precisar de Provider global. O Redux usa Context API internamente, entao precisa de `<Provider store={store}>` envolvendo toda a aplicacao. Zustand acessa o estado diretamente — sem Context, sem wrapper. Isso simplifica o `App.tsx` e elimina uma camada de indireccao.

## useStore retorna tudo

No Redux, voce separa `useAppSelector` (para ler estado) e `useAppDispatch` (para disparar acoes). No Zustand, `useStore` retorna ambos — estado e funcoes — numa unica chamada. Isso elimina o conceito de "dispatch" completamente.

## Cuidado critico: selector obrigatorio

O instrutor enfatiza que esqueceu de mencionar inicialmente e corrigiu: **nunca use `useStore()` sem selector**. Sem selector, o componente observa TODO o estado e re-renderiza em qualquer mudanca. Sempre passe uma funcao seletora: `useStore(store => store.campo)`.

Isso e analogo ao `useAppSelector` do Redux — a diferenca e que no Zustand nao existe uma API separada, entao e facil esquecer e chamar `useStore()` vazio.

## Estrategia de migracao incremental

O instrutor demonstra uma abordagem pragmatica:
1. Remove o Provider do App (vai quebrar tudo)
2. Comenta os componentes que usam Redux
3. Testa o carregamento basico com `console.log`
4. Descomenta e migra componente por componente
5. Testa a cada etapa

Essa abordagem garante que voce identifica problemas cedo e nao tenta migrar tudo de uma vez.

## Hooks derivados migram facilmente

O hook `useCurrentLesson` que existia com Redux precisou de mudanca minima — apenas trocar `useAppSelector` por `useStore`. A logica de derivacao (pegar modulo e aula atual a partir dos indices) permaneceu identica. Isso mostra que a logica de negocios e independente da ferramenta de estado.