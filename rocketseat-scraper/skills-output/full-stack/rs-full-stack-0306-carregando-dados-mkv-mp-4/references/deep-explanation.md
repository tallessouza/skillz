# Deep Explanation: Carregando Dados de Autenticação

## Por que o estado reseta mas o localStorage não

O React mantém estado em memória. Quando a página recarrega (F5, fechar e abrir o navegador, navegar para a URL diretamente), todo o JavaScript é re-executado do zero. O `useState` recebe seu valor inicial novamente — no caso de sessão, geralmente `null`.

O localStorage, por outro lado, é persistente no navegador. Ele sobrevive a recarregamentos, fechamento de abas e até reinício do navegador. Os dados ficam vinculados ao domínio (origin) e só são removidos programaticamente ou pelo usuário limpando dados do navegador.

Essa assimetria — estado volátil vs. storage persistente — é o motivo pelo qual precisamos de uma função de carregamento.

## O problema da piscada (flash of unauthenticated content)

O instrutor demonstra um problema sutil mas importante: ao recarregar a página, o usuário logado vê brevemente a tela de login antes de ser redirecionado.

**Por que acontece:**

1. A aplicação monta
2. O estado `session` começa como `null` (valor inicial do useState)
3. O index de rotas verifica: `session` é null → renderiza `<AuthRoutes />` (tela de login)
4. O `useEffect` executa (assíncrono, após a primeira renderização)
5. `loadUser` recupera dados do localStorage e atualiza o estado
6. O estado muda → React re-renderiza → agora session tem valor → renderiza `<AppRoutes />`

Entre os passos 3 e 6, o usuário vê a tela de login por alguns milissegundos. Em conexões lentas ou dispositivos fracos, pode ser ainda mais perceptível.

## A solução: isLoading como guarda

A solução elegante é adicionar um estado `isLoading` que começa como `true`. Antes de renderizar qualquer rota, o componente de rotas verifica:

```
isLoading === true → mostra <Loading /> (tela neutra)
isLoading === false + session → mostra <AppRoutes />
isLoading === false + !session → mostra <AuthRoutes />
```

Assim, o usuário nunca vê a tela de login "piscando". Ele vê uma tela de carregamento neutra até que a verificação complete.

## Por que loadUser não precisa ser exposta

O instrutor enfatiza que `loadUser` é uma função interna do contexto. Diferente de `signIn` ou `signOut`, que são ações que o usuário dispara, `loadUser` é automática — executa uma vez no mount via useEffect. Expô-la no Provider seria adicionar complexidade desnecessária à interface do contexto.

## Fluxo completo de dados

```
Navegador abre
  → React monta AuthProvider
  → useState: session=null, isLoading=true
  → Primeira renderização: isLoading=true → <Loading />
  → useEffect executa loadUser()
  → localStorage.getItem("token") e localStorage.getItem("user")
  → Se existem: setSession({ token, user: JSON.parse(userString) })
  → setIsLoading(false)
  → Re-renderização: isLoading=false, session tem valor → <AppRoutes />
```

## JSON.parse e JSON.stringify — o par essencial

O localStorage só armazena strings. Para salvar um objeto JavaScript:
- **Salvar:** `localStorage.setItem(key, JSON.stringify(objeto))`
- **Recuperar:** `JSON.parse(localStorage.getItem(key))`

O token já é uma string, então não precisa de conversão. O objeto `user` precisa do par stringify/parse.

## Analogia do instrutor

O instrutor usa a analogia de "fechar e abrir o navegador" para demonstrar que o localStorage persiste entre sessões do navegador. É como guardar um papel numa gaveta (localStorage) vs. escrever num quadro branco (estado React) — o quadro branco é apagado quando você sai da sala, mas a gaveta mantém o papel.