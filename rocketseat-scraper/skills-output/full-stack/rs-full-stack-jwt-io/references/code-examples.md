# Code Examples: JWT.io Playground

## Exemplo 1: Payload basico (demonstrado na aula)

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "user_id": "123456"
}
```

**Secret:** `rodrigo` (apenas para demonstracao — NUNCA usar em producao)

**Token gerado:**
O jwt.io gera automaticamente o token codificado com tres partes separadas por pontos: `xxxxx.yyyyy.zzzzz`

## Exemplo 2: Payload com claims padrao

```json
{
  "sub": "user-uuid-here",
  "name": "Rodrigo",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700086400
}
```

Claims padrao (registered claims):
- `sub` — subject (identificador do usuario)
- `iat` — issued at (quando foi criado)
- `exp` — expiration (quando expira)

## Exemplo 3: Testando decodificacao

Para decodificar um token existente no jwt.io:

1. Copiar o token completo do backend/API
2. Colar no campo da esquerda (Encoded)
3. O lado direito mostra automaticamente header e payload
4. Inserir o secret no campo de assinatura
5. Verificar se aparece "Signature Verified" (checkmark verde)

## Exemplo 4: Gerando secrets fortes

```bash
# Gerar secret de 256 bits (recomendado para HS256)
openssl rand -base64 32

# Gerar secret de 512 bits (para HS512)
openssl rand -base64 64

# Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Exemplo 5: Comparacao visual de algoritmos

**Mesmo payload com HS256:**
```
Header: {"alg": "HS256", "typ": "JWT"}
Token: eyJhbGciOiJIUzI1NiIs...  (tamanho menor)
```

**Mesmo payload com HS512:**
```
Header: {"alg": "HS512", "typ": "JWT"}
Token: eyJhbGciOiJIUzUxMiIs...  (hash maior na assinatura)
```

O instrutor demonstra essa mudanca trocando o algoritmo no dropdown — o token codificado muda completamente mesmo sem alterar o payload.

## Fluxo tipico de debug com jwt.io

```
1. API retorna 401 Unauthorized
2. Copiar o token do header Authorization: Bearer <token>
3. Colar no jwt.io
4. Verificar:
   a. exp nao expirou?
   b. payload tem os claims esperados?
   c. algoritmo bate com o configurado no servidor?
   d. secret/key valida a assinatura?
5. Identificar o problema e corrigir no codigo
```