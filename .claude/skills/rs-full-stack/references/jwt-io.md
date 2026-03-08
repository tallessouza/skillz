---
name: rs-full-stack-jwt-io
description: "Validates JWT debugging and testing using jwt.io playground. Use when user asks to 'decode a JWT', 'test a token', 'debug JWT', 'inspect token payload', or 'verify JWT signature'. Applies correct workflow for encoding/decoding tokens and choosing strong secrets. Make sure to use this skill whenever working with JWT tokens that need visual inspection or debugging. Not for JWT implementation in code, authentication flow design, or token storage strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: authentication-jwt
  tags: [jwt, debugging, jwt-io, token, decode, signature]
---

# JWT.io — Playground para Testar Tokens

> Use jwt.io para codificar, decodificar e validar JSON Web Tokens antes de integrar no codigo.

## Key concepts

- Debugar um token que retorna 401/403
- Verificar se o payload contem os claims esperados
- Testar se a assinatura bate com o secret configurado
- Validar que o algoritmo do header esta correto

## Workflow

### Step 1: Acessar o playground

Abrir `https://jwt.io` e rolar ate a secao "Debugger".

### Step 2: Selecionar o algoritmo

Escolher o algoritmo no dropdown do header (HS256, HS384, RS256, etc.). O token codificado muda automaticamente ao trocar o algoritmo.

### Step 3: Editar o payload

Substituir o payload de exemplo pelos claims reais:

```json
{
  "user_id": "123456",
  "role": "admin",
  "exp": 1700000000
}
```

O lado codificado (esquerda) atualiza em tempo real.

### Step 4: Configurar a assinatura

Inserir o secret no campo "VERIFY SIGNATURE". O site indica a forca do segredo — usar combinacoes longas de letras, numeros e caracteres especiais.

### Step 5: Decodificar um token existente

Colar o token completo no lado esquerdo (codificado). O lado direito mostra header, payload e status da assinatura.

## Heuristics

| Situacao | Acao |
|----------|------|
| Token retorna "Invalid Signature" | Verificar se o secret no jwt.io bate com o do servidor |
| Payload aparece vazio | Checar se o token tem as 3 partes separadas por ponto |
| Algoritmo diferente do esperado | Comparar header do token com configuracao do servidor |
| Site mostra "weak secret" | Usar secret com 32+ caracteres alfanumericos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar secrets fracos como "rodrigo" ou "secret" em producao | Gerar hash forte com 256+ bits de entropia |
| Confiar apenas no jwt.io para validacao em producao | Usar biblioteca do backend (jsonwebtoken, jose) para validar |
| Compartilhar tokens reais de producao no site | Usar tokens de desenvolvimento ou ambiente local |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| jwt.io mostra "Invalid Signature" | Secret inserido no playground difere do usado no servidor | Copie o secret exato da configuração do servidor para o campo "VERIFY SIGNATURE" |
| Payload aparece como texto ilegível | Token colado está incompleto ou corrompido | Confirme que copiou o token completo com as 3 partes separadas por `.` |
| Site indica "weak secret" | Secret com poucos caracteres ou padrão simples | Use secret com 32+ caracteres misturando letras, números e caracteres especiais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura JWT e seguranca de secrets
- [code-examples.md](references/code-examples.md) — Exemplos praticos de payloads e configuracoes no playground