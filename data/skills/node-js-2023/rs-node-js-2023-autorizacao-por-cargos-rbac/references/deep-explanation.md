# Deep Explanation: Autorização por Cargos (RBAC)

## O que é RBAC

RBAC (Role-Based Authorization Control) é determinar permissões baseado no **cargo** do usuário. É "baseado em cargo" (Role-Based) + "controle de autorização" (Authorization Control).

## Níveis de profundidade do RBAC

O instrutor destaca dois níveis:

### Nível raso (o que a maioria das apps faz)
Simplesmente verifica a role do usuário. Se é admin, pode fazer tudo. Se é member, acesso limitado. É o que foi implementado na aula.

### Nível profundo (apps mais complexas)
Define um leque granular de permissões: `criar_academia`, `deletar_academia`, `editar_academia`, `listar_academia`. Cada role recebe um subset dessas permissões. Mais flexível, mas mais complexo de manter.

A recomendação para a maioria das aplicações é começar com o nível raso e evoluir conforme necessidade.

## Por que enum e não string

Usando `enum Role` no Prisma:
- O banco de dados valida os valores possíveis
- Não é possível salvar `"admim"` (typo) — o banco rejeita
- O Prisma gera tipos TypeScript automaticamente
- Migrations documentam as roles disponíveis

## Por que a role vai no JWT

A decisão de colocar a role no JWT payload (tanto no token quanto no refresh token) é pragmática: evita uma query ao banco de dados em cada request apenas para verificar o cargo.

O trade-off: se a role do usuário mudar no banco, o JWT antigo ainda terá a role anterior até expirar. Para a maioria das aplicações isso é aceitável porque:
- Mudanças de role são raras
- Tokens têm expiração curta
- O refresh token atualiza a role quando renovado

## A evolução do middleware

O instrutor mostrou uma evolução importante no design:

1. **Primeira versão:** `onlyAdmin` — middleware específico para admin
2. **Versão final:** `verifyUserRole(role)` — função que retorna middleware, parametrizada pela role

Essa evolução ilustra o princípio de que middleware de autorização deve ser genérico e parametrizável. Se amanhã surgir uma role `MANAGER`, não precisa criar `onlyManager` — basta usar `verifyUserRole('MANAGER')`.

## Pattern: Higher-Order Function para middleware

O `verifyUserRole` é uma higher-order function: uma função que retorna outra função. A função externa recebe a configuração (qual role verificar), a função interna é o middleware real do Fastify.

```typescript
// verifyUserRole('ADMIN') retorna (request, reply) => { ... }
```

Isso é um pattern comum em middleware parametrizado no Node.js.

## Detalhe do Fastify JWT

O instrutor destacou que no `@fastify/jwt` especificamente, dados acessíveis via `request.user` devem ser declarados no `user` da tipagem, não no `payload`. Isso é uma particularidade da biblioteca — outras libs JWT podem funcionar diferente.

## Ordem dos hooks no onRequest

O array `[verifyJWT, verifyUserRole('ADMIN')]` executa em ordem:
1. Primeiro verifica se o token é válido (autenticação)
2. Depois verifica se a role é a correta (autorização)

Essa ordem é importante — não faz sentido verificar role de um token inválido.