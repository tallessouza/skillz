# Code Examples: Fundamentos do Redux e Arquitetura Flux

## Comparativo: Context API pura vs Context API + useReducer vs Redux

### Context API pura (compartilhamento, nao gerenciamento)

```typescript
// Apenas compartilha dados — sem arquitetura de alteracao
const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Qualquer componente pode chamar setUser diretamente
  // Nao ha estrutura, nao ha historico, nao ha actions
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Context API + useReducer (se aproxima do Redux)

```typescript
// Agora sim temos gerenciamento: actions + reducer
type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    default:
      return state
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, isAuthenticated: false })

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

// Componente dispara action — nao altera estado diretamente
function LoginButton() {
  const { dispatch } = useAuth()
  
  const handleLogin = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user }) // action descreve intencao
  }
}
```

### Redux (store centralizada com Flux completo)

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit'

// Reducer separado por dominio
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

// Store centralizada — combina todos os reducers
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // cart: cartSlice.reducer,
    // favorites: favoritesSlice.reducer,
  },
})

// Componente dispara action via dispatch
function LoginButton() {
  const dispatch = useDispatch()
  
  const handleLogin = (user: User) => {
    dispatch(authSlice.actions.login(user))
  }
}
```

## Exemplo: E-commerce com reducers separados

```typescript
// Reducer de carrinho
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      state.items.push({ product: action.payload, quantity: 1 })
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload)
    },
  },
})

// Reducer de favoritos
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { productIds: [] as string[] },
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.productIds.indexOf(action.payload)
      if (index >= 0) {
        state.productIds.splice(index, 1)
      } else {
        state.productIds.push(action.payload)
      }
    },
  },
})

// Store combina tudo
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
})
```

## Classificacao de estado na pratica

```typescript
// ❌ TUDO no Redux (anti-pattern antigo)
const store = {
  activeTab: 0,                    // local state — nao pertence aqui
  users: [],                       // server state — nao pertence aqui
  isDropdownOpen: false,           // local state — nao pertence aqui
  products: [],                    // server state — nao pertence aqui
  auth: { user: null },            // global state — este sim
  theme: 'dark',                   // global state — este sim
}

// ✅ Cada tipo de estado na ferramenta certa
// Local state → useState
const [activeTab, setActiveTab] = useState(0)
const [isDropdownOpen, setDropdownOpen] = useState(false)

// Server state → React Query
const { data: users } = useQuery(['users'], fetchUsers)
const { data: products } = useQuery(['products'], fetchProducts)

// Global state → Redux/Zustand (somente o necessario)
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,    // compartilhado em toda a app
    theme: themeSlice.reducer,  // compartilhado em toda a app
  },
})
```