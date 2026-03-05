# Deep Explanation: Setup de Banco de Dados Multi-Tenant SaaS

## Por que tabela pivo ao inves de relacao implicita?

O instrutor explica que quando existe um relacionamento N:N (organizacoes <-> usuarios), onde um usuario participa de multiplas organizacoes e uma organizacao tem multiplos usuarios, a tabela pivo (Member) e necessaria porque carrega informacoes da relacao em si — especificamente a role daquele usuario naquela organizacao especifica.

Sem a tabela pivo, voce nao teria onde armazenar que o usuario e ADMIN na Org A mas MEMBER na Org B.

## Account vs User: separacao de identidade e autenticacao

O instrutor faz uma distincao importante:
- **User** = a pessoa (identidade unica, um registro)
- **Account** = meio de autenticacao (pode ter multiplos)

Exemplo concreto: um usuario faz login com email/senha → 1 registro em User, 0 em Account. Depois conecta GitHub → continua 1 em User, ganha 1 em Account. Depois conecta Google → continua 1 em User, agora 2 em Account.

O `providerAccountId` armazena o ID do usuario no provider externo (ex: ID do GitHub), permitindo reconhecer o mesmo usuario em logins futuros.

O indice `@@unique([provider, userId])` garante que um usuario so pode ter uma conta por provider — nao faz sentido estar logado com duas contas GitHub diferentes.

## Token como entidade generica extensivel

O instrutor cria um enum `TokenType` com apenas `PASSWORD_RECOVER`, mas explica a decisao: ao inves de criar uma tabela especifica `password_reset_tokens`, ele cria uma tabela generica `Token` com um campo `type`. Isso permite que no futuro outros tipos de tokens (confirmacao de email, convite por link, etc.) reutilizem a mesma estrutura.

## Por que author e opcional no Invite?

O instrutor pensou no cenario: se o usuario que criou o convite deletar sua conta, o convite deve continuar existindo (para que o convidado ainda possa aceitar). Por isso `author User?` e opcional — quando o autor e deletado, o convite fica com `authorId = null` mas continua valido.

## Indice no email do Invite

O `@@index([email])` no Invite existe para um caso de uso especifico: quando o usuario faz login, a aplicacao precisa buscar rapidamente todos os convites pendentes para aquele email. Sem indice, o banco faria full table scan. Com indice, a busca e O(log n).

## Domain e shouldAttachUsersByDomain

Feature de auto-join organizacional: se uma empresa configura `domain: "rocketseat.com.br"` e `shouldAttachUsersByDomain: true`, qualquer usuario que fizer login com email `@rocketseat.com.br` sera automaticamente vinculado a organizacao. O boolean funciona como feature flag — o dono da organizacao decide se quer ativar.

## Nomenclatura semantica dos relacionamentos

O instrutor destaca que nomear relacionamentos inversos importa para legibilidade:
- `User.tokens` → "usuario tem tokens" ✓
- `User.accounts` → "usuario tem contas" ✓
- `User.members` → "usuario tem membros" ✗ (nao faz sentido)
- `User.memberOn` → "usuario e membro em" ✓
- `Organization.members` → "organizacao tem membros" ✓

## Escolha do Prisma e da imagem Bitnami

O instrutor escolhe Prisma pela DX mas enfatiza que a estrutura nao e Prisma-especifica — qualquer ORM pode implementar o mesmo schema. Para Docker, usa `bitnami/postgresql` ao inves da imagem oficial por padroes de seguranca mais robustos, e menciona que e a imagem usada em producao na Rocketseat.

## Configuracao do Prisma

Dois pontos praticos mencionados:
1. Extensao do Prisma no VS Code deve estar instalada
2. Configurar "format on save" para arquivos `.prisma` — facilita formatacao automatica e geracao de codigo (como auto-complete de relacoes ao salvar)