# Deep Explanation: Rotas e Controllers no Express

## Por que separar controllers em classes?

O instrutor escolhe classes para controllers porque cada recurso da API (users, tickets, etc.) agrupa naturalmente vários métodos HTTP relacionados. Uma classe `UserController` pode ter `create`, `show`, `update`, `delete` — todos operando sobre o mesmo domínio.

A alternativa seria exportar funções soltas, mas isso perde a coesão: ao abrir o arquivo, não fica claro que todas as funções pertencem ao mesmo contexto. A classe funciona como um namespace natural.

## Padrão de organização: um arquivo de rotas por recurso

O raciocínio é simples: cada "assunto" (usuário, ticket, produto) tem suas próprias rotas. Quando você precisa encontrar onde está o endpoint `POST /users`, vai direto em `users-routes.ts`. Não precisa vasculhar um arquivo monolítico.

O instrutor enfatiza: "cada assunto vai ter uma rota, por exemplo, o usuário tem suas próprias rotas, então por isso que a gente deixa separado por arquivo para facilitar essa organização."

## O papel do `routes/index.ts`

O index centraliza todas as sub-rotas e as monta nos prefixos corretos:

```typescript
routes.use("/users", usersRoutes)
routes.use("/tickets", ticketsRoutes)
```

Isso significa que dentro de `users-routes.ts`, as rotas usam `/` (raiz relativa), não `/users`. O prefixo é responsabilidade do index. Essa separação de responsabilidade evita duplicação e facilita mudanças — se o prefixo mudar de `/users` para `/api/v2/users`, só altera no index.

O instrutor também separa mentalmente "rotas públicas" das "rotas autenticadas" nesse mesmo index, preparando para o middleware de autenticação que virá nas próximas aulas.

## Fluxo completo: request → route → controller

```
Cliente (Insomnia) → POST /users
  → app.use(routes)                    # app.ts
    → routes.use("/users", usersRoutes) # routes/index.ts
      → usersRoutes.post("/", ...)     # routes/users-routes.ts
        → usersController.create()     # controllers/user-controller.ts
          → response.json(...)         # resposta ao cliente
```

## Organização do Insomnia para testes

O instrutor demonstra um padrão de organização no Insomnia que espelha a estrutura do código:

1. **Criar uma pasta por recurso** — ex: pasta "Users"
2. **Criar variável de ambiente na pasta** — `resource: "users"` (sem barra inicial)
3. **Usar a variável nas requests** — `{{ base_url }}/{{ resource }}`

Isso padroniza e evita erros de digitação. Todas as requests dentro da pasta "Users" automaticamente usam o prefixo correto.

## Tipagem do Express

O instrutor importa `Request` e `Response` do Express para tipar os parâmetros dos métodos do controller. Isso dá autocomplete e segurança de tipos:

```typescript
import { Request, Response } from "express"
```

Sem essa tipagem, os parâmetros seriam `any`, perdendo toda a ajuda do TypeScript.

## Nomenclatura adotada

- **Controller:** `user-controller.ts` (singular + "-controller")
- **Classe:** `UserController` (PascalCase, singular)
- **Arquivo de rotas:** `users-routes.ts` (plural + "-routes")
- **Variável de rotas:** `usersRoutes` (camelCase, plural)
- **Instância do controller:** `usersController` (camelCase, plural para consistência com a rota)

O instrutor observa que o nome da instância (`usersController`, minúsculo) não deve conflitar com o nome da classe (`UserController`, PascalCase).