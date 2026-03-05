# Deep Explanation: Utilizando Cookies no Fastify

## O que são cookies e por que usar

Cookies são formas de manter contexto entre requisições HTTP. O HTTP é stateless — cada request é independente. Cookies resolvem isso salvando informações no navegador/cliente que são reenviadas automaticamente em toda requisição subsequente.

### A analogia das redes sociais

O instrutor Diego trouxe um insight importante: redes sociais como Instagram e Facebook não precisam que você esteja logado para saber quem você é. No momento que você acessa o site, um ID é salvo nos seus cookies. Mesmo sem autenticação, a aplicação rastreia tudo que você faz. Quando você finalmente faz login, todo o histórico pré-login é associado à sua conta.

Isso é exatamente o padrão implementado aqui: usar `session_id` para rastrear ações antes de ter um sistema de autenticação completo.

### Por que session_id e não autenticação?

A coluna `session_id` na tabela `transactions` foi planejada desde o início da aplicação. A estratégia é:

1. Usuário cria primeira transação → gera sessionId no cookie
2. Todas as transações subsequentes usam o mesmo sessionId
3. Listagens filtram por sessionId
4. Futuramente, quando houver login, basta associar sessionId → userId

Isso significa que a aplicação já isola dados por usuário sem precisar de email, senha ou tabela de users.

### Cookies vs outros parâmetros

Cookies são como parâmetros (body, query, headers), mas com uma diferença fundamental: são criados pela aplicação e enviados automaticamente pelo cliente. O usuário não precisa incluir manualmente em nenhum lugar.

## Detalhes técnicos importantes

### Ordem de registro de plugins

No Fastify, plugins são registrados sequencialmente. Se as rotas de transactions são registradas antes do plugin de cookie, as rotas não terão acesso a `request.cookies` nem `reply.cookie()`. A ordem importa:

```typescript
app.register(cookie)           // PRIMEIRO
app.register(transactionsRoutes) // DEPOIS
```

### A correção do maxAge

O instrutor cometeu um erro inicial: usou milissegundos (`1000 * 60 * 60 * 24 * 7`). A tipagem do TypeScript até sugeria milissegundos, mas a documentação oficial do `@fastify/cookie` define maxAge em segundos. A correção foi remover o `1000 *` inicial.

Isso é um lembrete importante: **sempre confie na documentação oficial sobre tooltips ou tipagem**.

### Clean code na definição de duração

Duas dicas de clean code que o instrutor enfatizou:

1. **Nunca use o valor calculado final** — `604800` é ilegível. Use `60 * 60 * 24 * 7` para que qualquer pessoa entenda a composição.
2. **Comente o significado** — adicione `// 7 days` ao lado para que alguém que queira mudar para 30 dias saiba exatamente onde alterar.

### Opções de expiração do cookie

Existem duas formas de definir expiração:
- `expires`: um objeto `Date` com a data exata de expiração (ex: `new Date(2023, 12, 1, 8, 0, 0)`)
- `maxAge`: duração em segundos a partir do momento de criação

O `maxAge` é preferido porque é relativo e mais simples de configurar.

### LGPD e cookies

O instrutor mencionou que, pela LGPD, sites são obrigados a perguntar se o usuário aceita cookies (dependendo do tipo de cookie). Isso é relevante para aplicações em produção que precisam de compliance.