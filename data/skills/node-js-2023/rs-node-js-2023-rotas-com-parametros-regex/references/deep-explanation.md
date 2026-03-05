# Deep Explanation: Rotas com Parâmetros (RegEx)

## O problema

Quando você constrói um servidor HTTP do zero em Node.js (sem Express), as rotas são registradas como strings estáticas (`/users`). Mas rotas como `DELETE /users/:id` precisam aceitar valores dinâmicos. A comparação `path === url` não funciona porque `/users/:id` nunca será igual a `/users/abc-123`.

## A solução em duas etapas

### Etapa 1: Detectar parâmetros dinâmicos

A regex `/:([a-zA-Z]+)/g` encontra todos os `:param` no path. O grupo de captura `([a-zA-Z]+)` extrai apenas o nome (sem os dois pontos).

Para `/users/:id/groups/:groupId`, o match retorna:
- Índice 0: `:id` (match completo)
- Índice 1: `id` (grupo de captura — é esse que importa)
- Depois: `:groupId` e `groupId`

### Etapa 2: Substituir por regex de captura

O `replaceAll` troca cada `:param` por `(?<$1>[a-z0-9\-_]+)`.

A mágica do `$1`: no `replaceAll`, `$1` referencia o primeiro grupo de captura da regex de busca. Então quando a regex encontra `:id`, o `$1` vale `id`, e o resultado é `(?<id>[a-z0-9\-_]+)`.

Isso significa que o nome do parâmetro vira automaticamente o nome do grupo de captura — sem nenhum mapeamento manual.

## Named capture groups em RegEx

RegEx normal com parênteses retorna valores por posição:
```
/users/([a-z0-9\-_]+)  →  match[1] = "abc-123"
```

Com named groups, você recebe um objeto nomeado:
```
/users/(?<id>[a-z0-9\-_]+)  →  match.groups = { id: "abc-123" }
```

O instrutor demonstrou isso ao vivo: sem o nome, os parâmetros vinham como `match[1]`, `match[2]` — impossível saber qual é qual sem contar posições. Com named groups, `match.groups.id` e `match.groups.groupId` são auto-explicativos.

## Por que ancorar com `^`

Sem `^`, a regex `/users/(?<id>...)` faria match com qualquer string que *contivesse* esse padrão — por exemplo, `/api/users/123` também passaria. O `^` garante que a URL *começa* com o path registrado.

## Caracteres permitidos: `[a-z0-9\-_]+`

O instrutor escolheu esse conjunto porque são caracteres seguros em URLs:
- Letras minúsculas (`a-z`)
- Números (`0-9`)
- Hífen (`\-`) — precisa escapar porque dentro de `[]` pode indicar range
- Underline (`_`)

O `+` exige pelo menos um caractere — uma URL como `/users/` (sem ID) não faz match.

## Fluxo completo no servidor

1. **Registro:** cada rota passa por `buildRoutePath` que converte o path em regex
2. **Matching:** quando chega uma request, itera nas rotas e usa `.test(url)` para achar a certa
3. **Extração:** após encontrar a rota, usa `.match(url).groups` para extrair os valores nomeados
4. **Uso:** `req.params` recebe o objeto de grupos — disponível no handler da rota

## Insight do instrutor sobre `.test()` vs `.match()`

O instrutor separou claramente as duas operações:
- `.test()` é barato — retorna só boolean, usado no `find` para localizar a rota
- `.match()` é mais pesado — executa a regex e retorna todos os grupos, usado só depois de encontrar a rota

Essa separação evita executar `.match()` em todas as rotas registradas.