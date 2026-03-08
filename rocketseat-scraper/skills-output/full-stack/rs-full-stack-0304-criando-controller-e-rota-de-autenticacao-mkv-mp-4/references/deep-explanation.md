# Deep Explanation: Controller e Rota de Autenticação

## Por que "Sessions" e não "Auth" ou "Login"?

O instrutor segue a convenção RESTful onde autenticação é modelada como um recurso. "Criar uma sessão" (POST /sessions) é o equivalente semântico de "fazer login". Isso mantém consistência com o padrão REST:

- **POST /sessions** → criar sessão (login)
- **DELETE /sessions** → destruir sessão (logout)
- **GET /sessions** → verificar sessão ativa

Usar "login" ou "auth" como nome de rota quebra a abstração REST porque são verbos, não recursos.

## Estrutura: Controller como Classe

O padrão adotado é criar controllers como classes, não como funções exportadas individualmente. Isso traz:

1. **Agrupamento lógico** — todos os métodos relacionados a sessions ficam na mesma classe
2. **Consistência** — mesmo padrão usado em `UsersController`, `SessionsController`, etc.
3. **Extensibilidade** — adicionar `delete` (logout) é adicionar um método na mesma classe

## Fluxo de Organização

O instrutor segue um padrão consistente para cada novo recurso:

1. Criar o controller (`sessions-controller.ts`)
2. Criar o arquivo de rotas dedicado (`sessions-routes.ts`)
3. Registrar no index de rotas (`index.ts`)
4. Testar no Insomnia antes de implementar lógica

Esse padrão "skeleton first" permite validar que a infraestrutura está funcionando antes de adicionar lógica de negócio (validação, banco de dados, JWT, etc.).

## Rota Pública vs Protegida

A rota de sessions é registrada como **pública** no index. Isso é fundamental porque:

- O usuário ainda não tem token quando faz login
- Colocar middleware de autenticação na rota de login criaria um deadlock lógico
- No index, rotas públicas são registradas antes do middleware de autenticação

## Organização no Insomnia

O instrutor organiza o Insomnia com:

- **Pastas por recurso** — Users, Sessions
- **Environment por pasta** — cada pasta define `resource` com o nome da rota
- **Variáveis de ambiente** — `base_url` e `resource` para evitar repetição
- **Dica de produtividade** — Ctrl+Espaço para autocompletar variáveis de ambiente quando o autocomplete demora

## Tipagem de Request e Response

Importar `Request` e `Response` do Express e tipar os parâmetros do método garante:

- Autocomplete no editor para `request.body`, `request.params`, etc.
- Erros de compilação se tentar acessar propriedades inexistentes
- Documentação implícita do contrato do método

## Validação Incremental

O padrão de retornar `response.json({ message: "ok" })` como placeholder serve para:

1. Validar que a rota está registrada corretamente
2. Validar que o controller está sendo chamado
3. Validar que o Insomnia consegue alcançar o endpoint
4. Só depois implementar a lógica real (próximas aulas)

Esse approach "outside-in" evita debugar múltiplas camadas simultaneamente.