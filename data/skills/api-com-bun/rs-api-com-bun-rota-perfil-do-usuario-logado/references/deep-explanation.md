# Deep Explanation: Rota de Perfil do Usuario Autenticado

## Por que centralizar getCurrentUser no plugin de auth

O instrutor demonstra um padrao importante: mover a logica de buscar o usuario autenticado para dentro do plugin de autenticacao (`authentication.ts`), ao inves de deixar em cada rota individual.

A razao e pratica: toda rota autenticada precisa fazer exatamente a mesma sequencia:
1. Ler cookie `auth`
2. Chamar `jwt.verify(cookie.auth)`
3. Verificar se payload e valido
4. Extrair `sub` (userId) e outros campos

Duplicar isso em cada rota e um convite para inconsistencias. O plugin Elysia permite que `getCurrentUser` seja exposto como uma funcao disponivel no contexto de qualquer rota que use `.use(auth)`.

## O padrao `/me`

O instrutor explica sua preferencia: "Quando é uma rota que precisa retornar os dados do usuário logado, eu vou chamar essa rota de barra me, como se fosse barra eu."

Isso e um padrao REST comum. `GET /me` e semanticamente claro — retorna os dados de "quem esta fazendo a requisicao". Evita paths como `/user/profile` ou `/user/current` que sao mais verbosos sem adicionar clareza.

## jwt.verify vs jwt.sign

O instrutor diferencia explicitamente:
- `jwt.sign` — cria um novo JWT (usado no login)
- `jwt.verify` — verifica que o JWT foi gerado pela nossa aplicacao E retorna o payload contido nele

O ponto crucial: `verify` pode retornar `false` (nao apenas lancar erro), entao e necessario checar explicitamente o retorno antes de usar os dados.

## Por que consultar o banco mesmo tendo dados no JWT

O JWT contem apenas dados minimos (`sub`, `restaurantId`). Para retornar o perfil completo, e necessario consultar o banco. Alem disso, dados no JWT podem estar desatualizados (o usuario pode ter mudado nome, email, etc. desde que o token foi emitido).

## Retorno explicito vs payload cru

O instrutor mostra uma escolha de design: ao inves de retornar `payload` diretamente do `getCurrentUser`, ele sugere ser mais descritivo:

```typescript
return {
  userId: payload.sub,
  restaurantId: payload.restaurantId,
}
```

Isso torna o contrato da funcao explicito — quem consome sabe exatamente quais campos esperar, sem depender da estrutura interna do JWT.

## Testando rotas autenticadas (Hopscotch)

O instrutor demonstra a dificuldade de testar rotas com cookies via CLI (httpie) e migra para o Hopscotch (similar ao Insomnia/Postman). Pontos importantes:
- O Hopscotch nao salva cookies automaticamente em todos os casos
- Foi necessario copiar manualmente o cookie do header `Set-Cookie` da resposta de autenticacao
- O dominio do cookie precisou ser configurado como `localhost` (sem porta) para funcionar
- O redirect apos autenticacao pode causar erro se o frontend nao estiver rodando — comentar temporariamente o redirect ajuda no teste