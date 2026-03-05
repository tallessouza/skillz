# Deep Explanation: Metadados do package.json

## Por que metadados importam

O package.json nao e apenas um arquivo para gerenciar pacotes e dependencias. Ele e o **cartao de identidade** do seu projeto. Quando alguem acessa seu repositorio no GitHub e abre o package.json, as primeiras informacoes que ve sao os metadados — e isso define a primeira impressao do projeto.

## O raciocinio do instrutor

O instrutor enfatiza que o package.json tem um papel duplo:

1. **Gerenciamento tecnico** — dependencias, scripts, configuracoes
2. **Documentacao do projeto** — nome, descricao, autoria

Essa dualidade e frequentemente ignorada por iniciantes que tratam o package.json como um arquivo puramente tecnico.

## Campos de metadados e seu proposito

### `name`
- Identifica unicamente o projeto
- Usado pelo npm como identificador de pacote (se publicado)
- No GitHub, aparece como referencia rapida do projeto
- Convencao: lowercase, hifens, sem espacos

### `description`
- Resumo em uma linha do proposito do projeto
- Aparece nos resultados de busca do npm
- Indexado pelo GitHub para busca de repositorios
- Deve ser claro e direto — "Aplicacao web de agendamento para corte de cabelo"

### `author`
- Identifica o criador/mantenedor
- Pode ser uma string simples (`"Rodrigo Goncalves"`) ou um objeto com name, email e url
- Da credibilidade e ponto de contato para o projeto

## Ordem dos campos

O instrutor posiciona os metadados **antes** da secao `scripts`. Isso segue a convencao de leitura natural:

1. **Identidade** (name, description, author) — "o que e isso?"
2. **Comportamento** (scripts) — "como eu uso?"
3. **Dependencias** (dependencies, devDependencies) — "do que precisa?"

Essa ordem nao e obrigatoria tecnicamente, mas e uma convencao amplamente adotada que facilita a leitura.

## Quando isso e especialmente util

- **Compartilhamento no GitHub** — outros desenvolvedores entendem o projeto rapidamente
- **Publicacao no npm** — name e description sao obrigatorios
- **Documentacao automatica** — ferramentas como `npm docs` usam esses campos
- **Onboarding de novos membros** — primeira coisa que um novo dev le

## Campos adicionais recomendados

Alem dos tres mencionados na aula, considere:
- `version` — versao semantica do projeto
- `license` — licenca open source (MIT, Apache, etc.)
- `repository` — link para o repositorio
- `keywords` — tags para busca no npm
- `homepage` — URL do site/docs do projeto