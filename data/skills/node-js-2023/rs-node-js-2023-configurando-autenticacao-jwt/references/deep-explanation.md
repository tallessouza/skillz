# Deep Explanation: Configurando Autenticacao JWT no NestJS

## Por que um AuthModule separado?

O NestJS funciona com sistema de modulos hierarquicos. Quando voce importa um modulo dentro do AppModule, tudo que esta definido naquele modulo (controllers, providers, exports) passa a funcionar para toda a aplicacao. Isso permite organizar o codigo por dominio — autenticacao fica isolada no AuthModule, e basta um `imports: [AuthModule]` no AppModule para ativar tudo.

## register vs forRoot vs registerAsync

O NestJS tem convencoes diferentes para configuracao de modulos:

- **forRoot** — usado pelo ConfigModule e outros modulos que devem ser configurados uma unica vez na raiz. Garante singleton global.
- **register** — usado pelo JwtModule e similares. Configura o modulo com valores estaticos passados diretamente.
- **registerAsync** — variante assincrona do register. Permite usar dependency injection (DI) durante a configuracao. Essencial quando voce precisa de servicos como ConfigService para obter valores de ambiente.

### O problema do register simples

```typescript
// Isso NAO funciona — nao ha acesso ao ConfigService
JwtModule.register({
  secret: configService.get('JWT_SECRET'), // configService nao existe aqui
})
```

O `register` recebe um objeto literal. Nao ha contexto de DI. Por isso existe o `registerAsync`:

```typescript
JwtModule.registerAsync({
  inject: [ConfigService],  // declara dependencias
  useFactory(config: ConfigService<Env, true>) {  // recebe as dependencias
    return { secret: config.get('JWT_SECRET', { infer: true }) }
  },
})
```

O `inject` lista os servicos que voce quer usar. O `useFactory` e uma funcao que recebe esses servicos na mesma ordem e retorna o objeto de configuracao.

## HS256 vs RS256 — A analogia dos microservicos

O instrutor usa uma analogia visual muito clara:

### Cenario: Backend principal + Servico de notificacoes

```
[Backend Principal]          [Servico de Notificacoes]
  - Faz autenticacao           - Precisa validar se usuario esta logado
  - Gera tokens JWT            - NAO cria tokens novos
  - Tem o SECRET               - Precisa do SECRET pra validar?
```

**Com HS256:** O mesmo secret (uma string) e usado para criar E validar tokens. Se o servico de notificacoes precisa validar, voce precisa copiar o secret para la. Isso e inseguro porque:
- O servico de notificacoes agora pode CRIAR tokens (nao deveria)
- Se qualquer servico vazar o secret, toda autenticacao esta comprometida
- Cada novo servico que precisa validar recebe uma copia do secret

**Com RS256:** Existem DUAS chaves:
- **Chave privada** — usada para CRIAR tokens. Fica SOMENTE no backend principal.
- **Chave publica** — usada para VALIDAR tokens. Pode estar em TODOS os servicos.

```
[Backend Principal]          [Servico de Notificacoes]
  - Chave PRIVADA              - Chave PUBLICA (somente)
  - Cria tokens                - Valida tokens
  - Valida tokens              - NAO consegue criar tokens
```

A chave publica e derivada da chave privada. Ela consegue verificar se um token foi criado pela chave privada correspondente, mas NAO consegue criar novos tokens. Mesmo que vaze, nao ha risco.

## Passport e o conceito de Strategies

Passport e uma biblioteca do ecossistema Node.js (funciona com Express, Fastify, etc.) que abstrai "modelos de autenticacao" em **strategies**:

| Strategy | Como funciona |
|----------|--------------|
| **JWT** | Token com expiracao enviado no header Authorization |
| **API Token** | Token que nao expira (para integracao entre servicos) |
| **Basic Auth** | Usuario e senha em toda requisicao |
| **OAuth** | Autenticacao via terceiros (Google, GitHub, etc.) |
| **Local** | Usuario e senha tradicionais |

O NestJS tem wrappers oficiais (`@nestjs/passport`, `@nestjs/jwt`) que integram o Passport com o sistema de DI e decorators do Nest.

## O parametro { infer: true } do ConfigService

Quando voce usa `ConfigService<Env, true>`, o segundo generic (`true`) ativa strict mode. E quando voce usa `config.get('JWT_SECRET', { infer: true })`, o TypeScript infere o tipo do retorno baseado na interface Env. Sem `{ infer: true }`, o retorno e `string | undefined`.