# Deep Explanation: Gerando Token JWT com RS256

## Por que RS256 e nao HS256?

O instrutor escolhe RS256 (RSA + SHA256) ao inves do HS256 (HMAC + SHA256) por um motivo fundamental: **assimetria**. Com RS256, a chave privada assina o token e a chave publica apenas verifica. Isso significa que voce pode distribuir a chave publica para qualquer servico que precise validar tokens sem comprometer a capacidade de gerar novos tokens.

Com HS256, o mesmo secret que assina tambem verifica — entao qualquer servico que valide tokens tambem pode gerar tokens falsos.

## O problema das quebras de linha

Chaves PEM tem este formato:
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...
(varias linhas)
-----END PRIVATE KEY-----
```

Variaveis de ambiente sao single-line. Se voce tentar colocar a chave PEM direto no .env, as quebras de linha se perdem e a chave fica invalida.

**Solucao do instrutor:** converter para base64, que gera uma string continua sem quebras de linha. Na aplicacao, `Buffer.from(key, 'base64')` reconstroi o conteudo original.

O instrutor enfatiza: **base64 nao e hashing**. E um encoding reversivel. Qualquer pessoa com o valor base64 consegue recuperar a chave original. Por isso as chaves base64 no .env tem a mesma criticidade das chaves PEM originais.

## Buffer no Node.js

O instrutor explica que `Buffer` e a forma do Node.js de carregar dados em memoria. `Buffer.from(string, encoding)` pega um texto em determinado encoding e converte para um buffer binario.

O JwtModule do NestJS aceita tanto string quanto Buffer para as chaves, entao nao e necessario chamar `.toString()` — passar o Buffer diretamente funciona.

## Fluxo completo da aula

1. **Gerar chave privada RSA** com OpenSSL (2048 bits)
2. **Gerar chave publica** a partir da privada (pode gerar varias publicas de uma privada)
3. **Converter ambas para base64** para armazenar no .env
4. **Deletar arquivos .pem e base64** do projeto (nao commitar)
5. **Configurar env.ts** com as novas variaveis (Zod schema)
6. **Configurar JwtModule** com `registerAsync`, injetando ConfigService
7. **Decodificar chaves** com `Buffer.from(key, 'base64')`
8. **Definir algoritmo RS256** no `signOptions`
9. **Criar controller** injetando `JwtService`
10. **Gerar token** com `this.jwt.sign({ sub: userId })`
11. **Validar no jwt.io** — colar token, selecionar RS256, colar chaves PEM

## O `isGlobal: true`

O instrutor menciona que coloca `global: true` no JwtModule porque quer usar o JwtService em controllers fora do AuthModule. Sem o global, o JwtService so estaria disponivel nos controllers declarados dentro do modulo onde o JwtModule foi importado.

## Validacao no jwt.io

O instrutor demonstra que apos gerar o token, pode-se colar no jwt.io, selecionar RS256, e:
- Ver o payload (sub: user-id)
- Validar a assinatura colando as chaves PEM originais
- **Apenas a chave publica ja e suficiente para verificar a assinatura** — esse e o poder da criptografia assimetrica

## Proximo passo (mencionado)

A rota de autenticacao criada na aula e apenas o esqueleto. O instrutor avisa que ainda falta:
- Receber email e senha no body
- Validar que o usuario existe no banco
- Comparar a senha com o hash armazenado
- So entao gerar e retornar o token