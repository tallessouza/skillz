---
name: rs-redux-zustand-fundamentos-redux
description: "Applies Redux fundamentals and Flux architecture when writing React state management code. Use when user asks to 'manage global state', 'use Redux', 'implement Flux', 'choose state library', 'Redux vs Context API', or 'Zustand vs Redux'. Classifies state into local/global/server and selects appropriate tool. Make sure to use this skill whenever discussing React state management architecture or choosing between Redux, Zustand, Context API, or Jotai. Not for server-side rendering, API route design, or database state management."
---

# Fundamentos do Redux e Arquitetura Flux

> Classifique o tipo de estado (local, global, server) antes de escolher a ferramenta de gerenciamento.

## Rules

1. **Classifique o estado antes de escolher a ferramenta** — local state, global state e server state tem ferramentas diferentes, porque usar Redux para tudo era o erro da comunidade pre-2018
2. **Redux/Zustand = estado global centralizado (Store)** — uma unica store compartilhada entre toda a aplicacao, porque a arquitetura Flux exige centralizacao
3. **Context API/Jotai = estados descentralizados** — varios pequenos estados compartilhados entre subconjuntos de componentes, porque nem toda informacao precisa ser global
4. **Context API nao e gerenciamento de estado** — ela apenas compartilha informacoes entre componentes; para gerenciar estado com Context API, combine com useReducer, porque useReducer traz a arquitetura de reducers que o Redux usa
5. **Acoes nao alteram estado diretamente** — uma action apenas descreve O QUE o usuario fez; o reducer decide COMO alterar o estado, porque isso e arquitetura de eventos, nao mutacao direta
6. **Separe o estado em reducers por dominio** — carrinho, usuario, favoritos sao reducers separados dentro da mesma store, porque isso organiza um estado grande em pedacos gerenciaveis

## Classificacao de Estado

| Tipo | O que e | Ferramenta moderna | Exemplo |
|------|---------|-------------------|---------|
| **Local State** | Variavel dentro de um componente | `useState`, `useReducer` | Aba ativa, input value |
| **Global State** | Compartilhado entre toda a aplicacao | Redux, Zustand, Context+useReducer | Usuario logado, tema |
| **Server State** | Dados vindos de requisicoes HTTP | React Query, SWR, Redux Toolkit Query | Lista de produtos, detalhes |

## Arquitetura Flux

```
View (componentes)
    │
    ▼ dispara
  Action (descreve a intencao: "adicionar produto ao carrinho")
    │
    ▼ ouvida por
  Reducer (decide como alterar o estado)
    │
    ▼ atualiza
  Store (estado global centralizado)
    │
    ▼ reflete em
  View (interface atualizada)
```

## Comparativo de Ferramentas

| Ferramenta | Modelo | Quando usar |
|------------|--------|-------------|
| **Redux / Zustand** | Store centralizada, global | Estado compartilhado entre muitos componentes |
| **Context API + useReducer** | Semi-centralizado | Estado compartilhado simples, sem dependencias complexas |
| **Jotai / Recoil** | Atomico, descentralizado | Pedacinhos de estado entre subconjuntos de componentes |
| **React Query / SWR** | Server state | Cache e sincronizacao de dados do backend |

## Example

**Antes (Redux para tudo — anti-pattern antigo):**
```typescript
// Store com TUDO misturado: UI state + server state + local state
const store = {
  tabs: { activeTab: 0 },           // local state no Redux — desnecessario
  users: { data: [], loading: true }, // server state no Redux — use React Query
  auth: { user: null, token: '' },    // global state — este sim pertence aqui
}
```

**Depois (cada tipo de estado na ferramenta certa):**
```typescript
// Local state — useState no componente
const [activeTab, setActiveTab] = useState(0)

// Server state — React Query
const { data: users } = useQuery(['users'], fetchUsers)

// Global state — Redux/Zustand (apenas o que e verdadeiramente global)
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: '' },
  reducers: {
    login: (state, action) => { state.user = action.payload },
    logout: (state) => { state.user = null; state.token = '' },
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Informacao usada em 1-2 componentes proximos | useState (local state) |
| Informacao usada em componentes distantes na arvore | Redux/Zustand (global state) |
| Dados vindos de API REST/GraphQL | React Query/SWR (server state) |
| Projeto legado com Redux para tudo | Migre server state para React Query, mantenha Redux para global |
| Projeto novo simples | Context API + useReducer antes de adicionar Redux |
| Projeto novo com estado global complexo | Zustand (mais simples) ou Redux Toolkit |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Redux para estado de um unico componente | `useState` local |
| Redux para cache de requisicoes HTTP | React Query, SWR ou RTK Query |
| Context API sem useReducer e chamar de "gerenciamento de estado" | Combine Context API + useReducer |
| Confundir Context API com Redux | Context compartilha dados; Redux gerencia estado com arquitetura Flux |
| Actions que alteram estado diretamente | Actions descrevem intencao; reducers alteram estado |
| Um unico reducer gigante para tudo | Reducers separados por dominio (auth, cart, favorites) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
