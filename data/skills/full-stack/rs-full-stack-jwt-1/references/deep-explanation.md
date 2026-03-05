# Deep Explanation: JWT (JSON Web Token)

## O raciocínio por trás do JWT

### Por que existe?

Antes do JWT, a forma padrão de identificar usuários era com sessões server-side: o servidor guardava um registro de cada usuário logado, e o cliente enviava um cookie com o ID da sessão. Isso funciona bem para aplicações monolíticas, mas cria problemas quando você tem múltiplos servidores (precisa compartilhar a sessão entre eles) ou quando trabalha com APIs stateless.

O JWT resolve isso colocando a informação **dentro do próprio token**. O servidor não precisa "lembrar" de nada — ele só precisa verificar que o token é válido (signature) e ler os dados (payload).

### Analogia: crachá de identificação

Pense no JWT como um crachá de empresa:
- **Header** = o tipo do crachá (material, formato)
- **Payload** = as informações impressas (nome, cargo, departamento, permissões)
- **Signature** = o holograma de segurança que prova que o crachá é autêntico

Qualquer pessoa pode **ler** as informações do crachá (o payload é público), mas ninguém consegue **falsificar** o holograma sem a chave secreta da empresa.

## As três partes em detalhe

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

O `alg` define qual algoritmo será usado para gerar a signature:
- **HS256** (HMAC-SHA256) — simétrico, usa uma secret key compartilhada
- **RS256** (RSA-SHA256) — assimétrico, usa par de chaves pública/privada

O `typ` é sempre `"JWT"`.

### Payload (Claims)

Claims são as informações carregadas no payload. Existem três tipos:

**Registered claims** (padrão da spec):
- `sub` (subject) — identificador do usuário
- `iat` (issued at) — timestamp de criação
- `exp` (expiration) — timestamp de expiração
- `iss` (issuer) — quem gerou o token
- `aud` (audience) — para quem o token é destinado

**Public claims** — definidos na IANA JWT Registry para evitar conflitos.

**Private claims** — customizados pela sua aplicação:
```json
{
  "sub": "user-456",
  "name": "Maria Silva",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Signature

A signature é gerada combinando o header codificado + payload codificado + uma secret key:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

Se alguém alterar um único caractere no header ou payload, a signature não bate mais — o token é rejeitado.

## Cenário completo de autorização (conforme a aula)

O instrutor destaca o fluxo mais comum:

1. **Login:** Usuário envia email + senha
2. **Validação:** Servidor verifica credenciais no banco
3. **Geração:** Servidor cria JWT com `{ sub: userId, role: userRole }` no payload
4. **Resposta:** Cliente recebe o JWT
5. **Uso:** Em cada requisição, cliente envia `Authorization: Bearer <token>`
6. **Verificação:** Servidor decodifica o token, extrai o `sub`, identifica o usuário
7. **Autorização:** Servidor verifica se o `role` permite a ação solicitada

### Por que isso é poderoso

Conforme o instrutor menciona: "a gente pode inclusive verificar se o que o usuário está tentando fazer dentro da nossa API, ele tem permissão ou não." O JWT não serve apenas para autenticação (quem é você?), mas também para **autorização** (o que você pode fazer?).

## Edge cases e considerações

### Token expirado
Sempre defina `exp`. Um token sem expiração é um risco de segurança permanente. Tokens de acesso curtos (15min-1h) + refresh tokens longos (7-30 dias) é o padrão recomendado.

### Token grande demais
Cada claim adicionado ao payload aumenta o tamanho do token, que vai em **cada request**. Evite colocar objetos grandes. Para dados extensos, use o `sub` como referência e consulte o banco quando necessário.

### Base64 não é criptografia
O instrutor mostra o lado "codificado" e "decodificado" do JWT. Codificado em Base64 **não é criptografado** — qualquer um pode decodificar e ler o payload. A signature protege contra **adulteração**, não contra **leitura**. Se precisa de sigilo, use JWE (JSON Web Encryption) em vez de JWS (JSON Web Signature).

### Stateless vs invalidação
O maior trade-off do JWT: por ser stateless, o servidor não tem como "revogar" um token antes do `exp`. Soluções:
- Blocklist em Redis (perde parte do benefício stateless)
- Tokens de curta duração + refresh token rotation
- Versioning de tokens por usuário (incrementa versão no logout)