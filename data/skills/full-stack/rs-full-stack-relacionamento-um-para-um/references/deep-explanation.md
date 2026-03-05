# Deep Explanation: Relacionamento Um para Um

## Contexto da aula

O instrutor parte de um cenario com duas tabelas ja existentes e populadas (`courses` e `students`) e cria uma terceira tabela (`student_address`) para armazenar enderecos de correspondencia dos estudantes.

## A regra de negocio que define o tipo de relacionamento

O instrutor enfatiza a regra de negocio antes de escrever qualquer SQL:

> "Um aluno tem apenas um endereco cadastrado, e um endereco cadastrado esta vinculado a apenas um aluno."

Isso e um **relacionamento um para um (1:1)**. A leitura e bidirecional:
- Um aluno **possui** um endereco
- Um endereco **pertence a** um aluno

Essa leitura bidirecional e o teste para confirmar que e 1:1. Se em qualquer direcao a resposta fosse "varios", seria 1:N ou N:M.

## Chave primaria vs chave estrangeira — a distincao fundamental

O instrutor faz uma distincao crucial:

- **Chave primaria (PRIMARY KEY):** o `id` da tabela `student_address` — e gerado DENTRO desta tabela. E a identidade propria do registro.
- **Chave estrangeira (FOREIGN KEY):** o `student_id` — NAO e gerado nesta tabela. Vem da tabela `students`. A partir do momento que voce traz um id de outra tabela para dentro da sua, ele e uma chave estrangeira.

> "Esse id nao e gerado aqui dentro, esse id e gerado dentro da tabela de estudantes. A partir do momento que a gente coloca ele aqui dentro, ele e a chave estrangeira."

## O papel do UNIQUE no relacionamento 1:1

O `UNIQUE` no `student_id` e o que transforma um relacionamento 1:N em 1:1. Sem `UNIQUE`, varios enderecos poderiam referenciar o mesmo estudante (1:N). Com `UNIQUE`, cada `student_id` so pode aparecer uma vez na tabela de enderecos.

## O papel do NOT NULL

O instrutor adiciona `NOT NULL` no `student_id` para "garantir que essa coluna seja sempre informada". Isso impede a criacao de enderecos orfaos — enderecos que nao pertencem a nenhum estudante.

## A sintaxe do FOREIGN KEY + REFERENCES

O instrutor mostra que a declaracao FOREIGN KEY tem duas partes:

1. **FOREIGN KEY(coluna)** — diz QUAL coluna desta tabela e a chave estrangeira
2. **REFERENCES tabela(coluna)** — diz COM QUAL tabela e coluna ela se conecta

O instrutor cometeu um erro ao vivo tentando sem parenteses em `REFERENCES students(id)` e confirmou: **os parenteses sao obrigatorios**.

## Por que separar a FOREIGN KEY em linha propria

O instrutor menciona que poderia colocar tudo junto, mas prefere separar em linha propria por clareza visual. Isso nao afeta a execucao, mas melhora a legibilidade — especialmente quando ha multiplas foreign keys.

## Decisao de simplificar colunas

O instrutor escolheu apenas `street` e `city` para simplificar, mas mencionou que poderia adicionar pais, CEP, etc. Em producao, a tabela de endereco tipicamente inclui mais campos, mas o pattern de criacao e identico.