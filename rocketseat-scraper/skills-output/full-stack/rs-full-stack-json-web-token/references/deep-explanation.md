# Deep Explanation: Configuração de JSON Web Token

## Por que separar pacote e tipagem

O `jsonwebtoken` é o pacote runtime — vai para produção. O `@types/jsonwebtoken` é apenas definição de tipos para TypeScript — só é necessário em tempo de desenvolvimento. Instalar tipagem como dependência normal infla o `node_modules` em produção desnecessariamente.

O instrutor faz questão de rodar dois comandos separados:
```bash
npm install jsonwebtoken@9.0.2
npm install -D @types/jsonwebtoken@9.0.6
```

A flag `-D` (ou `--save-dev`) garante que a tipagem vai para `devDependencies` no `package.json`.

## Por que centralizar configuração

O instrutor cria uma pasta `src/configs/` especificamente para configurações. O arquivo `auth.ts` (chamado de `alf.ts` na transcrição, mas o padrão recomendado é `auth.ts`) exporta um objeto com namespace:

```typescript
export const authConfig = {
  jwt: {
    secret: ...,
    expiresIn: ...,
  },
}
```

A vantagem do objeto aninhado (`authConfig.jwt.secret`) é que, quando o projeto crescer e precisar de OAuth, API keys, ou outras estratégias de autenticação, tudo fica organizado sob o mesmo config:

```typescript
export const authConfig = {
  jwt: { secret, expiresIn },
  oauth: { clientId, clientSecret },
  apiKey: { headerName },
}
```

## Por que usar fallback com operador OR

```typescript
secret: process.env.JWT_SECRET || "default"
```

O instrutor explica: "caso não exista uma variável, a gente pode colocar um pipe, ou o operador de ou, e colocar o valor default como padrão. Então, se por algum motivo, não carregou esse conteúdo, então usa esse padrão aqui."

Isso é uma prática defensiva. Em desenvolvimento local, se o `.env` não foi configurado ainda, a aplicação não quebra com `undefined`. Em produção, a variável de ambiente DEVE existir — o fallback é apenas para desenvolvimento.

**Atenção:** Em produção real, o fallback "default" é uma vulnerabilidade. A recomendação é validar que `JWT_SECRET` existe no boot da aplicação e falhar fast se não existir. Mas para desenvolvimento e aprendizado, o fallback evita friction desnecessário.

## Por que definir expiração

O instrutor configura `expiresIn: "1d"` (um dia). Ele explica: "Essa configuração é pra gente determinar qual é a duração, ou melhor dizendo, a validade de um token. Se eu tentar usar esse token, depois de um dia, esse token já vai estar inválido."

Tokens JWT sem expiração são um risco de segurança grave — se um token vazar, ele vale para sempre. Com expiração de 1 dia, o dano é limitado temporalmente.

Formatos comuns aceitos pelo `jsonwebtoken`:
- `"1d"` — 1 dia
- `"2h"` — 2 horas
- `"30m"` — 30 minutos
- `"7d"` — 7 dias
- `60` (número) — 60 segundos

## Estrutura de pastas

O instrutor cria a seguinte estrutura:
```
src/
└── configs/
    └── auth.ts    # (alf.ts na aula)
```

A pasta `configs` (plural) é o padrão para armazenar arquivos de configuração da aplicação. Cada domínio de configuração tem seu próprio arquivo.