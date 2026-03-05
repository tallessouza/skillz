# Deep Explanation: Rota de Detalhes sem Escopo de Organizacao

## Por que convites transcendem a barreira da organizacao

O instrutor explica um conceito arquitetural importante: nem todos os recursos de um SaaS multi-tenant pertencem ao escopo de uma organizacao. O convite e o exemplo perfeito disso.

Diferente de um projeto, que so e visivel dentro de uma organizacao, o convite precisa ser acessivel por usuarios que:
- Nao estao logados na aplicacao
- Nao pertencem a nenhuma organizacao ainda
- Receberam um link de convite por email

Isso significa que a rota nao pode exigir autenticacao nem verificacao de permissoes. O unico dado necessario e o ID do convite.

## Dados da organizacao via chave estrangeira

O instrutor destaca que nao e necessario receber o ID da organizacao como parametro. Os dados da organizacao (como o nome) estao contidos na relacao (FK) do proprio convite. Ao fazer o select com Prisma incluindo `organization: { select: { name: true } }`, os dados vem junto sem necessidade de parametro adicional.

Isso e um padrao recorrente: quando o recurso ja possui a relacao, use o select do ORM para trazer dados relacionados ao inves de exigir parametros extras.

## Tipagem do response com Zod

O instrutor mostra o processo de tipar o response:
1. Faz a query primeiro
2. Passa o mouse sobre o resultado para ver a estrutura do TypeScript
3. Copia a estrutura e converte para schema Zod

Pontos importantes na tipagem:
- `author` e nullable porque o autor do convite pode nao existir mais
- `avatarUrl` e `name` dentro de author sao `z.string().nullable()`
- `avatarUrl` inclui `.url()` para validacao adicional
- `email` usa `z.string().email()`
- `role` usa o `roleSchema` importado do pacote `@saas/auth`
- `createdAt` usa `z.date()`

## Simplicidade intencional

O instrutor remove explicitamente:
- `registerOf` (registro de organizacao)
- `security` (schema de autenticacao)
- Imports nao utilizados

A rota resultante e intencionalmente simples — sem middleware, sem guards, sem permission checks. Essa simplicidade nao e descuido, e uma decisao arquitetural baseada na natureza do recurso.