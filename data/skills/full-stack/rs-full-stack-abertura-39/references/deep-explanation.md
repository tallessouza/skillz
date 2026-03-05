# Deep Explanation: Autenticação vs Autorização com JWT

## Por que separar autenticação de autorização?

São responsabilidades fundamentalmente diferentes no ciclo de vida de uma requisição:

**Autenticação** responde: "Quem está fazendo essa requisição?"
- Acontece uma vez (no login)
- Produz uma prova de identidade (o token JWT)
- É sobre IDENTIDADE

**Autorização** responde: "Essa pessoa pode fazer isso?"
- Acontece em CADA requisição protegida
- Consome a prova de identidade para tomar decisões
- É sobre PERMISSÃO

### Analogia prática

Pense em um prédio comercial:
- **Autenticação** = o crachá na recepção. Você prova quem é (RG, documento), recebe um crachá (token).
- **Autorização** = as catracas em cada andar. O crachá abre ou não abre dependendo do seu nível de acesso.

Você não mostra o RG em cada andar — mostra o crachá. Da mesma forma, você não envia email+senha em cada request — envia o JWT.

## Por que JWT para APIs Node.js?

JSON Web Token (JWT) é o padrão para APIs REST porque é **stateless**:

1. **Sem estado no servidor** — o token contém todas as informações necessárias (userId, role, expiração). O servidor não precisa manter uma tabela de sessões.
2. **Escalável** — qualquer instância do servidor pode validar o token sem consultar banco de dados.
3. **Padrão aberto** — RFC 7519, suportado em todas as linguagens.

### Estrutura do JWT

```
header.payload.signature
```

- **Header:** algoritmo de assinatura (HS256, RS256)
- **Payload:** dados do usuário (claims) — userId, role, exp
- **Signature:** garante que o token não foi adulterado

### Trade-offs do JWT

| Vantagem | Desvantagem |
|----------|-------------|
| Stateless, escalável | Difícil revogar antes da expiração |
| Auto-contido | Payload visível (base64, não criptografado) |
| Padrão da indústria | Tamanho maior que session ID simples |

## Fluxo detalhado

```
Cliente                          Servidor
  │                                 │
  ├─── POST /sessions ──────────────►│
  │    {email, password}             │
  │                                 │ 1. Busca usuário por email
  │                                 │ 2. Compara hash da senha
  │                                 │ 3. Gera JWT com userId + role
  │◄── { token: "eyJhbG..." } ──────┤
  │                                 │
  ├─── GET /profile ─────────────────►│
  │    Authorization: Bearer eyJ...  │
  │                                 │ 4. Middleware decodifica JWT
  │                                 │ 5. Verifica expiração
  │                                 │ 6. Injeta userId no request
  │◄── { user: {...} } ─────────────┤
```

## HTTP Status Codes corretos

- **401 Unauthorized** = autenticação falhou (token ausente, inválido ou expirado). Nome confuso, mas significa "não autenticado".
- **403 Forbidden** = autorização falhou (token válido, mas usuário não tem permissão). Significa "não autorizado".

Usar o status correto ajuda o cliente a saber se deve pedir novo login (401) ou mostrar "acesso negado" (403).

## Segurança do payload

O payload do JWT é apenas codificado em base64, **não criptografado**. Qualquer pessoa com o token pode ler o conteúdo. Por isso:

- Nunca coloque senhas, dados sensíveis ou PII no payload
- Use apenas identificadores mínimos: `sub` (userId), `role`, `exp`
- A assinatura garante INTEGRIDADE (não foi alterado), não CONFIDENCIALIDADE