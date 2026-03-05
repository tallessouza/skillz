# Deep Explanation: Criando Camada de Infraestrutura

## Por que separar em infra/?

O instrutor explica usando o diagrama de Clean Architecture (circulos concentricos). A camada azul (mais externa) contem tudo que e especifico de framework e tecnologia — coisas que voce nao consegue testar unitariamente de forma isolada. Isso inclui:

- **Controllers** — lidam com HTTP requests/responses (framework NestJS)
- **Pipes** — validacao de input (framework NestJS)
- **Prisma** — acesso ao banco de dados (biblioteca externa)
- **Auth** — autenticacao JWT (biblioteca externa)
- **Main/AppModule** — bootstrap do framework

A ideia central: **tudo que depende de algo externo (framework, banco, lib) vai para infra/**. Tudo que e regra de negocio pura (que pode ser testada sem framework) fica fora.

## Subdivisao por concern dentro de infra/

O instrutor faz uma observacao importante: dentro de infra/, nem tudo e igual.

- **Pipes e Controllers andam juntos** — pipes fazem validacao nos controllers, sao da mesma "familia" (HTTP)
- **Prisma nao tem relacao direta com controllers** — um e banco de dados, outro e camada HTTP

Por isso a subdivisao: `infra/http/` para controllers+pipes, e prisma fica separado em `infra/database/`.

## A decisao sobre Auth

O instrutor mostra um raciocinio pragmatico sobre onde colocar auth/:

> "A parte de autenticacao esta bem relacionada com HTTP. Mas eu posso usar autenticacao para outras partes da aplicacao que nao sejam HTTP. Entao por enquanto auth fica fora de http/, e se sentir necessidade, movo depois."

Isso demonstra o principio de **nao over-engineer a organizacao**: comece com uma separacao razoavel e refine conforme a necessidade real aparece.

## Organizacao de pastas != Arquitetura

Uma das falas mais importantes do instrutor:

> "A forma que voce vai organizar as pastas nao necessariamente determina se voce esta utilizando Clean Architecture. A forma de organizacao e a forma que voce e seu time se encontram melhor dentro do codigo. Nao vai determinar se voce esta fazendo algo muito certo ou muito errado."

Ou seja: Clean Architecture e sobre **separacao de concerns e direcao de dependencias**, nao sobre nomes de pastas.

## Modules no NestJS — por que criar HttpModule?

O instrutor explica que ter tudo em um unico AppModule funciona, mas nao escala. Ao criar HttpModule:

1. Controllers ficam declarados no module correto
2. Providers necessarios ficam explicitos
3. AppModule fica limpo, so importando sub-modules

### Armadilha dos providers nao-globais

O PrismaService nao e decorado com `@Global()`. Isso significa que cada module que injeta PrismaService em seus controllers DEVE declarar PrismaService em seu array de `providers`. Se nao declarar, NestJS lanca erro de dependencia nao encontrada.

A alternativa seria tornar o PrismaModule global com `@Global()`, mas o instrutor opta por nao fazer isso, mantendo as dependencias explicitas.

## Atualizacao do entryFile

Detalhe critico que pode passar despercebido: ao mover main.ts para infra/, o NestJS nao sabe mais onde encontrar o arquivo de entrada. A correcao e no `nest-cli.json`, campo `entryFile`, apontando para `infra/main`.