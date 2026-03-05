# Deep Explanation: Populando Tabelas com INSERT INTO

## Por que ponto e vírgula é obrigatório entre múltiplos INSERTs

No SQLite, quando você escreve múltiplos statements SQL em sequência (como vários INSERT INTO), o ponto e vírgula é o **delimitador** que separa um statement do outro. Sem ele, o parser não sabe onde termina um INSERT e começa o próximo.

O instrutor reforça: "a gente tem como obrigatório usar aqui no SQLite quando a gente vai inserir vários de uma vez". Já para um statement único (como um SELECT sozinho), o ponto e vírgula é opcional — mas é boa prática sempre usar para criar o hábito.

## Padrão de verificação: INSERT → SELECT

O workflow ensinado é:
1. Escrever todos os INSERTs
2. Executar
3. Verificar a contagem (ex: "10/10 — dos 10 registros os 10 foram inseridos")
4. Rodar `SELECT * FROM tabela` para confirmar visualmente

Essa verificação é especialmente importante quando se popula uma tabela pela primeira vez com dados de seed/exemplo. O feedback "N/N" do SQLite confirma quantos registros foram processados com sucesso.

## Executando parcialmente no editor

O instrutor demonstra uma técnica útil: **selecionar apenas uma linha** para executar. Isso evita re-executar os INSERTs quando você quer apenas rodar o SELECT de verificação. Sem essa seleção, todos os INSERTs seriam executados novamente, duplicando os dados.

## Consistência de dados

O instrutor faz uma escolha consciente: "vou deixar tudo em minúsculo mesmo, só a primeira maiúscula". Essa decisão de padronização no momento da inserção evita problemas futuros com filtros case-sensitive, ordenação e comparações.

Exemplo da aula: `Git` e `GitHub` separados, não `git e github` junto — decisão de modelagem que afeta consultas futuras.

## Aspas em SQL

O padrão SQL usa aspas simples para strings literais. Aspas duplas em SQL padrão são para identificadores (nomes de tabelas/colunas). Embora SQLite aceite ambas em muitos contextos, usar aspas simples para valores é o correto e portável.