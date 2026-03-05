# Deep Explanation: Rota Protegida com Verificacao de Permissao

## Por que objeto e nao string no cannot()?

O CASL (Castle) funciona com dois modos de verificacao:

1. **String** — `cannot('update', 'Organization')` — verifica se o usuario pode atualizar QUALQUER organizacao. Se a regra diz "pode atualizar organizacoes que e dono", isso retorna `false` (ele PODE), porque existe pelo menos um cenario onde ele pode.

2. **Objeto** — `cannot('update', authOrganization)` — verifica se o usuario pode atualizar ESTA organizacao especifica. O CASL compara os atributos do objeto (como `ownerId`) com as condicoes definidas na ability.

Essa distincao e o coração do **Attribute Based Access Control (ABAC)**. Diferente do RBAC puro (onde so importa o role), no ABAC os atributos da entidade participam da decisao.

## Por que parsear com Zod antes?

Os schemas (`userSchema`, `organizationSchema`) servem como "models" do pacote de autorizacao. Eles garantem que:

- O objeto passado ao CASL tem exatamente os campos que as condicoes precisam
- Campos extras do banco (como `createdAt`) sao removidos
- O tipo TypeScript fica correto para o CASL

O instrutor usa o prefixo `auth` (authUser, authOrganization) para diferenciar esses objetos parseados dos objetos do banco. E uma convencao temporaria — a abstracao em `getUserPermissions` resolve parte disso.

## Dominio unico — o falso positivo do update

Cenario: organizacao "Skillz" com dominio "skillz.com.br". Usuario abre formulario de edicao, nao muda nada, clica salvar. O formulario envia todos os campos, incluindo o dominio inalterado.

Sem o `id: { not: organization.id }`:
1. Backend recebe `domain: "skillz.com.br"`
2. Busca no banco: existe organizacao com esse dominio? SIM (a propria!)
3. Retorna erro de dominio duplicado — BUG

Com a exclusao:
1. Busca: existe organizacao com esse dominio E que NAO seja esta? NAO
2. Prossegue normalmente

## Por que findFirst e nao findUnique?

O Prisma exige que `findUnique` use apenas campos marcados como `@unique` ou `@@unique` no schema. Quando a query usa multiplas condicoes (dominio + id diferente), nao e mais uma busca por indice unico — e uma busca com filtros compostos. `findFirst` aceita qualquer combinacao de WHERE.

## Por que nao atualizar o slug?

O slug aparece na URL: `app.com/org/skillz/projects`. Se o usuario renomear a organizacao de "Skillz" para "Skillz Education" e o slug mudar para `skillz-education`, todos os links salvos como favoritos, compartilhados em documentos, ou indexados por ferramentas, quebram.

O instrutor sugere que, se necessario, a atualizacao de slug tenha uma rota dedicada com avisos claros sobre o impacto.

## Abstracao getUserPermissions

O padrao de criar authUser + chamar defineAbilityFor se repete em TODA rota protegida. A funcao `getUserPermissions` encapsula isso:

```typescript
// Antes (repetido em cada rota):
const authUser = userSchema.parse({ id: userId, role: membership.role })
const { cannot } = defineAbilityFor(authUser)

// Depois (uma linha):
const { cannot } = getUserPermissions(userId, membership.role)
```

Essa funcao fica em `utils/` porque e usada por multiplas rotas. Recebe `userId` e `role` (os dois dados minimos) e retorna o ability completo do CASL.