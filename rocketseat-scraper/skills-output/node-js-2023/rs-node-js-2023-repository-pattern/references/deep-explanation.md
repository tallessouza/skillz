# Deep Explanation: Repository Pattern

## Por que separar arquivos nao e suficiente

O instrutor (Diego) enfatiza um ponto crucial: **separar arquivos por separar nao torna o codigo mais manutenivel**. Precisa ter motivacao real. A motivacao do caso de uso foi reaproveitar logica entre funcionalidades. A motivacao do repository e diferente:

1. **Isolamento de ferramenta** — Se voce decide trocar o Prisma por TypeORM, Sequelize ou driver nativo, apenas os arquivos dentro de `repositories/` precisam mudar. Os casos de uso permanecem intactos.

2. **Porta de entrada unica** — Todas as operacoes do banco de dados sempre passam pelos repositorios. Isso significa que qualquer logica comum (logging, cache, validacao) pode ser adicionada em um unico ponto.

3. **Vantagens futuras (teased)** — Diego menciona explicitamente que "as melhores vantagens ainda nem foram faladas" — referindo-se a inversao de dependencia e testes com repositorios in-memory, que serao abordados nas proximas aulas.

## A motivacao por tras de cada decisao

### Por que classes e nao funcoes?
Diego escolhe classes deliberadamente: "eu poderia exportar varias funcoes, mas vou utilizar uma classe". A classe agrupa todos os metodos de uma entidade, facilitando instanciacao e, futuramente, injecao de dependencia (que e o proximo passo no SOLID).

### Por que prefixo do ORM no nome?
`prisma-users-repository.ts` e nao apenas `users-repository.ts` porque "mais pra frente a gente vai ter mais tipos de repositorios". Isso antecipa a existencia de implementacoes alternativas (ex: `in-memory-users-repository.ts` para testes).

### Por que usar tipos gerados pelo Prisma?
Diego mostra que o Prisma gera tipos especificos para cada operacao:
- `Prisma.UserCreateInput` — campos obrigatorios para criacao (id e createdAt opcionais, name/email/passwordHash obrigatorios)
- `Prisma.UserUpdateInput` — todos os campos opcionais (pode atualizar parcialmente)

Esses tipos "sao apenas tipos, nao tem funcionamento, sao so para trazer inteligencia para o nosso codigo". Usar eles evita recriar tipagens manualmente e garante que o autocomplete funcione perfeitamente.

## O que o Repository Pattern NAO e (neste momento)

Diego e honesto: "por enquanto separar essa parte ainda nao teve muita logica, porque a gente so colocou o codigo no outro arquivo". O valor real vem quando combinado com:
- Interfaces (inversao de dependencia)
- Repositorios in-memory (testes unitarios sem banco)
- Injecao de dependencia (desacoplamento total)

Esses topicos sao cobertos nas aulas seguintes do modulo SOLID.