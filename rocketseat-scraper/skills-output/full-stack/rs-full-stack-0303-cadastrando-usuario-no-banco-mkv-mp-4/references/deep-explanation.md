# Deep Explanation: Cadastrando Usuário no Banco

## Por que verificar duplicidade antes de criar?

O instrutor escolhe fazer `findFirst` antes do `create` em vez de depender da constraint unique do banco. A razão é controle da mensagem de erro: ao verificar antes, você lança um `AppError` com mensagem amigável ("Já existe um usuário cadastrado com esse e-mail") que o front-end pode exibir diretamente. Se dependesse da constraint unique do Prisma, o erro seria um `PrismaClientKnownRequestError` com código P2002, que precisaria ser interceptado e traduzido.

### Trade-off: Race condition vs. Legibilidade

Existe uma race condition teórica: entre o `findFirst` e o `create`, outro request pode cadastrar o mesmo e-mail. Na prática, para a maioria das aplicações, isso é aceitável porque:
1. A constraint unique no banco ainda existe como safety net
2. O cenário é raro em apps com poucos usuários simultâneos
3. A legibilidade do código é significativamente melhor

Para aplicações de alta concorrência, a abordagem ideal é fazer o `create` diretamente e tratar o erro P2002 do Prisma.

## Bcrypt: Por que salt round 8?

O instrutor usa `hash(password, 8)` onde 8 é o número de salt rounds (cost factor). Cada incremento dobra o tempo de computação:

| Salt Rounds | Tempo aproximado |
|-------------|-----------------|
| 6 | ~8ms |
| 8 | ~40ms |
| 10 | ~130ms (default bcrypt) |
| 12 | ~500ms |

O valor 8 é um balanço entre segurança e performance para desenvolvimento. Em produção, 10-12 é mais comum. O importante é nunca usar valores abaixo de 6.

## O erro do await esquecido

O instrutor demonstra ao vivo o que acontece quando se esquece o `await` no `hash()`: a variável recebe um objeto Promise em vez da string do hash. Isso é um bug silencioso — o Prisma salvaria `[object Promise]` como senha no banco, tornando impossível o login futuro. O TypeScript com tipagem correta ajuda a capturar isso, mas em JavaScript puro é um erro comum.

### Como identificar
- Se o retorno parece um objeto em vez de uma string começando com `$2b$`
- Se `typeof hashedPassword` retorna `'object'` em vez de `'string'`

## Fluxo completo do cadastro

```
Request POST /users
  │
  ├─ Validar campos (name, email, password, role)
  │
  ├─ findFirst({ where: { email } })
  │   ├─ Encontrou? → throw AppError("Já existe...")
  │   └─ Não encontrou? → continua
  │
  ├─ await hash(password, 8)
  │   └─ Retorna string: "$2b$08$..."
  │
  ├─ prisma.user.create({ data: { name, email, password: hashed, role } })
  │
  └─ Response 201 (sem body)
```

## Por que 201 sem body?

O HTTP status 201 (Created) indica que o recurso foi criado com sucesso. O instrutor opta por não retornar o objeto do usuário criado porque:
1. Evita vazar o hash da senha acidentalmente
2. O front-end tipicamente redireciona para login após cadastro, não precisa dos dados
3. Menos dados trafegados = resposta mais rápida

Se precisar retornar dados, use `select` do Prisma para excluir o campo password:
```typescript
const user = await prisma.user.create({
  data: { name, email, password: hashedPassword, role },
  select: { id: true, name: true, email: true, role: true }
})
```

## Importação do Prisma

O instrutor usa `import prisma from "@/database/prisma"` — um módulo centralizado que exporta a instância do PrismaClient. Isso garante que toda a aplicação use uma única instância (singleton pattern), evitando o problema de múltiplas conexões ao banco durante desenvolvimento com hot reload.

## AppError como exceção customizada

O `AppError` é importado de `@/utils/AppError` e serve como exceção da camada de aplicação. Diferente de um `Error` genérico, o `AppError` carrega informações que o middleware de erro global entende (mensagem amigável, status code). Isso permite que o handler de erros diferencie entre erros de aplicação (400, 409) e erros inesperados (500).