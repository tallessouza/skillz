---
name: rs-saas-nextjs-rbac-rota-atualizar-projeto
description: "Applies the update project route pattern in Next.js SaaS RBAC APIs. Use when user asks to 'update a resource', 'create an update route', 'edit project endpoint', or 'patch entity with permissions'. Enforces permission check before update, 204 empty response on success, and reusing existing route structure for speed. Make sure to use this skill whenever building update/edit API routes with authorization. Not for creating new resources, deleting, or frontend form handling."
---

# Rota: Atualizar Projeto

> Ao criar rotas de atualizacao, sempre verifique permissoes antes de executar o update e retorne 204 vazio em caso de sucesso.

## Rules

1. **Reutilize rotas similares como base** — copie uma rota existente que ja tenha parametros similares (como project id na URL), porque acelera o desenvolvimento e mantem consistencia
2. **Verifique permissao antes de atualizar** — busque o projeto, valide permissoes do usuario, so entao execute o update, porque atualizacoes nao autorizadas sao falhas de seguranca
3. **Retorne 204 sem body em updates** — atualizacao bem-sucedida retorna status 204 vazio, porque o cliente ja tem os dados que enviou
4. **Limite campos atualizaveis** — aceite apenas `name` e `description` no body, porque expor campos internos cria vulnerabilidades

## How to write

### Rota de update com permissao

```typescript
// Buscar projeto pelo ID da URL
const project = await prisma.project.findUnique({
  where: { id: projectId },
})

// Verificar permissao antes de qualquer mutacao
if (!ability.can('update', project)) {
  throw new UnauthorizedError('You are not allowed to update this project.')
}

// Extrair apenas campos permitidos do body
const { name, description } = body

// Executar update
await prisma.project.update({
  where: { id: projectId },
  data: { name, description },
})

// Retornar 204 vazio
return reply.status(204).send()
```

## Example

**Before (sem verificacao de permissao):**
```typescript
app.put('/projects/:id', async (request, reply) => {
  const { name, description } = request.body
  await prisma.project.update({
    where: { id: request.params.id },
    data: { name, description },
  })
  return reply.send({ message: 'Updated' })
})
```

**After (com this skill applied):**
```typescript
app.put('/projects/:id', async (request, reply) => {
  const { id: projectId } = request.params
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  const ability = getUserAbility(request.user)
  if (!ability.can('update', project)) {
    throw new UnauthorizedError('You are not allowed to update this project.')
  }

  const { name, description } = request.body
  await prisma.project.update({
    where: { id: projectId },
    data: { name, description },
  })

  return reply.status(204).send()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota precisa de ID na URL | Copie rota existente que ja tem o param (ex: delete) |
| Update bem-sucedido | Retorne 204 sem body |
| Recurso nao encontrado | Retorne 404 antes de checar permissao |
| Permissao negada | Retorne 403 com mensagem descritiva |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Update sem checar permissao | Buscar recurso → checar ability → update |
| `return reply.send({ ok: true })` em update | `return reply.status(204).send()` |
| Aceitar todos os campos do body | Desestruturar apenas campos permitidos |
| Criar rota do zero quando similar existe | Copiar rota similar e adaptar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-projeto/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-rota-atualizar-projeto/references/code-examples.md)
