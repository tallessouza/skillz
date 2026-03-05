# Deep Explanation: Instalando e Configurando Knex.js

## Por que Knex.js?

Knex.js e um query builder para Node.js que suporta multiplos bancos de dados (SQLite, PostgreSQL, MySQL). Diferente de um ORM completo como Prisma ou TypeORM, o Knex oferece controle fino sobre as queries SQL enquanto fornece uma API JavaScript/TypeScript fluente. Ele tambem tem um sistema robusto de migrations e seeds embutido.

## Versoes fixas: por que `@3.1.0` e `@5.1.7`?

O instrutor fixa versoes especificas para garantir que todos os alunos tenham o mesmo comportamento. Em projetos reais, isso evita:
- Breaking changes entre versoes minor/patch
- Incompatibilidade entre knex e o driver do banco (sqlite3)
- Bugs dificeis de reproduzir em diferentes ambientes

O comando de instalacao:
```bash
npm i knex@3.1.0 sqlite3@5.1.7
```

## Anatomia do knexfile.ts

### `client: "sqlite3"`
Define qual driver de banco de dados o Knex vai usar. Cada client tem comportamentos especificos. O SQLite armazena tudo em um unico arquivo local, perfeito para desenvolvimento e aplicacoes menores.

### `connection.filename`
Para SQLite, a conexao nao e um host/porta como em PostgreSQL. E simplesmente o caminho para o arquivo `.db`. O path `./src/database/database.db` coloca o banco dentro da estrutura do projeto, organizado na pasta database.

### `useNullAsDefault: true`
Configuracao especifica do SQLite. Quando voce cria uma coluna sem valor default e insere um registro sem preencher essa coluna, o SQLite precisa saber o que fazer. Com `useNullAsDefault: true`, ele usa `NULL`. Sem isso, o Knex pode lancar warnings ou erros confusos.

### `migrations.extension: "ts"`
Por padrao, o Knex gera migrations em `.js`. Como o projeto usa TypeScript, definimos `"ts"` para que as migrations criadas ja venham com a extensao correta.

### `migrations.directory`
Define onde as migrations ficam armazenadas. A convencao e `./src/database/migrations/`. O Knex cria essa pasta automaticamente quando voce roda o primeiro `migrate:make`.

### `seeds` (mesma logica)
Seeds sao dados iniciais para popular o banco (dados de teste, dados fixos como categorias). A configuracao segue o mesmo padrao: extensao TS e diretorio dentro de `src/database/seeds/`.

## O script no package.json

```json
"knex": "node --import tsx node_modules/.bin/knex"
```

### Por que nao simplesmente `npx knex`?

O `npx knex` executa o binario do Knex, mas nao sabe lidar com TypeScript. O `knexfile.ts` nao seria entendido.

### Por que `node --import tsx`?

O `tsx` e um runtime que permite ao Node.js executar TypeScript diretamente. O flag `--import tsx` registra o tsx como loader antes de executar qualquer coisa, permitindo que o Knex CLI leia o `knexfile.ts` sem precisar compilar para JS primeiro.

### Por que `node_modules/.bin/knex`?

Isso aponta diretamente para o binario do Knex instalado localmente no projeto, garantindo que a versao correta seja usada.

## Criando a primeira migration

```bash
npm run knex -- migrate:make create-product
```

### O `--` duplo
No npm scripts, o `--` separa os argumentos do npm dos argumentos que serao passados ao script. Sem ele, `migrate:make` seria interpretado pelo npm, nao pelo Knex.

### O que acontece:
1. Node.js inicia com tsx como loader
2. Knex CLI e executado
3. Knex le o `knexfile.ts` (agora possivel gracas ao tsx)
4. Cria o arquivo de migration em `./src/database/migrations/`
5. O nome do arquivo inclui timestamp + nome fornecido: `20240101120000_create-product.ts`

### Pasta criada automaticamente
Se `./src/database/migrations/` nao existir, o Knex a cria no momento da primeira migration. Por isso o instrutor menciona que criar a pasta antecipadamente e opcional.

## .gitignore

O instrutor lembra de adicionar `node_modules` ao `.gitignore` porque:
- A pasta e enorme e recriavel com `npm install`
- Nunca deve ir para o repositorio
- Cada ambiente (dev, CI, producao) instala suas proprias dependencias

## Fluxo completo de setup

1. `npm i knex@3.1.0 sqlite3@5.1.7` — instalar dependencias
2. Criar `knexfile.ts` na raiz — configurar client, connection, migrations, seeds
3. Criar pasta `src/database/` — organizar estrutura
4. Adicionar script `"knex"` no `package.json` — habilitar CLI com TypeScript
5. `npm run knex -- migrate:make create-product` — validar que tudo funciona
6. Verificar que a pasta `migrations/` foi criada com o arquivo — confirmacao visual