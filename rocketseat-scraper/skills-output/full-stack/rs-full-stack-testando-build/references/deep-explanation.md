# Deep Explanation: Testando Build

## Por que executar com Node direto?

Quando fazemos o build de um projeto TypeScript (com tsup, tsc, ou outro bundler), o output é JavaScript puro. Isso significa que não precisamos mais do `ts-node`, `tsx`, ou qualquer runtime TypeScript. O Node.js nativo é suficiente e mais performático.

Usar `ts-node` em produção adiciona overhead desnecessário — ele faz transpilação em tempo real, o que consome CPU e memória. A build já resolveu isso no momento da compilação.

## O problema das variáveis de ambiente

A pasta `build/` contém apenas o código compilado. Ela **não** contém o arquivo `.env` que está na raiz do projeto. Quando a aplicação usa validação de variáveis de ambiente (como Zod para validar `DATABASE_URL`, `JWT_SECRET`, etc.), ela vai falhar imediatamente ao iniciar sem essas variáveis.

### Solução para teste local

O Node.js tem a flag `--env-file` que carrega um arquivo `.env` antes de executar o script:

```bash
node --env-file=.env build/server.js
```

Isso é equivalente a usar `dotenv` mas sem precisar de dependência extra — é nativo do Node.js.

### Por que não incluir --env-file no script start?

O script `start` do `package.json` é o que plataformas de deploy (Render, Railway, Heroku, AWS) vão executar. Nessas plataformas, as variáveis de ambiente são configuradas pelo painel ou CLI da plataforma, não por um arquivo `.env`.

Se incluirmos `--env-file=.env` no script start:
1. O deploy vai falhar se não houver `.env` no servidor
2. Mesmo que exista, pode conflitar com as env vars do sistema

Por isso, o script start deve ser limpo: `node build/server.js`. As variáveis de ambiente são responsabilidade do ambiente de execução, não da aplicação.

## npm start vs npm run start

O `start` é um dos "lifecycle scripts" padrão do npm (assim como `test`, `stop`, `restart`). Lifecycle scripts podem ser executados sem o `run`:

```bash
npm start        # funciona
npm run start    # também funciona, mas é redundante
npm test         # funciona sem run
npm run build    # build NÃO é lifecycle, precisa de run
```

Isso é uma conveniência do npm. Scripts customizados como `build`, `dev`, `lint` sempre precisam de `npm run`.

## Analogia do instrutor

O instrutor compara o processo a um teste de fábrica: você compila (fabrica o produto), depois testa se funciona antes de enviar para produção. O `--env-file` é como um "ambiente de teste" temporário — em produção, o ambiente real fornece as configurações.

## Edge cases

### E se a build usar imports com extensão .ts?
Se o bundler não resolver corretamente as extensões, o Node pode falhar com `MODULE_NOT_FOUND`. A build deve gerar arquivos `.js` com imports resolvidos.

### E se precisar de variáveis diferentes para teste local?
Crie um `.env.test` ou `.env.local` e use:
```bash
node --env-file=.env.local build/server.js
```

### E se o Node não suportar --env-file?
A flag `--env-file` está disponível a partir do Node.js 20.6.0. Para versões anteriores, use:
```bash
node -r dotenv/config build/server.js
```

Isso requer o pacote `dotenv` instalado como dependência.