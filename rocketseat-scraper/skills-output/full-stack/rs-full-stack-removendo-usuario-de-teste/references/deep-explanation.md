# Deep Explanation: Removendo Usuário de Teste

## O problema fundamental: testes não-idempotentes

Quando um teste de integração cria um registro real no banco de dados (não mockado), esse registro persiste após a execução. Na próxima rodada, o teste tenta criar o mesmo registro com os mesmos dados — e falha por violação de constraint única.

O instrutor demonstra isso ao vivo:
1. Primeira execução: `POST /users` com email fixo → **201 Created** ✓
2. Segunda execução: mesmo `POST /users` com mesmo email → **400 Bad Request** ✗

O status muda de 201 para 400 porque o `UserController` tem uma validação que verifica se o email já existe no banco. Isso é correto em produção, mas quebra testes que não limpam seus dados.

## Por que `afterAll` e não `beforeAll`?

O instrutor escolhe `afterAll` (depois de todos os testes) em vez de `beforeAll` (antes de todos os testes). A razão:

- **`afterAll`**: limpa o que o próprio teste criou. O teste cria, valida, e depois remove. O banco fica limpo para a próxima rodada.
- **`beforeAll`**: tentaria limpar dados de uma rodada anterior. Problema: na primeira execução, não há dados para limpar, e se o teste falhou antes de criar o registro, o `beforeAll` tentaria deletar algo que não existe.

Ambas as abordagens podem funcionar, mas `afterAll` é mais natural para o fluxo "crie → teste → limpe".

## Escopo de variáveis no Jest/Vitest

O instrutor cria `let userId: string` no topo do `describe`, fora de qualquer `it` ou hook. Isso é necessário porque:

- Variáveis declaradas dentro de `it` são locais àquele teste
- Hooks como `afterAll` precisam acessar o ID para fazer o delete
- O `describe` cria um escopo compartilhado entre todos os `it` e hooks dentro dele

Sem essa elevação de escopo, o `afterAll` não teria acesso ao `userId` capturado durante o `it`.

## Captura do ID no response body

O fluxo é:
1. `POST /users` retorna `{ id: "uuid-gerado", name: "...", email: "..." }`
2. O teste captura: `userId = response.body.id`
3. O `afterAll` usa: `prisma.user.delete({ where: { id: userId } })`

Isso funciona porque a API retorna o ID do registro criado no body da resposta. Se a API não retornasse o ID, seria necessário buscar o registro por outro campo (email, por exemplo) antes de deletar.

## Prisma como ferramenta de cleanup

O instrutor importa o Prisma diretamente no arquivo de teste:
```typescript
import { prisma } from "@/database/prisma"
```

Isso dá acesso direto ao banco de dados para operações de cleanup, independente da API HTTP. O teste usa a API para criar (testando a rota), mas usa o Prisma diretamente para limpar (operação de infraestrutura, não precisa passar pela API).

## Fluxo completo demonstrado

```
1ª execução:
  it → POST /users → 201 → userId capturado
  afterAll → prisma.user.delete({ where: { id: userId } })
  Banco: limpo

2ª execução:
  it → POST /users → 201 (email não existe mais) → userId capturado
  afterAll → prisma.user.delete({ where: { id: userId } })
  Banco: limpo

Pode rodar N vezes sem falhar.
```

## Edge case: o que acontece se o teste falha antes de capturar o ID?

Se o `POST /users` falhar (ex: servidor down), `userId` permanece `undefined`. O `afterAll` tentará `prisma.user.delete({ where: { id: undefined } })`, que vai lançar um erro do Prisma. Em produção, seria prudente adicionar um guard:

```typescript
afterAll(async () => {
  if (userId) {
    await prisma.user.delete({ where: { id: userId } })
  }
})
```

O instrutor não aborda esse edge case na aula, mas é uma melhoria natural do padrão.

## Analogia com o mundo real

É como usar uma sala de reunião: você reserva (cria o registro), faz sua reunião (executa o teste), e depois limpa a sala (deleta o registro). Se você não limpar, a próxima pessoa encontra a sala ocupada/suja e não consegue usar.