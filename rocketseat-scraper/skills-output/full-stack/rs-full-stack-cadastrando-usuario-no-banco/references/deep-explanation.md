# Deep Explanation: Cadastrando Usuário no Banco

## Por que validar duplicidade com findFirst em vez de confiar no banco?

O instrutor escolhe deliberadamente fazer um `findFirst` antes do `create`. Isso pode parecer redundante se o campo `email` tem constraint `@unique` no schema do Prisma — o banco rejeitaria o insert duplicado. Mas a razão é clara: **controle da mensagem de erro**.

Quando o Prisma lança um erro de constraint violation, o erro é genérico (`PrismaClientKnownRequestError` com code `P2002`). Esse erro:
- Não comunica a regra de negócio claramente
- Precisa ser interceptado e traduzido no error handler
- Pode vazar informação sobre o schema do banco

Usando `findFirst` + `AppError`, o controller **comunica a intenção de negócio**: "um usuário com este email já existe". O `AppError` é tratado pelo middleware de error handling global da aplicação, retornando o status e mensagem corretos.

## A técnica de destructuring para excluir campos

O instrutor demonstra uma técnica idiomática do JavaScript/TypeScript para remover propriedades de um objeto sem mutação:

```typescript
const { password: _, ...userWithoutPassword } = user
```

Decomposição do que acontece:
1. `password: _` — extrai a propriedade `password` e atribui a uma variável chamada `_`
2. O `_` é uma convenção para "variável descartável" — não será usada
3. `...userWithoutPassword` — o spread operator coleta **todas as outras propriedades** em um novo objeto
4. O resultado: `userWithoutPassword` contém tudo exceto `password`

### Por que não usar `delete`?

O instrutor poderia fazer `delete user.password`, mas isso:
- **Muta o objeto original** — se `user` for usado em outro lugar, a senha estará ausente
- É uma operação imperativa menos previsível
- Não cria um novo objeto — altera o existente

A destructuring cria um **novo objeto**, preservando o original intacto. É funcional e previsível.

### O detalhe do conflito de nome

O instrutor destaca que o `password` já está desestruturado acima (do `request.body`). Se fizesse `const { password, ...rest } = user`, teria um erro de redeclaração. Por isso renomeia para `_`:

```typescript
// Já existe no escopo:
const { name, email, password } = request.body

// Portanto, renomeia para evitar conflito:
const { password: _, ...userWithoutPassword } = user
```

## Por que não retornar a senha mesmo criptografada?

O instrutor faz questão de mostrar o problema: ao cadastrar sem tratamento, a resposta inclui o hash `$2a$08...`. Mesmo sendo um hash bcrypt (irreversível por design), retorná-lo é ruim porque:

1. **Exposição desnecessária** — o cliente não precisa dessa informação
2. **Attack surface** — hashes podem ser alvo de rainbow tables ou brute force offline
3. **Princípio do menor privilégio** — retorne apenas o necessário
4. **Consistência** — se um endpoint retorna senha, desenvolvedores assumem que é padrão

## Fluxo completo do controller

O instrutor estrutura o controller em etapas bem definidas:

1. **Extrair dados do body** — `const { name, email, password } = request.body`
2. **Validar unicidade** — `findFirst` + `AppError`
3. **Processar** — gerar hash da senha
4. **Persistir** — `prisma.user.create` com hash
5. **Sanitizar resposta** — destructuring para remover senha
6. **Retornar** — `res.status(201).json(userWithoutPassword)`

Essa sequência é um padrão reutilizável: validar → processar → persistir → sanitizar → responder.

## Organização das importações

O instrutor menciona organizar as importações "em escadinha" — uma convenção visual:

```typescript
import { Router } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { hash } from "bcryptjs"
```

Agrupa por: framework → banco → utilitários → bibliotecas externas.