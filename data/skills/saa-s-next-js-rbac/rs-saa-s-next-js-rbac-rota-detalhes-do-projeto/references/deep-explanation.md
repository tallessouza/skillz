# Deep Explanation: Rota de Detalhes do Projeto

## Por que slug em vez de id?

O instrutor explica que a motivacao principal e a experiencia do usuario no frontend. Quando o projeto aparece na URL do navegador, `app.com/org/minha-empresa/project/meu-projeto` e muito mais legivel que `app.com/org/clkj2h3k4/project/cm9x8y7z6`.

Alem disso, usar slug elimina a necessidade de duas chamadas na API: uma para resolver o slug para id e outra para buscar os dados. Se a rota ja aceita slug, o frontend faz uma unica chamada.

O mesmo padrao ja foi aplicado para organizacoes anteriormente no curso — consistencia.

## Select explicito no Prisma

O instrutor usa `select` em vez de retornar o objeto completo por dois motivos:

1. **Seguranca**: evita vazar campos sensiveis que possam existir no model (como tokens, hashes, campos internos)
2. **Contrato de API**: o select documenta exatamente o que a rota retorna, e o TypeScript valida que o schema Zod e compativel

Quando o instrutor demonstra que errar um campo no schema Zod causa erro de TypeScript, isso prova que o select + Zod criam um contrato type-safe entre banco e API.

## Select aninhado para relacoes

Para o `owner`, o instrutor usa select aninhado:
```typescript
owner: {
  select: { id: true, name: true, avatarUrl: true }
}
```

Isso retorna apenas campos publicos do owner, sem expor email, senha ou outros dados sensiveis do usuario.

## Tratamento de not found

O instrutor usa `BadRequestError` em vez de `NotFoundError`. Isso pode parecer semanticamente incorreto (404 vs 400), mas segue o padrao ja estabelecido no projeto onde erros de negocio usam `BadRequestError`. O importante e que o tratamento acontece ANTES do return, para que o TypeScript elimine `null` do tipo.

## Compatibilidade schema-Prisma

O instrutor demonstra ao vivo: se o schema Zod nao for compativel com o retorno do Prisma select, o TypeScript acusa erro no `reply.send()`. Isso funciona como uma validacao em tempo de desenvolvimento — se mudar o select, o schema quebra e vice-versa.

## Registro da rota

Apos criar a funcao, ela precisa ser registrada no server principal com `app.register(getProject)`. O instrutor menciona que a rota ja aparece automaticamente no Swagger apos o registro, gracas ao plugin fastify-swagger que le os schemas Zod.