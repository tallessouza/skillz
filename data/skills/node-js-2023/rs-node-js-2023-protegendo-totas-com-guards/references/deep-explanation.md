# Deep Explanation: Protegendo Rotas com Guards

## Por que chave publica e suficiente na Strategy?

O instrutor Diego explica usando o conceito de criptografia assimetrica (RS256):

- **Chave privada** → usada apenas para **criar** (assinar) tokens. Configurada no `JwtModule.registerAsync()` como configuracao global da aplicacao.
- **Chave publica** → usada para **validar** que um token foi realmente assinado pela chave privada correspondente. E isso que a Strategy faz.

Analogia: a chave privada e como um carimbo oficial. So quem tem o carimbo pode criar documentos oficiais. Mas qualquer pessoa com uma referencia publica do carimbo pode verificar se o documento e autentico.

## O papel do metodo `validate()`

O metodo `validate()` e **opcional** no Passport, mas o instrutor recomenda fortemente usa-lo. O fluxo e:

1. Passport verifica se o token e criptograficamente valido (assinatura correta, nao expirado)
2. Se valido, chama `validate(payload)` passando o conteudo decodificado do token
3. No `validate()`, voce garante que o payload tem a estrutura esperada

Mesmo que um token seja valido criptograficamente, ele pode ter sido gerado com um payload incompleto ou incorreto. O Zod schema garante que `sub` existe e e um UUID valido.

## Por que criar um Guard customizado?

O instrutor mostra que `@UseGuards(AuthGuard('jwt'))` funciona, mas cria repeticao. Criar `JwtAuthGuard extends AuthGuard('jwt')` sem nenhuma implementacao adicional:

- Centraliza a string `'jwt'` em um unico lugar
- Torna o codigo nos controllers mais limpo
- Facilita adicionar logica customizada no futuro (logging, rate limiting)

## Armadilhas comuns mencionadas

1. **Esquecer o `@Injectable()`** — o NestJS nao consegue injetar `ConfigService` na Strategy sem esse decorator. Erro silencioso ou confuso.
2. **Nao registrar a Strategy nos providers** — o arquivo existe mas o NestJS nao sabe que ele existe. A rota retorna 500 ou erro de dependencia.
3. **Base64 na public key** — como a chave esta em base64, e necessario `Buffer.from(publicKey, 'base64')`. Esquecer isso causa erro de validacao de token.

## Configuracao do cliente HTTP para testes

O instrutor mostra um truque util: usar variaveis no cliente HTTP (REST Client do VS Code) para automatizar o token:

```http
@authToken = {{authenticate.response.body.accessToken}}

###
# @name authenticate
POST http://localhost:3333/sessions

###
POST http://localhost:3333/questions
Authorization: Bearer {{authToken}}
```

Isso evita copiar/colar tokens manualmente a cada teste. A variavel `authToken` automaticamente absorve o valor do token retornado pela requisicao de login.

## Dependencias necessarias

```bash
npm install passport-jwt
npm install -D @types/passport-jwt
```

O `passport-jwt` e a strategy especifica para JWT do Passport. A tipagem e instalada separadamente como devDependency.