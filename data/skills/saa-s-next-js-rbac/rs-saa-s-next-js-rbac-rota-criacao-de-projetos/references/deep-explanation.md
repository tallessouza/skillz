# Deep Explanation: Rota de Criacao de Projetos com RBAC

## Por que o slug da organizacao vem na URL

O instrutor explica que todo projeto pertence a uma organizacao, entao a URL sempre carrega o prefixo identificando em qual organizacao a acao esta sendo feita. Isso segue o padrao REST de recursos aninhados: `/organizations/:slug/projects`.

Esse padrao resolve dois problemas simultaneamente:
1. **Contexto explicito** — a API sabe qual organizacao sem depender de estado de sessao
2. **Autorizacao natural** — o middleware pode verificar se o usuario tem membership naquela org antes de qualquer logica de negocio

## Fluxo de permissao: getUserMembership + getUserPermissions

O fluxo e dividido em duas etapas distintas:

1. **`getUserMembership(slug)`** — busca a organizacao pelo slug e verifica se o usuario autenticado tem membership nela. Retorna `{ organization, membership }`. Se nao tiver membership, ja falha aqui.

2. **`getUserPermissions(userId, membership.role)`** — com o role do membership, gera as permissoes CASL do usuario. Retorna `{ cannot }` (e `can`).

Essa separacao e intencional: primeiro valida que o usuario PERTENCE a org, depois valida que ele TEM PERMISSAO para a acao especifica.

## O pattern `cannot` ao inves de `can`

O instrutor usa `cannot('create', 'Project')` ao inves de `!can('create', 'Project')`. Isso e um pattern do CASL que torna o codigo mais legivel — "se o usuario NAO PODE criar projeto, lance erro". E uma questao de clareza semantica.

## Ownership no create

O `ownerId` e passado no momento da criacao. Isso e fundamental para o RBAC funcionar em operacoes futuras (update, delete), onde a permissao pode depender de "ser o dono do recurso". Sem esse campo preenchido na criacao, as regras de ownership nao teriam como funcionar depois.

## createSlug — geracao automatica

O slug do projeto nao vem do usuario. Ele e gerado automaticamente a partir do nome usando `createSlug()`. Isso evita:
- Slugs duplicados por erro do usuario
- Caracteres invalidos na URL
- Inconsistencia entre nome exibido e slug

## Dica pratica do instrutor: salvar o token

O instrutor menciona que ao testar no Swagger, o token se perde entre reloads. Ele recomenda salvar o token em algum lugar de facil acesso (editor, notepad) para nao precisar refazer login a cada teste. Alternativamente, usar ferramentas como Insomnia que persistem o token.

## Registro da rota no server

Apos criar o arquivo da rota, e necessario registra-la no arquivo `server.ts` (ou equivalente) do Fastify. O instrutor importa `createProject` e registra como plugin. Sem esse passo, a rota simplesmente nao existe.