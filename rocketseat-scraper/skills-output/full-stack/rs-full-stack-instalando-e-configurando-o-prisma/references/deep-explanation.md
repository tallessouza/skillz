# Deep Explanation: Instalando e Configurando o Prisma

## Por que fixar a versão do Prisma?

O instrutor usa explicitamente `prisma@5.19.1` ao invés de apenas `prisma`. Isso não é por acaso — o Prisma faz releases frequentes e mudanças entre minor versions podem quebrar migrations existentes ou alterar o comportamento do client gerado. Fixar a versão garante que todos no time usam exatamente a mesma versão, evitando o clássico "funciona na minha máquina".

Em projetos reais, o `package-lock.json` ajuda, mas especificar a versão explicitamente no comando de instalação documenta a intenção.

## Por que instalar como dev dependency (-D)?

O Prisma CLI (`prisma`) é uma ferramenta de desenvolvimento — você usa para gerar migrations, introspectar o banco, rodar seeds. Em produção, o que roda é o `@prisma/client` (que é instalado separadamente como dependency regular). O CLI não precisa estar no bundle de produção.

## O flag --datasource-provider

Quando você roda `npx prisma init` sem provider, o Prisma assume SQLite por padrão. Passar `--datasource-provider postgresql` já configura:

1. O `schema.prisma` com `provider = "postgresql"`
2. O `.env` com o formato correto de connection string para PostgreSQL
3. O `.gitignore` atualizado com `.env`

Isso economiza ajustes manuais depois.

## Padrão .env-example

O instrutor enfatiza uma prática importante de segurança: **nunca commitar credenciais no repositório**. A abordagem é:

1. `.env` contém os valores reais → está no `.gitignore` → nunca vai pro GitHub
2. `.env-example` contém apenas as chaves sem valores (ou com valores genéricos) → commitado → serve como documentação

Isso resolve dois problemas:
- **Segurança:** credenciais não vazam no repositório
- **Onboarding:** novos desenvolvedores sabem quais variáveis precisam configurar

O instrutor menciona que você pode deixar o `.env-example` com valores genéricos ou completamente vazio — o importante é que sirva como referência das variáveis necessárias.

## Carregamento de variáveis de ambiente

O instrutor adiciona `--env-file .env` ao script de dev no `package.json`. Isso é necessário porque:

- Node.js por padrão **não** carrega arquivos `.env` automaticamente
- Antes do Node.js 20.6, era necessário usar pacotes como `dotenv`
- A flag `--env-file` é uma feature nativa do Node.js 20.6+ (e suportada pelo tsx)
- Garantir o carregamento no script evita que desenvolvedores esqueçam de configurar o dotenv no código

## Relação com Docker Compose

O instrutor referencia que o nome do banco (`rocketlog`) já foi definido no Docker Compose. Isso é uma boa prática — a `DATABASE_URL` no `.env` deve refletir exatamente o que está configurado no Docker Compose. Copiar o nome do banco diretamente da configuração Docker evita typos que causam erros de "database does not exist".

A connection string segue o formato:
```
postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

Para o ambiente de desenvolvimento local com Docker:
- Usuário e senha: definidos no `docker-compose.yml` (variáveis `POSTGRES_USER` e `POSTGRES_PASSWORD`)
- Host: `localhost` (porque o Docker mapeia a porta)
- Porta: a porta mapeada no Docker (geralmente 5432)
- Nome do banco: definido em `POSTGRES_DB`

## Limpeza pós-init

O instrutor remove todos os comentários gerados automaticamente pelo `prisma init` tanto no `.env` quanto no `schema.prisma`. Esses comentários são úteis na primeira vez, mas poluem os arquivos depois. Manter os arquivos limpos facilita a leitura e manutenção.