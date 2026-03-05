# Deep Explanation: Definindo Papel do Usuário

## Por que roles no JWT e não no banco?

O instrutor Rodrigo mostra uma progressão natural: primeiro o middleware (`ensureAuthenticated`) já valida o token e extrai o `sub` (user ID). Agora, para controle de acesso, o papel precisa estar disponível **sem round-trip ao banco**.

A lógica é: o JWT já carrega informação confiável (assinada). Se o role está lá, qualquer middleware ou controller pode ler instantaneamente. Consultar o banco a cada request para saber o papel seria redundante e lento.

## A analogia do crachá

Pense no JWT como um crachá de empresa:
- **Antes:** O crachá tinha só o nome (ID). Para saber se a pessoa podia entrar na sala de servidores, tinha que ligar para o RH (banco).
- **Depois:** O crachá tem nome + cargo. O segurança da porta lê o cargo e decide na hora.

## O problema do token imutável

Rodrigo demonstra ao vivo: após adicionar `role` ao payload e salvar, ele tenta acessar a rota e `role` vem `undefined`. Por quê? O token antigo foi gerado **sem** o campo `role`. JWT é imutável — uma vez assinado, o conteúdo não muda.

**Solução:** Gerar novo token fazendo login novamente. Isso é importante em produção: se você adiciona campos ao JWT, tokens existentes não os terão até o usuário fazer login novamente.

## O encaixe das peças (passo a passo do instrutor)

Rodrigo enfatiza que mostra passo a passo propositalmente — "quero mostrar pra você como que as peças vão se encaixando":

1. **Definir o role no usuário** — `fakeUser.role = "customer"`
2. **Inserir no JWT** — `sign({ role: fakeUser.role }, secret, { subject: fakeUser.id })`
3. **Tipar o payload** — interface `TokenPayload` com `role` e `sub`
4. **Extrair no middleware** — `const { role, sub } = verify(token, secret) as TokenPayload`
5. **Propagar no request** — `request.user = { id: sub, role }`
6. **Tipar o Express** — adicionar `role` no `express.d.ts`
7. **Usar no controller** — `request.user.role`

Cada peça depende da anterior. Se pular uma, o TypeScript ou o runtime vai reclamar.

## Regra de negócio como motivação

O instrutor usa um exemplo concreto: "só vendedores podem criar produtos, clientes só podem listar". Isso demonstra que roles não são feature técnica abstrata — nascem de uma **necessidade de negócio**. A implementação técnica (JWT payload, middleware, tipagem) é o meio, não o fim.

## Edge cases importantes

### Role mudou no banco mas JWT ainda tem o antigo
Em produção, se um admin muda o role de um usuário de "customer" para "seller", o JWT antigo ainda dirá "customer" até o próximo login. Soluções:
- Tokens com expiração curta (15-30min) + refresh token
- Blacklist de tokens (mais complexo)
- Aceitar o delay como trade-off

### Múltiplos roles
O exemplo usa string simples (`"customer"`). Para sistemas com múltiplos roles, considere:
- Array: `roles: ["seller", "admin"]`
- Bitfield: para sistemas de alta performance
- A tipagem muda de `role: string` para `roles: string[]`

### Payload JWT não é secreto
O payload do JWT é apenas encodado em base64, **não encriptado**. Qualquer pessoa com o token pode ler o role. Não coloque informações sensíveis no payload — roles são dados públicos do perfil, então é seguro.