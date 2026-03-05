# Deep Explanation: Criando Tabelas SQL (SQLite)

## Por que AUTOINCREMENT e não apenas PRIMARY KEY?

Quando você define `id INTEGER PRIMARY KEY` sem AUTOINCREMENT, o SQLite reutiliza IDs deletados. Com AUTOINCREMENT, o SQLite garante que o próximo ID é sempre maior que qualquer ID já usado, mesmo que registros tenham sido deletados.

O SQLite mantém uma tabela interna chamada `sqlite_sequence` que guarda o nome da tabela e o último ID gerado. É isso que o instrutor mostra quando expande as tabelas e vê a "tabela de sequência" — ela armazena `(nome_da_tabela, último_id)`.

## O erro de digitação como lição

O instrutor cometeu um erro ao digitar `AUTOINCRMENT` (faltando o 'E'). O editor de SQL não reconheceu a palavra e não mudou a cor do syntax highlighting. Quando corrigiu para `AUTOINCREMENT`, a cor mudou — indicando que o editor reconheceu a palavra reservada.

**Insight prático:** Use o syntax highlighting como validação visual. Se uma palavra reservada não está colorida diferente, provavelmente está escrita errado.

## NOT NULL como proteção de dados

O campo `name` recebeu `NOT NULL` porque não faz sentido ter um aluno sem nome no sistema. Essa é a decisão fundamental: **campos que representam dados essenciais da entidade devem ser NOT NULL**.

Campos opcionais (como uma foto de perfil ou uma bio) podem aceitar NULL porque a ausência desse dado não invalida o registro.

## Estrutura da tabela students

A tabela criada na aula tem exatamente duas colunas:
- `id` — identificador único, gerado automaticamente
- `name` — nome do aluno, obrigatório

Essa é uma tabela simples que serve como ponto de partida. Em aulas seguintes, relacionamentos com outras tabelas serão criados.

## Sobre o ponto e vírgula

O instrutor menciona que "você pode colocar o ponto e vírgula se quiser" — isso porque em ferramentas visuais (como o DB Browser for SQLite ou o Beekeeper Studio), cada statement é executado individualmente. Em scripts `.sql` com múltiplos statements, o ponto e vírgula é obrigatório para separar os comandos.

**Recomendação:** Sempre use ponto e vírgula, mesmo em ferramentas visuais, para criar o hábito correto.