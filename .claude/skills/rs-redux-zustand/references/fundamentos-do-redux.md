---
name: rs-redux-zustand-fundamentos-do-redux
description: "Applies Redux fundamentals and Flux architecture principles when designing React state management. Use when user asks to 'manage global state', 'choose state library', 'Redux vs Context API', 'Zustand vs Redux', 'implement Flux pattern', or 'classify state types'. Classifies state into local/global/server categories and selects the appropriate tool for each. Make sure to use this skill whenever discussing React state management architecture or choosing between Redux, Zustand, Context API, Jotai, or React Query. Not for server-side rendering (use rs-next-js), API route design (use rs-node-js), or database state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: fundamentos
  tags: [redux, flux, state-management, react, zustand, context-api, architecture]
---

# Fundamentos do Redux e Arquitetura Flux

> Classifique o tipo de estado (local, global, server) antes de escolher a ferramenta de gerenciamento.

## Rules

1. **Classifique o estado antes de escolher a ferramenta** — local state, global state e server state tem ferramentas diferentes, porque usar Redux para tudo era o erro da comunidade pre-2018
2. **Redux/Zustand = estado global centralizado (Store)** — uma unica store compartilhada entre toda a aplicacao, porque a arquitetura Flux exige centralizacao
3. **Context API/Jotai = estados descentralizados** — varios pequenos estados entre subconjuntos de componentes, porque nem toda informacao precisa ser global
4. **Context API nao e gerenciamento de estado** — ela apenas compartilha dados entre componentes; combine com useReducer para gerenciar estado, porque useReducer traz a arquitetura de reducers
5. **Acoes nao alteram estado diretamente** — uma action descreve O QUE o usuario fez; o reducer decide COMO alterar o estado, porque Flux e arquitetura de eventos, nao mutacao direta
6. **Separe o estado em reducers por dominio** — carrinho, usuario, favoritos sao reducers separados na mesma store, porque organiza estado grande em pedacos gerenciaveis

## Classificacao de Estado

| Tipo | Ferramenta moderna | Exemplo |
|------|-------------------|---------|
| **Local State** | `useState`, `useReducer` | Aba ativa, input value |
| **Global State** | Redux, Zustand, Context+useReducer | Usuario logado, tema |
| **Server State** | React Query, SWR, RTK Query | Lista de produtos, detalhes |

## Arquitetura Flux

```
View (componentes) → Action (descreve intencao) → Reducer (decide como alterar) → Store (estado atualizado) → View
```

Varios reducers podem ouvir a mesma action. Ao adicionar produto ao carrinho, o reducer de carrinho adiciona o item e o reducer de analytics registra o evento.

## How to write

### Cada tipo de estado na ferramenta certa

```typescript
// Local state — useState no componente
const [activeTab, setActiveTab] = useState(0)

// Server state — React Query
const { data: users } = useQuery(['users'], fetchUsers)

// Global state — Redux/Zustand (apenas o verdadeiramente global)
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: '' },
  reducers: {
    login: (state, action) => { state.user = action.payload },
    logout: (state) => { state.user = null; state.token = '' },
  },
})
```

## Example

**Before (Redux para tudo — anti-pattern antigo):**
```typescript
const store = {
  tabs: { activeTab: 0 },           // local state no Redux — desnecessario
  users: { data: [], loading: true }, // server state no Redux — use React Query
  auth: { user: null, token: '' },    // global state — este sim pertence aqui
}
```

**After (cada tipo na ferramenta certa):**
```typescript
const [activeTab, setActiveTab] = useState(0)         // local
const { data: users } = useQuery(['users'], fetchUsers) // server
// Redux apenas para auth e theme (global)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Info usada em 1-2 componentes proximos | useState (local state) |
| Info usada em componentes distantes | Redux/Zustand (global state) |
| Dados de API REST/GraphQL | React Query/SWR (server state) |
| Projeto legado com Redux para tudo | Migre server state para React Query, mantenha Redux para global |
| Projeto novo simples | Context API + useReducer antes de adicionar Redux |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Redux para estado de um unico componente | `useState` local |
| Redux para cache HTTP | React Query, SWR ou RTK Query |
| Context API sem useReducer chamada de "gerenciamento" | Context API + useReducer |
| Actions que alteram estado diretamente | Actions descrevem intencao; reducers alteram |
| Um reducer gigante para tudo | Reducers separados por dominio |

## Troubleshooting

### "Preciso de Redux para tudo no meu projeto?"
**Symptom:** Desenvolvedor coloca local state e server state no Redux por habito.
**Cause:** Antes de 2018, nao existiam alternativas simples — Redux era a unica opcao para compartilhar estado.
**Fix:** Classifique cada pedaco de estado: local → useState, server → React Query, global → Redux/Zustand.

### Context API parece substituir Redux mas nao funciona igual
**Symptom:** Context re-renderiza todos os consumidores quando qualquer campo muda.
**Cause:** Context API compartilha dados mas nao gerencia estado — nao tem selectors granulares.
**Fix:** Combine Context + useReducer para casos simples, ou use Redux/Zustand para selecao granular.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-fundamentos-do-redux/references/deep-explanation.md) — Raciocinio completo sobre Flux, centralizacao vs descentralizacao, Jotai vs Zustand
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-fundamentos-do-redux/references/code-examples.md) — Comparativo Context API pura vs Context+useReducer vs Redux, e-commerce com slices
