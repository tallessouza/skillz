# Deep Explanation: Correções de Dockerfile para Produção

## Por que copiar o package.json separadamente?

O Docker usa um sistema de cache por layers. Cada instrução `COPY` ou `RUN` cria uma nova layer. Quando você copia o `package.json` separadamente antes do `npm install`, o Docker consegue reutilizar o cache do `npm install` enquanto o `package.json` não mudar — mesmo que o código fonte mude.

Se você fizer `COPY . .` antes do `npm install`, qualquer mudança em qualquer arquivo invalida o cache e força uma reinstalação completa das dependências.

A sequência ideal:
1. `COPY package.json .` (e `package-lock.json`)
2. `RUN npm install --production`
3. `COPY dist/ ./dist/` (ou código compilado)

## Por que start:prod em vez de start?

No ecossistema NestJS, o script `start` padrão gerado pelo CLI é:

```json
"start": "nest start"
```

Isso depende do `@nestjs/cli` que é uma **devDependency**. Quando você instala dependências com `--production` (ou `--omit=dev`), o `nest` CLI simplesmente não existe no `node_modules/.bin/`.

O script `start:prod` usa Node diretamente:

```json
"start:prod": "node dist/main"
```

Isso funciona porque:
- O código já foi compilado (TypeScript → JavaScript) durante o build
- O `dist/main.js` é JavaScript puro que o Node executa diretamente
- Não precisa de nenhuma ferramenta de build em runtime

O instrutor enfatiza que isso é uma **boa prática**: em produção, você nunca deveria depender de ferramentas de desenvolvimento para rodar sua aplicação.

## Volumes: quando usar e quando não usar

O instrutor faz uma distinção importante:

- **Container de aplicação**: NÃO precisa de volume. O código está embutido na imagem Docker. Se precisar atualizar, faz uma nova build.
- **Container de banco de dados**: PRECISA de volume. Os dados precisam persistir mesmo quando o container é destruído e recriado.

Na aula anterior, volumes foram usados para entender o conceito. Mas em produção real, associar um volume ao container da aplicação pode causar problemas — como sobrescrever o código da imagem com arquivos locais desatualizados.

## Fluxo de build e execução

O instrutor demonstra o ciclo:

1. Fazer as correções no Dockerfile
2. Buildar a nova imagem com uma tag versionada (`v8`)
3. Executar sem volume
4. Manter a rede configurada (para comunicação entre containers)
5. Verificar que a aplicação está rodando

Esse ciclo de build → tag → run é o padrão para deployments de container.