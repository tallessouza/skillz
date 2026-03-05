# Deep Explanation: Restricoes de Chave Unica e Estrangeira

## Por que o banco relacional impoe restricoes

O instrutor destaca uma ideia central: **o banco de dados relacional te ajuda a manter coerencia e consistencia dos dados**. Isso nao e apenas uma feature — e a razao de ser dos bancos relacionais.

Sem foreign keys, voce poderia cadastrar um endereco para o estudante 15 quando so existem 10 estudantes. O registro existiria no banco, mas seria um **dado orfao** — nao aponta para nada real. Isso corrompe silenciosamente a base de dados.

## A mecanica da Foreign Key

Quando voce define `student_id REFERENCES students(id)`:

1. O banco cria um **indice** na coluna referenciada (se nao existir)
2. Em cada INSERT/UPDATE na tabela filha, o banco **verifica** se o valor existe na tabela pai
3. Se nao existir, o banco **rejeita** a operacao com erro de constraint

O instrutor demonstra isso na pratica:
- Tentou inserir `student_id = 15` → erro de FK (estudante nao existe)
- Inseriu `student_id = 1` → sucesso (estudante existe)

### Mensagem de erro

O instrutor observa que "a mensagem nao ajuda muito" — e um ponto pratico importante. Erros de constraint em bancos SQL muitas vezes sao tecnicos e pouco descritivos. Com experiencia, voce aprende a:
1. Identificar o tipo de constraint (FK, UNIQUE, CHECK, NOT NULL)
2. Ler qual tabela/coluna causou o erro
3. Deduzir a causa raiz (registro pai inexistente, valor duplicado, etc.)

## A mecanica da UNIQUE constraint

Quando voce define `student_id UNIQUE`:

1. O banco cria um **indice unico** na coluna
2. Em cada INSERT/UPDATE, verifica se o valor ja existe
3. Se existir, rejeita com erro de unique constraint

Combinando FK + UNIQUE na mesma coluna, voce obtem um **relacionamento 1:1**:
- FK garante que o pai existe
- UNIQUE garante que cada pai tem no maximo um filho

O instrutor demonstra:
- Inseriu endereco para estudante 1 → sucesso
- Tentou inserir OUTRO endereco para estudante 1 → erro de UNIQUE
- Inseriu endereco para estudante 2 → sucesso (2 nao tinha endereco)

## Diferenca entre 1:1 e 1:N

A unica diferenca estrutural e a presenca do UNIQUE:
- **Com UNIQUE:** cada student_id aparece no maximo uma vez → 1:1
- **Sem UNIQUE:** cada student_id pode aparecer varias vezes → 1:N

## Consistencia vs. Flexibilidade

O instrutor enfatiza que o banco relacional e "bem estruturado" e cria restricoes para "deixar os dados consistentes". Isso e um trade-off consciente:
- **Mais consistencia** = menos flexibilidade (nao pode inserir dados "provisorios")
- **Menos consistencia** = mais flexibilidade, mas mais risco de corrupcao

Bancos relacionais escolhem consistencia. Por isso existem constraints.

## Edge cases importantes

1. **DELETE em cascata:** se voce deleta o estudante 1, o que acontece com o endereco? Depende de ON DELETE (CASCADE, SET NULL, RESTRICT)
2. **UPDATE na PK:** se o id do estudante muda, a FK pode quebrar (por isso PKs geralmente sao imutaveis)
3. **NULL em FK:** se student_id permite NULL, voce pode ter endereco sem estudante (orfao intencional)
4. **Ordem de insercao:** sempre insira o pai antes do filho