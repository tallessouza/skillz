# Deep Explanation: Criacao de Usuario

## Por que comecar simples e refatorar depois

O instrutor enfatiza criar a rota "da maneira mais simples possivel" primeiro, porque o objetivo e ter algo funcional antes de aplicar design patterns e SOLID. A estrategia e:

1. Fazer funcionar (esta aula)
2. Organizar com patterns (proximas aulas)
3. Aplicar SOLID progressivamente

Isso segue o principio de "make it work, make it right, make it fast" — nao otimize prematuramente a arquitetura.

## z.parse() vs z.safeParse()

O instrutor escolhe `parse()` deliberadamente: "o parse, diferente do safeParse, ele vai dar um throw automatico no erro, ou seja, nenhum codigo daqui pra frente vai continuar se essa validacao falhar."

Isso e importante porque:
- `parse()` lanca um `ZodError` automaticamente
- Evita blocos `if (!result.success)` em cada handler
- Mais adiante no curso, um error handler global captura esses erros e formata a resposta

Quando usar `safeParse()`: quando voce precisa de controle granular sobre o erro (ex: retornar campos especificos que falharam com mensagens customizadas).

## Isolamento do Prisma Client

O instrutor cria `src/lib/prisma.ts` para separar a conexao do banco do arquivo de rotas. Razoes:

1. **Reutilizacao** — qualquer arquivo pode importar a mesma instancia
2. **Configuracao centralizada** — logs, middleware, extensoes ficam num lugar so
3. **Singleton** — evita criar multiplas conexoes com o banco (cada `new PrismaClient()` abre um pool de conexoes)

## Log condicional de queries

O Prisma aceita um array de tipos de log: `query`, `info`, `warn`, `error`. O instrutor habilita `query` apenas em dev:

```typescript
log: env.NODE_ENV === 'dev' ? ['query'] : []
```

Quando habilitado, o Prisma mostra no terminal todas as queries SQL executadas. O instrutor demonstra que um simples `create` gera um INSERT seguido de um SELECT (comportamento padrao do Prisma para retornar o registro criado).

Em producao, isso seria ruido excessivo e impactaria performance do log.

## Resposta 201 vazia

O instrutor explica: "em operacoes de criacao, atualizacao, remocao, a gente nao precisa devolver nada do banco de dados." 

Isso segue a convencao REST:
- **201 Created** — recurso criado com sucesso
- Body vazio — o cliente ja possui os dados que enviou
- Se necessario, retorne apenas o `id` ou um `Location` header

## Senha em texto puro (divida tecnica consciente)

O instrutor armazena a senha diretamente mas avisa: "mais pra frente o mais correto e eu gerar esse hash." Ele faz isso intencionalmente para manter o foco na rota e no Prisma, nao na criptografia. Nas aulas seguintes, bcrypt e introduzido.

Em qualquer codigo real, NUNCA armazene senhas sem hash, mesmo em MVP.

## Prisma Studio para debug

O instrutor usa `npx prisma studio` para verificar visualmente os dados no banco. E uma ferramenta util durante desenvolvimento que abre uma interface web para navegar as tabelas e registros.