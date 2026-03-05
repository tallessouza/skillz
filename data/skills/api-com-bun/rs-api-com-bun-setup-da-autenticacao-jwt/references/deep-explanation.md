# Deep Explanation: Setup da Autenticação JWT no Elysia

## Por que o Elysia não traz auth built-in?

O Elysia é um micro framework — filosofia de instalar apenas o que precisa. Diferente de frameworks opinados (como NestJS com Passport), no Elysia você escolhe a estratégia: JWT, session, OAuth, etc. Isso dá flexibilidade mas exige configuração explícita.

## Estratégia Cookie-Based JWT

### O fluxo tradicional (Bearer Token):
1. Backend cria JWT → envia para frontend
2. Frontend armazena (localStorage, memory)
3. Frontend envia JWT no header `Authorization: Bearer <token>` em cada request
4. Backend valida

### O fluxo cookie-based (usado nesta aula):
1. Backend cria JWT → salva em cookie httpOnly
2. Frontend faz requests normalmente (browser envia cookies automaticamente)
3. Backend lê o JWT do cookie
4. Frontend **nem precisa saber que o JWT existe**

### Quando usar cookie-based?
Quando frontend e backend estão no **mesmo domínio** (ou subdomínio). Isso é comum com proxy reverso:
- `meuapp.com` → frontend
- `meuapp.com/api` → backend (via proxy reverso)

Nesse cenário, o browser envia os cookies automaticamente porque é o mesmo domínio. O frontend não precisa de lógica para gerenciar tokens.

## Algoritmos de assinatura JWT

### HS256 (HMAC + SHA-256) — Simétrico
- **Uma chave** (secret) para assinar E validar
- Quem assina = quem valida
- Ideal para: monolitos, uma aplicação backend
- Analogia: é como uma senha compartilhada — quem sabe o secret pode criar E verificar tokens

### RS256 / RS512 (RSA + SHA) — Assimétrico
- **Duas chaves**: privada (assina) + pública (valida)
- Chave privada: apenas o serviço que CRIA tokens conhece
- Chave pública: pode ser compartilhada com QUALQUER serviço que precise VALIDAR
- Ideal para: microserviços, onde vários serviços precisam validar mas apenas um cria tokens
- Analogia: chave pública é como um carimbo de "verificado" — qualquer um pode conferir, mas só o dono do carimbo pode criar

### Escolha prática:
- Backend único → HS256 (mais simples, mais rápido)
- Múltiplos serviços validando → RS256 (mais seguro para distribuição)

## As 3 partes do JWT

O token JWT é separado por pontos: `header.payload.signature`

1. **Header** (vermelho no jwt.io): algoritmo usado (ex: HS256) e tipo (JWT)
2. **Payload** (roxo no jwt.io): dados que você salva — `sub`, `restaurantId`, etc.
3. **Signature** (azul no jwt.io): assinatura criada com o secret

**Ponto crítico do instrutor:** JWT é **assinado**, não **criptografado**. Qualquer pessoa pode decodificar o payload (é apenas base64). A assinatura só garante que o conteúdo não foi alterado e que foi criado por quem tem o secret.

## Por que incluir restaurantId no payload?

O instrutor explica o raciocínio pragmático:

Imagine uma rota de listagem de pedidos. Sem `restaurantId` no token:
```sql
SELECT orders.* FROM orders
JOIN restaurants ON restaurants.id = orders.restaurant_id
JOIN users ON users.id = restaurants.manager_id
WHERE users.id = :userId
```

Com `restaurantId` no token:
```sql
SELECT * FROM orders WHERE restaurant_id = :restaurantId
```

É uma otimização de performance E simplicidade. O campo é `Optional` porque nem todo usuário é manager de restaurante.

## TypeBox como schema validator

O instrutor menciona que apesar de não gostar muito da sintaxe do TypeBox, reconhece que é uma das ferramentas de schema validation mais rápidas do mercado, junto com o Valibot — mais rápida que Zod. No Elysia, TypeBox é o padrão, então usar `t.Object`, `t.String`, `t.Optional` é o caminho natural.

## Por que cookie() sem configuração?

O instrutor deixa `cookie()` sem opções porque a maioria das configurações (expiry, httpOnly, secure, sameSite) faz mais sentido definir **na hora de criar cada cookie**, não globalmente. Cada cookie pode ter necessidades diferentes de expiração e segurança.