# Deep Explanation: Cadastrando Perguntas com Prisma

## Fluxo completo: do Insomnia ao banco

O instrutor demonstra o ciclo completo de uma requisicao POST:

1. **Cliente HTTP (Insomnia):** Cria uma request POST para `http://localhost:3333/questions` com body JSON contendo `title`, `content` e `user_id`
2. **Roteador:** A rota `/questions` com metodo POST aponta para o metodo `create` do `questions-controller`
3. **Controller:** Extrai campos do body, chama `prisma.questions.create`
4. **Prisma Client:** Traduz para SQL INSERT, envia ao banco
5. **Verificacao:** Prisma Studio mostra o registro inserido com todos os campos, incluindo os auto-gerados (`id`, `created_at`, `updated_at`)

## Por que desestruturar o body?

O instrutor faz `const { title, content, user_id } = request.body` em vez de acessar `request.body.title` diretamente. Isso:

- Documenta explicitamente quais campos o endpoint espera
- Facilita validacao futura (basta adicionar checks nos valores desestruturados)
- Evita repeticao de `request.body.` em multiplos lugares

## Foreign key como campo simples

No exemplo, `user_id` e passado diretamente como string no body. O instrutor pega o ID de um usuario ja criado (copiando do Insomnia) e cola no campo `user_id`. Isso mostra o padrao mais simples de relacionamento: passar a FK como valor escalar.

O Prisma tambem suporta `connect`:
```typescript
user: { connect: { id: user_id } }
```
Mas para insercao simples, passar `user_id` diretamente e mais conciso e igualmente valido.

## Autocomplete do Prisma

O instrutor destaca que ao digitar dentro de `data: { }` e pressionar `Ctrl+Space`, o editor mostra todos os campos disponiveis do modelo (title, content, user_id, id, created_at). Isso e possivel porque o Prisma gera tipos TypeScript a partir do schema, oferecendo type-safety completo.

## Campos auto-gerados

O instrutor NAO passa `id`, `created_at` ou `updated_at` no create. Esses campos tem defaults no schema Prisma (`@id @default(uuid())`, `@default(now())`, `@updatedAt`). Ao verificar no Prisma Studio, todos aparecem preenchidos automaticamente.

## Organizacao: pastas e controllers

O padrao mostrado segue a estrutura:
- Uma pasta no Insomnia por recurso (`users/`, `questions/`)
- Um controller por recurso (`users-controller`, `questions-controller`)
- Cada controller tem metodos CRUD: `create`, `list`, `update`, `delete`
- As rotas conectam paths HTTP aos metodos do controller