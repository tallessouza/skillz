# Deep Explanation: Relacionamento Um para Muitos

## A diferença fundamental entre 1:1 e 1:N

O instrutor destaca um ponto crítico que diferencia os dois tipos de relacionamento: **a presença ou ausência do UNIQUE na chave estrangeira**.

- **1:1 (um para um):** A FK tem constraint UNIQUE — cada valor de FK aparece no máximo uma vez na tabela filha. Exemplo: um usuário tem exatamente um perfil.
- **1:N (um para muitos):** A FK **não** tem UNIQUE — o mesmo valor de FK pode aparecer múltiplas vezes. Exemplo: um curso tem muitos módulos.

A única diferença estrutural entre os dois relacionamentos é essa constraint. O resto (FOREIGN KEY, REFERENCES, tipo idêntico) é igual.

## Por que a FK fica no lado "muitos"

Pense assim: cada módulo precisa saber a qual curso pertence. Um módulo pertence a exatamente um curso. Então o módulo carrega a informação "eu pertenço ao curso X" via `course_id`.

Se tentássemos colocar a referência no lado do curso (o "um"), precisaríamos de múltiplas colunas (`module_id_1`, `module_id_2`, ...) ou uma coluna com lista — ambas violam normalização.

## Analogia do instrutor: a jornada de estudos

O instrutor usa a própria plataforma como exemplo: o aluno está dentro de um curso que tem vários módulos. A jornada de estudos é o curso (1), e cada módulo é uma etapa (N). Isso torna o conceito tangível — o aluno literalmente está vivendo um relacionamento 1:N enquanto assiste à aula.

## Regra do tipo idêntico

O instrutor enfatiza: **a coluna FK deve ter o mesmo tipo da PK que referencia**. Se `courses.id` é INTEGER, então `course_modules.course_id` também deve ser INTEGER. Tipos diferentes causam erro na criação da FOREIGN KEY ou comportamento inesperado dependendo do banco.

## NOT NULL como decisão de domínio

O instrutor coloca `course_id NOT NULL` porque um módulo sem curso não faz sentido no domínio. Mas existem casos onde FK nullable é válida — por exemplo, uma task que pode ou não pertencer a um projeto. A decisão de NOT NULL vem do domínio, não da técnica.

## Estrutura completa criada na aula

```sql
CREATE TABLE course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

Pontos-chave que o instrutor destaca:
1. `id` com PRIMARY KEY AUTOINCREMENT — chave primária auto-gerada
2. `name` com NOT NULL — todo módulo precisa de nome
3. `course_id` com NOT NULL mas **sem UNIQUE** — é o que faz ser 1:N
4. FOREIGN KEY declarada explicitamente com REFERENCES