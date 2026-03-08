# Deep Explanation: React Context em Detalhes

## Por que separar em tres camadas?

O instrutor (Rodrigo) demonstra uma evolucao progressiva que revela o raciocinio por tras da arquitetura:

### Camada 1: O Contexto puro
`createContext` apenas define a "forma" do dado compartilhado. Ele nao sabe quem vai consumir, nem que valor vai receber em runtime. E uma declaracao de contrato.

```tsx
export const AuthContext = createContext({})
```

O objeto vazio e o valor padrao — usado apenas se nenhum Provider for encontrado acima na arvore.

### Camada 2: O Provider como componente
O Provider e quem de fato "injeta" valores no contexto. O instrutor comeca com o Provider inline no App.tsx:

```tsx
<AuthContext.Provider value={{ name: "Rodrigo" }}>
  <Routes />
</AuthContext.Provider>
```

Mas depois extrai para um componente proprio. O motivo: o App.tsx nao deveria saber os detalhes de como o contexto de autenticacao funciona. Ele so precisa saber que existe um AuthProvider que envolve as rotas.

A tecnica de `children` como `ReactNode` e fundamental — o Provider recebe qualquer conteudo filho e repassa:

```tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo" }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Camada 3: O Hook customizado
Sem o hook, cada componente precisa:
1. Importar `use` ou `useContext` do React
2. Importar o `AuthContext` do arquivo de contexto
3. Chamar `use(AuthContext)` ou `useContext(AuthContext)`

Isso sao 3 linhas repetidas em cada componente. O hook `useAuth` encapsula tudo em uma unica importacao e chamada:

```tsx
import { useAuth } from "../hooks/use-auth"
const { name } = useAuth()
```

## React 19: `use()` vs `useContext()`

O instrutor destaca que no React 19, `use()` substitui `useContext()` com comportamento identico. A diferenca e que `use()` e mais generico — funciona com contextos e Promises. Para contextos, o resultado e o mesmo:

```tsx
// React 18
const context = useContext(AuthContext)

// React 19
const context = use(AuthContext)
```

Ambos retornam o valor atual do Provider mais proximo na arvore de componentes.

## O conceito de "prover" (Provider)

O instrutor usa a analogia de "compartilhar": o Provider define o inicio e o fim do escopo onde o contexto esta disponivel. Tudo que esta entre `<AuthProvider>` e `</AuthProvider>` tem acesso ao contexto.

Por isso o Provider envolve as rotas no App.tsx — todas as paginas/rotas precisam acessar dados de autenticacao.

## Atualizacao reativa

Quando o valor do contexto muda, todos os componentes que consomem esse contexto re-renderizam automaticamente. O instrutor demonstra isso mudando o `name` no Provider e observando a mudanca instantanea no console.log do componente consumidor.

## Estrutura de pastas resultante

```
src/
├── context/
│   └── auth-context.tsx    # createContext + AuthProvider
├── hooks/
│   └── use-auth.tsx        # useAuth hook customizado
├── routes/
│   └── index.tsx           # consome useAuth
└── app.tsx                 # usa AuthProvider
```

Esta separacao segue o principio de responsabilidade unica: cada arquivo tem um motivo para mudar.