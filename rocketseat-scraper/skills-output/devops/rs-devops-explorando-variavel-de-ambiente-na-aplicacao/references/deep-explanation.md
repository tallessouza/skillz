# Deep Explanation: Variaveis de Ambiente na Aplicacao

## Por que variaveis de ambiente existem

O instrutor explica que praticamente toda aplicacao vai ter pelo menos alguma env var. Os casos de uso incluem:

- **Ambiente atual**: homologacao, staging, producao, teste
- **URLs de banco de dados**: cada ambiente tem seu proprio banco
- **Endpoints externos**: APIs que a aplicacao consome
- **Tokens e API keys**: credenciais que nao podem estar no codigo
- **Contexto de configuracao**: qualquer valor que muda entre ambientes

A razao fundamental e que **voce roda a aplicacao em pelo menos dois ambientes** — staging (para testes/homologacao) e producao (onde o cliente usa). Seguindo o twelve-factor app, esses ambientes devem ser separados para que homologacoes nao interfiram com o ambiente do usuario final.

## O problema de hardcodar valores

O instrutor enfatiza: "nao daria para colocar essa informacao no meio do codigo". As razoes sao:

1. **Valores diferentes por ambiente** — um endpoint de staging nao e o mesmo de producao
2. **Furo de seguranca** — tokens e senhas expostos no codigo-fonte
3. **Impossibilidade pratica** — voce teria que mudar o codigo a cada deploy

Mesmo a ideia de ter `.env.prod` e `.env.stage` commitados vira "uma bagunca e ainda traz um furo de seguranca".

## Como o .env funciona no NestJS

O fluxo que o instrutor demonstra:

1. Criar arquivo `.env` na raiz com estrutura chave-valor (`APP=RocketseatApp`)
2. Tentar acessar `process.env.APP` — retorna `undefined`
3. O `.env` e um **arquivo externo a aplicacao** — o NestJS nao o carrega automaticamente
4. Instalar `@nestjs/config` com `yarn add @nestjs/config`
5. Importar `ConfigModule.forRoot()` no `AppModule` — isso carrega o `.env` no bootstrap
6. Agora `process.env.APP` retorna o valor correto

O ponto-chave: o carregamento acontece **quando a aplicacao esta subindo** (bootstrap), nao em runtime arbitrario.

## A ponte para Kubernetes

O instrutor fecha a aula explicando a transicao:

- O `.env` **nao vai para o git** (gitignore) — boa pratica de seguranca
- O `.env` **nao vai para a imagem Docker** — ele nao existe no `docker build`
- Entao, como a aplicacao recebe essas variaveis em Kubernetes? Via **ConfigMap** e **Secret**
- Existem duas formas: montar um arquivo `.env` inteiro ou injetar valores individuais

Essa separacao entre "a aplicacao sabe ler variaveis de ambiente" e "o orquestrador injeta essas variaveis" e o conceito central da aula.

## Twelve-Factor App

O instrutor referencia o twelve-factor app ao explicar por que ter pelo menos dois ambientes:
- Um ambiente de teste/homologacao para validar mudancas
- Um ambiente produtivo para o usuario final
- Homologacoes nao devem concorrer com o ambiente do cliente