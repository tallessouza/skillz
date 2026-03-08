# Deep Explanation: Deploy de Aplicação Backend no Render

## Por que três comandos no Build Command?

O Render clona o repositório do GitHub, mas o repositório não contém tudo que a aplicação precisa para rodar. Dois artefatos essenciais estão no `.gitignore`:

1. **node_modules/** — Dependências do projeto. Não vão para o GitHub porque são pesadas e podem ser regeneradas com `npm install`.
2. **build/** — Código compilado (TypeScript → JavaScript). Não vai para o GitHub porque pode ser gerado facilmente com `npm run build`.

Por isso o build command encadeia três operações:
```
npm install && npm run build && npx prisma migrate deploy
```

O operador `&&` garante que cada comando só executa se o anterior foi bem-sucedido. Se `npm install` falhar, `npm run build` não executa — evitando erros em cascata.

### Por que `prisma migrate deploy` e não `prisma migrate dev`?

- `prisma migrate dev` é para desenvolvimento: cria migrations novas, reseta o banco se necessário, pede confirmação interativa
- `prisma migrate deploy` é para produção: aplica migrations existentes sem interação, nunca reseta dados, seguro para ambientes automatizados

Em produção, você nunca quer que o sistema crie novas migrations ou resete o banco automaticamente. O `deploy` apenas aplica o que já foi criado e testado em desenvolvimento.

## Internal vs External Database URL

O Render oferece duas URLs para cada banco de dados:

- **External Database URL**: Acessível de qualquer lugar na internet. Útil para conectar ferramentas locais (DBeaver, pgAdmin) ou aplicações hospedadas em outros provedores.
- **Internal Database URL**: Acessível apenas dentro da rede interna do Render. Mais rápida (sem overhead de rede pública) e mais segura (não exposta à internet).

Quando aplicação e banco estão no mesmo Render, sempre use a URL interna. A comunicação acontece dentro da rede privada do Render, sem passar pela internet pública.

## Segurança do JWT_SECRET

O instrutor demonstra por que um JWT_SECRET simples como "rodrigo" é perigoso: qualquer pessoa que adivinhe o nome consegue forjar tokens válidos.

A solução apresentada é gerar um hash MD5 a partir de uma palavra-chave conhecida apenas pelo time. O hash serve como uma camada de ofuscação — o segredo real é a palavra-chave, e o que vai para a variável de ambiente é o hash.

**Importante:** o time precisa lembrar a palavra-chave original, pois ela é necessária para regenerar o hash se a variável for perdida.

Em ambientes de produção mais robustos, considere:
- Gerar UUIDs v4 aleatórios
- Usar geradores de secrets do próprio provedor
- Rotacionar secrets periodicamente

## Fluxo completo do deploy no Render

```
1. GitHub Push (código-fonte)
       ↓
2. Render detecta o push (webhook)
       ↓
3. Render clona o repositório
       ↓
4. Executa Build Command:
   a. npm install → gera node_modules/
   b. npm run build → gera build/
   c. npx prisma migrate deploy → cria tabelas no banco
       ↓
5. Executa Start Command:
   npm start → node build/server.js
       ↓
6. Aplicação online na porta definida (PORT=3000)
```

## Variáveis de ambiente: .env vs Render

Em desenvolvimento, variáveis ficam no arquivo `.env` (que está no `.gitignore`). Em produção, são configuradas diretamente no painel do Render.

O Render injeta essas variáveis no ambiente de execução da aplicação, e o código acessa via `process.env.VARIAVEL`. O mesmo código funciona em ambos os ambientes sem modificação.

O arquivo `.env.example` serve como documentação: lista quais variáveis são necessárias sem expor valores reais. É boa prática manter esse arquivo atualizado no repositório.

## Por que o Render oculta valores de variáveis?

O painel do Render mostra bolinhas/quadrados no lugar dos valores das variáveis de ambiente por segurança. Para visualizar, passe o mouse sobre o valor ou clique no ícone de olho. Isso evita exposição acidental em compartilhamento de tela ou screenshots.