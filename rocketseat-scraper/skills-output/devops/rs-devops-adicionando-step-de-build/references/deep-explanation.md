# Deep Explanation: Adicionando Step de Build

## Por que `run` ao inves de `uses`?

O GitHub Actions oferece dois mecanismos para executar comandos em um step:

- **`uses`**: referencia uma action publicada (ex: `actions/checkout@v4`). A action encapsula logica complexa e reutilizavel.
- **`run`**: executa comandos diretamente na maquina do runner, como se voce estivesse no terminal.

O instrutor destaca que para o `docker build`, nao precisamos de uma action — basta rodar o comando diretamente. O runner Ubuntu do GitHub Actions ja vem com Docker pre-instalado, entao `run: docker build ...` funciona sem configuracao adicional.

Isso simplifica o pipeline e reduz dependencias externas.

## Por que nunca usar `latest` como tag?

O instrutor enfatiza que `latest` nao e uma boa pratica. As razoes:

1. **Nao ha rastreabilidade** — voce nao sabe qual commit gerou aquela imagem
2. **Sobrescrita silenciosa** — cada build substitui a anterior sem historico
3. **Impossivel fazer rollback preciso** — nao da pra saber qual versao do codigo esta na imagem

A boa pratica e associar a tag ao commit SHA. Assim, cada imagem no Container Registry reflete exatamente um commit, e voce consegue entender o versionamento.

## A mecanica do GITHUB_SHA e os 7 primeiros caracteres

O `GITHUB_SHA` e uma variavel de ambiente disponibilizada automaticamente pelo GitHub Actions em tempo de execucao. Ela contem o hash completo do commit que disparou o workflow.

Porem, a hash completa e muito longa (40 caracteres). A convencao do Git e usar os 7 primeiros caracteres como identificador curto — e o que o GitHub mostra na interface (aquela referencia curta nos commits).

O instrutor mostra o processo:
1. Captura `GITHUB_SHA`
2. Aplica `head -c7` para pegar apenas os 7 primeiros chars
3. Atribui a uma variavel local
4. Exporta via `GITHUB_OUTPUT`

## Por que GITHUB_OUTPUT e nao variavel shell?

Variaveis shell (`export VAR=value`) so existem dentro do mesmo step. Cada step roda em um contexto separado. Para passar valores entre steps, o GitHub Actions oferece o `GITHUB_OUTPUT`.

O fluxo:
1. No step produtor: `echo "nome=valor" >> $GITHUB_OUTPUT`
2. No step consumidor: `${{ steps.<id>.outputs.nome }}`

O instrutor destaca que voce *poderia* acessar a variavel de outras formas, mas a boa pratica e centralizar no GITHUB_OUTPUT porque:
- Fica explicito o que cada step produz
- Facilita manutencao
- E o padrao documentado do GitHub Actions

## A importancia do `id` em steps

O `id` de um step e o que permite referencia-lo em outros steps. Sem `id`, nao ha como acessar seus outputs. O instrutor recomenda usar IDs em lowercase com underscore (ex: `generate_tag`).

A sintaxe de referencia e: `steps.<step_id>.outputs.<variable_name>`, similar a como se referencia variaveis de matrix strategy (`matrix.<var>`).

## Sobre o path do Dockerfile

O `.` no final do `docker build` indica o diretorio onde esta o Dockerfile. Como o checkout do repositorio coloca os arquivos na raiz do workspace, e o Dockerfile esta na raiz do projeto, `.` funciona. Se o Dockerfile estivesse em outro diretorio, bastaria trocar o `.` pelo path correto.

## Pipe (`|`) para multiplas instrucoes

Quando um `run` precisa executar varias linhas de comando, usa-se o pipe YAML (`|`). Cada linha apos o pipe e tratada como uma instrucao separada no shell.