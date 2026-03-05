# Deep Explanation: Principios da Autenticacao JWT

## Por que nao Basic Auth?

O instrutor explica que Basic Auth exige que **toda requisicao** carregue email e senha codificados em Base64. Base64 nao e criptografia — e apenas encoding reversivel. Exemplo do instrutor:

```
diego@rocketseat.com:123456 → encode Base64 → ZGllZ29Acm9ja2V0c2VhdC5jb206MTIzNDU2
```

O backend decodifica e obtem as credenciais. O problema: mesmo com HTTPS, um malware na maquina do usuario pode interceptar essas credenciais em toda requisicao. Com JWT, as credenciais sao enviadas **uma unica vez** (no login).

## O conceito de Stateless

O instrutor enfatiza que "stateless" significa **nao armazenado em nenhuma estrutura de persistencia de dados**. Isso e contraintuitivo: como validar algo que nao esta salvo?

A resposta e a **palavra-chave (secret)**. O backend e o unico detentor da chave secreta. Quando recebe um token no futuro, ele:
1. Pega header + payload do token
2. Recalcula a assinatura usando sua chave secreta
3. Compara com a assinatura que veio no token
4. Se bate → token autentico. Se nao → rejeitado.

Nao precisa consultar banco de dados para isso.

## Analogia da assinatura

O instrutor demonstra no site jwt.io que mudar qualquer caractere no payload (ex: trocar ID de 1 para 2) **muda completamente a assinatura**. Ele mostra ao vivo:
- ID 1 → assinatura comeca com "JA..."
- ID 2 → assinatura comeca com "ZV..."

Isso prova que nao e possivel adulterar o payload sem invalidar o token, porque so quem tem a chave secreta consegue gerar uma assinatura valida para aquele payload.

## HS256 vs RS256

O instrutor menciona brevemente dois algoritmos:
- **HS256**: usa uma string como chave secreta. Simples, adequado para a maioria das aplicacoes.
- **RS256**: usa par de chaves (privada para criar, publica para validar). Util em microservicos onde multiplos servicos precisam validar tokens sem ter acesso a chave de criacao.

## Organizacao de rotas

O instrutor separa rotas em dois grupos:
1. **Publicas**: criar usuario (`POST /users`) e fazer login (`POST /sessions`)
2. **Protegidas**: tudo abaixo, como `GET /me` — so acessiveis com JWT valido

Ele cria a rota `/me` como exemplo de rota protegida que retorna os dados do usuario logado, extraindo o ID do token.

## Bearer vs Basic no header Authorization

O header `Authorization` suporta diferentes esquemas:
- `Basic <base64>` → credenciais diretas
- `Bearer <token>` → token JWT

"Bearer" e a terminologia padrao para enviar tokens de autenticacao na web.