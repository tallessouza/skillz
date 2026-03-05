# Deep Explanation: Criando Novo Banco de Dados SQLite

## Por que um arquivo vazio?

SQLite e um banco de dados baseado em arquivo. Diferente de PostgreSQL ou MySQL que rodam como servicos, o SQLite opera diretamente sobre um arquivo no filesystem. Criar o arquivo `.db` vazio e o equivalente a "provisionar o servidor" — voce esta reservando o espaco onde o banco vai viver.

Quando voce cria o arquivo vazio com `touch`, ele tem 0 bytes. O SQLite reconhece isso como um banco valido sem tabelas. Na primeira operacao de escrita (CREATE TABLE, por exemplo), o SQLite escreve os headers e metadados automaticamente.

## Organizacao de arquivos de banco

O instrutor mantem os arquivos `.db` na mesma pasta do projeto. Isso e uma pratica comum em desenvolvimento local porque:

1. **Portabilidade** — o banco viaja com o projeto
2. **Simplicidade** — nao precisa configurar caminhos externos
3. **Isolamento** — cada projeto tem seu proprio banco

Para projetos maiores, considere adicionar `*.db` ao `.gitignore` para nao versionar dados.

## Por que salvar a conexao no Beekeeper?

O Beekeeper Studio permite salvar conexoes nomeadas. O instrutor enfatiza esse passo porque:

- Evita reconfigurar o caminho do arquivo toda vez
- Permite alternar rapidamente entre bancos diferentes (ex: um banco de testes e um de desenvolvimento)
- O nome descritivo (`school`) facilita identificar o proposito do banco

## Nomeacao do arquivo

O instrutor escolheu `school.db` porque o banco vai simular uma escola. A convencao e:

- Nome descritivo do dominio (nao generico como `database.db` ou `data.db`)
- Letras minusculas
- Sem espacos (use hifens se necessario: `meu-projeto.db`)
- Extensao `.db` (tambem aceito: `.sqlite`, `.sqlite3`)

## Contexto: relacionamentos

O instrutor cria este banco especificamente para explorar relacionamentos entre tabelas (1:1, 1:N, N:N). Separar em um novo banco ao inves de reusar o anterior e uma boa pratica pedagogica — comeca limpo, sem bagagem de exercicios anteriores.