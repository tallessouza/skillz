# Deep Explanation: Rota de Envio do Link de Autenticacao

## Por que separar rotas em arquivos

O instrutor mostra que, com apenas uma rota no `server.ts`, o arquivo ja comeca a ficar poluido. A abordagem do Elysia e criar uma nova instancia `new Elysia()` em cada arquivo de rota e depois registrar com `.use()` no server principal. Isso faz cada rota ser "como se fosse uma aplicacao Elysia por si so" — um micro-app com suas proprias dependencias e validacoes.

## Duas formas de selecionar dados no Drizzle

### Select Builder (baixo nivel)

```typescript
db.select().from(users).where(eq(users.email, email))
```

- Retorna sempre um **array**, mesmo se o campo e unico
- Para pegar um registro, precisa desestruturar: `const [user] = await db.select()...`
- O Drizzle "nao sabe" que o campo e unico, entao nao oferece `.first()`
- Vantagens: controle total, suporta joins complexos, subqueries

### Query API (alto nivel, estilo Prisma)

```typescript
db.query.users.findFirst({
  where(fields, { eq }) {
    return eq(fields.email, email)
  },
})
```

- `findFirst` retorna objeto direto (ou `undefined`), sem precisar desestruturar array
- `findMany` retorna array
- O `where` e uma funcao que recebe `fields` (campos da tabela) e operators (`eq`, `ne`, `gt`, etc.) ja desestruturados — nao precisa importar separadamente
- Developer experience mais proxima do Prisma
- Limitacao: nao suporta queries muito complexas com joins arbitrarios

### Quando usar cada um

O instrutor e claro: "Se voce tiver escrevendo uma query que seja bem complexa, essa provavelmente vai ser a maneira de voce seguir" (select builder). Para queries simples, a query API com `findFirst`/`findMany` e preferivel pela legibilidade.

## Operadores de comparacao do Drizzle

O Drizzle exporta funcoes de comparacao que refletem operadores SQL:

| Funcao | SQL | Descricao |
|--------|-----|-----------|
| `eq` | `=` | Equal |
| `ne` | `!=` | Not equal |
| `gt` | `>` | Greater than |
| `gte` | `>=` | Greater than or equal |
| `lt` | `<` | Less than |
| `lte` | `<=` | Less than or equal |
| `like` | `LIKE` | Pattern matching |
| `ilike` | `ILIKE` | Case-insensitive like |
| `inArray` | `IN` | Valor em array |

Por que usar essas funcoes em vez de strings SQL: elas tratam nomes de colunas/tabelas automaticamente (evitam ambiguidade em joins), previnem SQL injection, e garantem tipagem correta.

## Construtor URL para links de autenticacao

O instrutor usa `new URL(path, base)` do JavaScript global (disponivel em Node, Bun e browser). Isso e melhor que concatenacao de strings porque:

1. Encoding automatico de caracteres especiais
2. `searchParams.set()` adiciona query params de forma segura
3. `.toString()` gera a URL completa e valida

O link final fica no formato:
```
http://localhost:3333/auth-links/authenticate?code=CUID&redirect=http://localhost:5173
```

## Variaveis de ambiente para URLs

Duas env vars sao necessarias:
- `API_BASE_URL` — onde a API esta rodando (ex: `http://localhost:3333`)
- `AUTH_REDIRECT_URL` — para onde redirecionar apos autenticacao (ex: `http://localhost:5173`, porta padrao do Vite)

O instrutor enfatiza que o redirect URL depende do frontend que o aluno esta usando — se a porta for diferente, basta mudar a env var.

## Por que nao enviar email nesta aula

O instrutor menciona o Resend como ferramenta de envio de email, mas explica que ele exige um dominio proprio (mesmo no plano gratuito). Como nem todos os alunos tem dominio, ele opta por `console.log` do link por enquanto. Alternativa mencionada: MailTrap para testar envio de emails em desenvolvimento.