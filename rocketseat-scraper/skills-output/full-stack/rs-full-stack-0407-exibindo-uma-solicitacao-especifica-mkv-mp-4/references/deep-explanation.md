# Deep Explanation: Exibindo uma Solicitação Específica

## Por que findFirst e não findUnique?

O instrutor usa `prisma.refund.findFirst` ao invés de `findUnique`. Embora `findUnique` funcione para busca por ID (que é unique por definição), `findFirst` oferece mais flexibilidade:

- Permite adicionar filtros compostos no futuro (ex: `where: { id, userId }` para garantir que o Employee só veja suas próprias solicitações)
- Aceita qualquer campo no `where`, não apenas campos marcados como `@unique` no schema
- Retorna `null` silenciosamente quando não encontra, igual ao `findUnique`

Na prática, para endpoints de show por ID, ambos funcionam. A escolha de `findFirst` é uma decisão de flexibilidade para evolução futura do endpoint.

## Validação de params com Zod

O padrão estabelecido na aula é consistente com o `index`:

```typescript
const paramsSchema = z.object({
  id: z.string().uuid(),
})

const { id } = paramsSchema.parse(request.params)
```

### Por que validar se o banco já rejeita UUID inválido?

1. **Fail fast** — rejeita antes de tocar no banco, economizando uma query
2. **Mensagem de erro clara** — Zod retorna "Invalid uuid" ao invés de um erro críptico do Prisma/PostgreSQL
3. **Consistência** — o mesmo padrão de validação usado em todos os endpoints
4. **Segurança** — previne injection ou valores inesperados de chegarem ao ORM

O instrutor demonstra isso ao vivo: adiciona um "X" no final do UUID no Insomnia e mostra que a validação Zod rejeita com mensagem clara de "ID inválido".

## Autorização multi-role

A rota é configurada com dois roles permitidos:

```typescript
verifyUserAuthorization(["employee", "manager"])
```

### Raciocínio do instrutor:

- **Employee** precisa ver os detalhes da sua própria solicitação de reembolso
- **Manager** precisa ver detalhes de qualquer solicitação para poder aprovar/rejeitar
- Ambos acessam o mesmo endpoint, mas a lógica de negócio pode filtrar dados diferentemente no futuro

Esse é um padrão comum em sistemas com RBAC: o endpoint é compartilhado, mas o middleware de autorização controla quem pode acessar.

## Include de relações

```typescript
include: {
  user: true,
}
```

Ao buscar uma solicitação específica, incluir os dados do usuário é essencial porque:

- O frontend precisa mostrar quem fez a solicitação
- Uma query com `include` é mais eficiente que duas queries separadas
- O Prisma gera um JOIN otimizado no SQL

## Padrão controller show vs index

| Aspecto | index | show |
|---------|-------|------|
| Retorno | Array de registros | Um registro |
| Params | Nenhum (ou paginação) | `id` obrigatório |
| Validação | Opcional | UUID obrigatório |
| HTTP Method | GET `/refunds` | GET `/refunds/:id` |

## Testando no Insomnia

O instrutor demonstra o fluxo completo:

1. Cria uma nova HTTP request chamada "show"
2. Configura como GET com URL `base_url/refunds/:id`
3. Copia um ID real do endpoint index
4. Configura o JWT usando response body do endpoint de session (token do login)
5. Envia e recebe a solicitação específica com dados do usuário
6. Testa validação adicionando "X" ao UUID — Zod rejeita corretamente
7. Remove o "X" e confirma que funciona novamente