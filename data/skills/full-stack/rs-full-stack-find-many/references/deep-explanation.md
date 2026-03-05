# Deep Explanation: Prisma findMany

## Por que usar findMany ao inves de SQL raw?

O instrutor enfatiza a **agilidade**: "Olha a agilidade com que a gente fez uma consulta no nosso banco de dados sem escrever nada de SQL." O ponto central e que o Prisma abstrai a query SQL, permitindo que o desenvolvedor foque na logica de negocio.

### O que findMany faz internamente

Quando voce chama `prisma.user.findMany()`, o Prisma:
1. Gera o SQL `SELECT * FROM "User"` (ou equivalente para o banco configurado)
2. Executa a query via connection pool
3. Mapeia o resultado para objetos TypeScript tipados
4. Retorna um array de objetos tipados

### Vantagem de tipagem

O retorno de `findMany()` e `User[]` — completamente tipado pelo schema do Prisma. Isso significa autocompletar no editor e erros de tipo em tempo de compilacao.

### Async/await obrigatorio

`findMany` retorna uma Promise. O instrutor usa `await` diretamente:

```typescript
const users = await prisma.user.findMany()
```

Sem o `await`, a variavel `users` seria uma `Promise<User[]>`, nao os dados em si.

### Padrao index em REST

O instrutor segue o padrao REST classico:
- **GET /users** → lista (index) → `findMany`
- **POST /users** → criacao → `create`

Essa e a convencao usada pelo Fastify/Express e testada via Insomnia no curso.

### Retorno em objeto vs array direto

O instrutor retorna `{ users }` (objeto) ao inves de `users` (array direto). Isso e uma boa pratica porque:
- Permite adicionar campos extras no futuro (ex: `{ users, total, page }`)
- APIs que retornam objetos na raiz sao mais extensiveis que arrays na raiz
- Evita vulnerabilidade historica de JSON hijacking com arrays na raiz

## Fluxo demonstrado na aula

1. Criar rota GET no index do recurso users
2. Usar `prisma.user.findMany()` com await
3. Retornar os users no JSON da resposta
4. Testar no Insomnia criando nova HTTP request GET
5. Verificar que os usuarios cadastrados anteriormente aparecem no JSON