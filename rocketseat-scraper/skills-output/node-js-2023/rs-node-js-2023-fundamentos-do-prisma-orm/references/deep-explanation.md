# Deep Explanation: Fundamentos do Prisma ORM

## Os 3 niveis de acesso a banco de dados

O instrutor (Diego) apresenta uma hierarquia clara de abstracoes para acesso a banco de dados em Node.js:

### Nivel 1: Driver nativo (baixo nivel)
Exemplo: `node-postgres` (pg). Voce escreve SQL puro, faz a conexao manualmente, passa variaveis. Pouca abstracao, documentacao simples porque e "so fazer queries". Util quando voce precisa de controle total.

### Nivel 2: Query Builder (medio nivel)
Exemplo: Knex.js. Converte sintaxe JavaScript para SQL. Problema: nao tem controle total sobre se as tabelas realmente existem no banco. Com TypeScript, voce precisa informar manualmente quais sao as tabelas, campos, tipos, obrigatoriedade — duplicando informacao que ja existe no banco.

### Nivel 3: ORM (alto nivel)
Exemplo: Prisma, TypeORM, Sequelize. Alto nivel de abstracao com ferramental completo. O conceito ORM = Object Relational Mapping: mapear tabelas, campos e relacionamentos do banco em objetos/classes no codigo.

## Por que Prisma e superior aos outros ORMs

Diego destaca dois diferenciais criticos:

### 1. Inferencia automatica de tipagem
Outros ORMs (Sequelize, TypeORM) exigem que voce declare a estrutura das tabelas no codigo:
- **Sequelize**: usa `sequelize.define()` com tipos proprios (`DataTypes.STRING`)
- **TypeORM**: usa decorators (`@Entity()`, `@Column()`) em classes

O Prisma, ao contrario, gera tipagem automaticamente a partir do schema. Quando voce roda `prisma generate`, ele cria em `node_modules/.prisma/client/index.d.ts` todos os tipos, incluindo:
- O tipo `User` com os campos corretos
- Metodos como `findUnique`, `create`, `update`, `delete`, `deleteMany`, `updateMany`
- Documentacao inline dentro dos tipos gerados

### 2. Migrations automatizadas
Migrations = controle de versao do banco de dados. Quando multiplos devs trabalham no mesmo projeto mexendo na estrutura do banco, migrations sincronizam todos na mesma "linha do tempo".

Com Prisma: voce altera o `schema.prisma` e o Prisma determina automaticamente quais migrations criar. Voce NAO precisa escrever arquivos de migration manualmente.

## UUID vs Auto-increment

Diego explica a motivacao pragmatica:
- **Auto-increment** (`1, 2, 3...`): facil de adivinhar. Se uma rota expoe `/users/1`, alguem pode tentar `/users/2` e acessar outro usuario.
- **UUID**: universalmente unico, impossivel de adivinhar. Ideal para IDs publicamente expostos.
- **Quando usar auto-increment**: IDs que NAO sao acessiveis pelo frontend/usuario final, porque ocupam menos espaco no banco.

## Anatomia do schema.prisma

- `model` = representacao generica (nao "tabela") porque Prisma suporta bancos que chamam de forma diferente (MongoDB = "collection", etc.)
- `@@` (dois arrobas) = configuracao do model inteiro
- `@` (um arroba) = configuracao de um campo especifico
- Prisma valida em tempo real: se voce escreve `string` (minusculo), ja da erro imediatamente

## Arquitetura de instalacao

Dois pacotes separados com propositos distintos:
- `prisma` (devDependency): CLI para operacoes como `prisma init`, `prisma generate`, `prisma migrate`. Instala um executavel em `node_modules/.bin/prisma`, executado via `npx`.
- `@prisma/client` (producao): o client real que faz acesso ao banco de dados em runtime.

## Configuracao do VS Code

Diego recomenda adicionar no `settings.json`:
```json
{
  "[prisma]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```
A extensao do Prisma inclui um formatter que padroniza o schema, similar ao que ESLint faz com codigo.