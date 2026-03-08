# Deep Explanation: Rodando da API

## Por que separar em pastas `api/` e `web/`?

O instrutor organiza o projeto com duas pastas irmas (`api/` e `web/`) dentro de uma pasta raiz do projeto. Essa estrutura e um **monorepo informal** — nao usa ferramentas como Turborepo ou Nx, mas mantem backend e frontend co-localizados para facilitar o desenvolvimento local.

Vantagens dessa abordagem:
- Um unico `cd` para acessar qualquer parte do projeto
- Facil de abrir no VS Code com uma unica janela
- Simula o ambiente de producao onde API e frontend sao servicos separados
- Permite rodar ambos simultaneamente em terminais diferentes

## O fluxo de setup de um projeto Node.js existente

Quando voce baixa um projeto Node.js de um repositorio:

1. **O ZIP nao inclui `node_modules/`** — essa pasta e listada no `.gitignore` e nunca e versionada
2. **`npm i` reconstroi tudo** — le o `package.json` (e `package-lock.json` se existir) e instala todas as dependencias
3. **`npm run dev`** executa o script `dev` definido no `package.json` — geralmente inicia o servidor com hot-reload

## Prisma Studio como ferramenta de inspecao

O Prisma Studio e uma interface web gerada automaticamente a partir do schema Prisma (`prisma/schema.prisma`). Ele permite:

- Visualizar todas as tabelas definidas no schema
- Criar, editar e deletar registros manualmente
- Inspecionar relacionamentos entre tabelas

O instrutor usa o Prisma Studio para **limpar dados de teste** antes de comecar o desenvolvimento. Isso garante um estado limpo e previsivel.

## Ordem de delecao importa (Foreign Keys)

O instrutor demonstra um ponto critico: ao tentar deletar usuarios, ele percebe que precisa **primeiro deletar os refunds** (que referenciam usuarios via foreign key). Essa e uma restricao do banco de dados relacional:

- Tabelas dependentes (com foreign keys apontando para outra tabela) devem ter seus registros removidos primeiro
- So depois a tabela referenciada pode ter seus registros deletados
- O Prisma Studio mostra um erro se voce tentar violar essa restricao

Esse conceito e fundamental para qualquer operacao de limpeza ou migracao de dados.

## Multiplos terminais simultaneos

O instrutor configura tres processos rodando ao mesmo tempo:

1. **Servidor da API** (`npm run dev`) — precisa estar ativo para o frontend fazer requisicoes
2. **Prisma Studio** (`npx prisma studio`) — ferramenta de inspecao, opcional mas util durante desenvolvimento
3. **Terminal livre** — para executar comandos avulsos, rodar o frontend, etc.

Essa pratica de manter multiplos terminais e comum em desenvolvimento full-stack, onde backend e frontend rodam como processos independentes.

## Dica do instrutor: arrastar pasta para o terminal

O instrutor demonstra que em vez de digitar o caminho completo para `cd`, voce pode **arrastar a pasta do explorador de arquivos e soltar no terminal**. O sistema operacional automaticamente insere o caminho absoluto da pasta. Isso funciona em:

- Windows (CMD, PowerShell, Windows Terminal)
- macOS (Terminal, iTerm2)
- Linux (maioria dos emuladores de terminal)