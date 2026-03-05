# Deep Explanation: GitHub Actions Triggers

## Por que o `on` e obrigatorio

O instrutor enfatiza que o `on` e "basilar" — a base de tudo. Sem ele, voce pode ter o YAML completo com jobs, steps, actions, mas nada executa. O GitHub Actions precisa dessa orientacao para saber QUANDO disparar o workflow.

## Mecanica por baixo dos panos: Webhooks

O trigger funciona como um webhook. Quando voce faz `git push`, o GitHub dispara um evento. O GitHub Actions esta "escutando" esse evento. Ele entao:

1. Verifica em qual branch o push aconteceu
2. Compara com a configuracao de `branches` no workflow
3. Se houver equivalencia (`true`), executa o workflow
4. Se nao, ignora

## Setup Job — o que acontece antes dos seus steps

Quando o job comeca, antes dos seus steps rodarem, existe um "setup job" automatico que:

1. Sobe a maquina virtual (ex: Ubuntu 22.04 quando voce declara `ubuntu-latest`)
2. Provisiona a maquina corretamente
3. Configura o GitHub Token com escopo de permissoes do repositorio
4. Le o arquivo YAML e identifica quais actions precisa baixar
5. Baixa o codigo das actions para executar

Esse setup e praticamente instantaneo para jobs simples (~1 segundo).

## Checkout e o trigger

O checkout respeita o trigger. Se o trigger foi na `main`, o checkout faz `git checkout main`. Isso e visivel nos logs onde aparece algo como "baixou a origin main".

## Matrix Strategy — seguranca em multiplas versoes

A matrix cria jobs independentes para cada versao. Se voce define `[16, 18, 20]`, o GitHub Actions cria 3 jobs paralelos. Cada um roda com sua versao do Node. Isso permite:

- Identificar se alguma versao esta quebrada
- Tomar acoes especificas se uma versao falhar
- Garantir compatibilidade antes de fazer deploy

O instrutor destaca: "isso traz uma seguranca imensa."

## Quando NAO usar matrix

Para build de imagem Docker, matrix nao faz sentido porque a versao do Node esta definida dentro do Dockerfile. Matrix e para validacao integrativa (CI), nao para geracao de artefatos (CD).

## Extensibilidade do CI

O instrutor menciona que alem de testes, voce pode plugar no CI:

- **SonarQube/SonarCloud** — analise de qualidade de codigo e cobertura
- **Plugins de seguranca** — checagem de libs, imagens, vulnerabilidades
- **Code analysis tools** — qualquer ferramenta que gere alertas

A ideia e que o CI pode ter camadas progressivas de validacao.

## Actions do Marketplace

As actions usadas na aula sao todas oficiais do GitHub:
- `actions/checkout@v4` — synca o repositorio
- `actions/setup-node@v4` — configura Node.js no ambiente

O instrutor nota que existem actions de terceiros, mas as do GitHub atendem para a maioria dos casos iniciais.

## Variavel `matrix.<key>` — sintaxe do GitHub Actions

A forma `${{ matrix.node-version }}` e a sintaxe padrao para acessar variaveis no GitHub Actions. Como a matrix e um array, o GitHub Actions itera automaticamente, criando um job por valor.