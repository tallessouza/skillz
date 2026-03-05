# Deep Explanation: Inserindo Modulos em Tabelas Relacionadas

## Por que testar o constraint de FK propositalmente?

O instrutor demonstra um padrao pedagogico importante: antes de inserir dados reais, ele **provoca o erro de FK de proposito**. Isso nao e apenas para ensinar — e uma pratica util em desenvolvimento real.

Quando voce cria uma tabela com `FOREIGN KEY (course_id) REFERENCES courses(id)`, precisa ter certeza de que o constraint esta ativo. Em ambientes de migracao, e possivel que constraints sejam desabilitados temporariamente. Inserir um ID inexistente (ex: 105) e ver o erro `foreign key constraint violation` confirma que:

1. A FK foi criada corretamente
2. O constraint esta ativo
3. O relacionamento entre as tabelas funciona

## Relacionamento 1:N na pratica

O instrutor demonstra concretamente o conceito "um para muitos":

- **Curso CSS (id=2)** tem 3 modulos: Fundamentos do CSS, Layout com CSS, CSS Functions
- **Curso HTML (id=1)** tem 2 modulos: Fundamentos do HTML, Formularios

Ou seja: **um** curso pode ter **varios** modulos, mas cada modulo pertence a **um** unico curso. Isso e o `1:N` — a chave estrangeira (`course_id`) fica na tabela do lado "muitos" (`courses_modules`).

## INSERT multi-row vs INSERT individual

O instrutor mostra que voce pode inserir multiplos registros de uma vez separando por virgula:

```sql
INSERT INTO courses_modules (name, course_id)
VALUES
  ('Fundamentos do CSS', 2),
  ('Layout com CSS', 2),
  ('CSS Functions', 2);
```

Resultado: "3 linhas afetadas" em uma unica execucao.

Vantagens:
- Menos round-trips ao banco
- Atomicidade: todos inserem ou nenhum insere (em caso de erro)
- Script mais limpo e legivel

## Cuidado com virgula vs ponto e virgula

O instrutor destaca um detalhe sutil: se voce coloca virgula apos o ultimo valor, o banco **espera mais registros**. O ponto e virgula finaliza o statement. Se for executar apenas aquele trecho, pode omitir o `;`, mas por boas praticas, sempre finalize com `;`.

## Fluxo pratico recomendado pelo instrutor

1. Abrir uma nova query (manter a estrutura da tabela visivel em outra aba)
2. Verificar dados existentes com SELECT
3. Testar FK com ID invalido
4. Inserir dados corretos
5. Verificar resultado com SELECT