# Deep Explanation: Cadastrando Usuário — Integração Frontend com API

## Por que usar a instância configurada do Axios

Quando criamos uma instância do Axios com `axios.create({ baseURL: "http://localhost:3333" })`, todas as chamadas subsequentes usam essa base automaticamente. Isso significa que ao chamar `api.post("/users", data)`, o Axios internamente monta a URL completa `http://localhost:3333/users`.

O instrutor enfatiza: "Lembra que aqui a gente já definiu uma base URL. Então aqui a gente não precisa repetir, porque o próprio Axios já vai colocar pra gente essa parte quando a gente fizer a requisição."

Isso é fundamental porque:
- Se a URL da API mudar, você altera em **um único lugar** (a instância)
- Evita typos e inconsistências entre chamadas
- Mantém as chamadas limpas e focadas no recurso (`/users`)

## O racional do objeto de dados

O instrutor mostra que poderia enviar campos separados: `{ name, email, password }`. Mas como o objeto `data` já contém exatamente esses campos na forma correta, é mais limpo enviar `data` diretamente.

Isso funciona porque a validação do formulário (feita anteriormente com Zod) já garante que o objeto tem a forma esperada pela API.

## Padrão confirm + navigate

O `confirm()` do browser retorna `true` ou `false`. O instrutor usa isso dentro de um `if`:

```typescript
if (confirm("Cadastrado com sucesso! Ir para a tela de entrar?")) {
  navigate("/")
}
```

Se o usuário clica "OK", é redirecionado para a tela de login. Se clica "Cancelar", permanece na página atual. Isso dá controle ao usuário e serve como feedback visual de sucesso.

O `useNavigate` do React Router é preferível a `window.location.href` porque:
- Não causa reload completo da SPA
- Mantém o estado do React
- Respeita o sistema de rotas configurado

## Tratamento de erros em duas camadas

O instrutor implementa dois níveis de tratamento:

### Camada 1: Erros da API (AxiosError)
Quando a API retorna um status de erro (4xx, 5xx), o Axios lança um `AxiosError`. Esse erro tem a propriedade `response` que contém os dados retornados pela API.

O instrutor mostra o código da API para explicar de onde vem a `message`: a API usa um `AppError` (classe de erro customizada em `utils`) que tem uma propriedade `message`. Quando a API detecta, por exemplo, que o email já está cadastrado, lança um `AppError` com uma mensagem descritiva.

Por isso usamos `error.response?.data.message` — o `?` (optional chaining) é necessário porque nem todo AxiosError tem um response (por exemplo, erros de rede onde o servidor não respondeu).

### Camada 2: Erros genéricos
Se o erro não é uma instância de `AxiosError`, é algo inesperado (erro de runtime, erro de rede sem response). Nesse caso, logamos no console para debugging.

```typescript
catch (error) {
  if (error instanceof AxiosError) {
    alert(error.response?.data.message)  // Erro da API → feedback ao usuário
  } else {
    console.log(error)                    // Erro inesperado → log para debug
  }
}
```

## Conexão com a estrutura da API

O instrutor abre a API para mostrar a correspondência:
- Frontend envia para `/users` (POST)
- API tem rotas em `src/routes/index.ts` → `/users` → `usersRoutes`
- Dentro de `usersRoutes`, o método POST na raiz (`/`) direciona para o controller de `create`
- O controller valida dados, verifica se o email já existe, e cria o usuário

Entender essa correspondência é essencial: o path no `api.post("/users")` deve corresponder exatamente à rota definida na API.

## Testando o fluxo completo

O instrutor demonstra o fluxo completo:
1. Banco de dados vazio (nenhum usuário)
2. Preenche o formulário com nome, email e senha
3. Validação do frontend funciona (email inválido é rejeitado, senhas diferentes são rejeitadas)
4. Com dados válidos, clica em cadastrar
5. Aparece o confirm "Cadastrado com sucesso!"
6. Clicando OK → navega para tela de login
7. Verificando o banco → usuário aparece cadastrado

Esse teste end-to-end valida que frontend, API e banco estão conectados corretamente.