# Deep Explanation: Configurando Banco de Testes

## Por que separar o banco de dados?

O Diego demonstra o problema abrindo o banco SQLite e mostrando dezenas de registros "New Transaction" acumulados. Cada execucao dos testes criava novas transacoes no mesmo banco de desenvolvimento. Funcionava porque o Session ID nos cookies isolava as queries, mas isso e uma coincidencia da implementacao — nao uma garantia.

### O problema real: falso negativo

O cenario critico que o Diego descreve: imagine um campo com constraint UNIQUE. Na primeira execucao do teste, funciona. Na segunda, falha porque o valor ja existe no banco. O teste esta correto, mas o ambiente esta sujo.

Outro cenario: sem o cookie de sessao, listar transacoes retornaria tanto as do teste atual quanto as de testes anteriores. O teste esperaria 1 transacao, receberia 2, e voce ficaria horas debugando um "bug" que nao existe.

### A analogia do Diego sobre E2E

"Teste end-to-end e que nem amigo — e poucos e bons." Voce deve ter poucos testes E2E comparado com unitarios, mas cada um deve ser efetivo, testando a funcionalidade de ponta a ponta. Eles sao naturalmente lentos porque resetam banco, fazem requisicoes HTTP reais, etc.

## Por que NODE_ENV funciona automaticamente?

Ferramentas de teste como Vitest e Jest automaticamente setam `process.env.NODE_ENV = 'test'` antes de executar qualquer codigo. Por isso nao e necessario (e nem recomendado) setar essa variavel manualmente no `.env.test`.

O Diego demonstrou isso com um `console.log(process.env)` — antes de chamar `config()` do dotenv, `NODE_ENV` ja estava como `undefined` em dev, mas seria `test` quando executado pelo Vitest.

## Por que beforeEach e nao beforeAll?

O Diego explica a decisao em dois passos:

1. **Primeiro, ele usa beforeAll** — roda migrations uma vez, todos os testes passam. Funciona, mas...
2. **Depois muda para beforeEach com rollback** — porque entre testes, dados criados por um teste podem interferir em outro.

No caso especifico da aplicacao dele, o cookie de sessao mascara o problema. Mas em aplicacoes normais (sem esse cookie), o teste de listagem retornaria transacoes criadas por outros testes.

A sequencia no beforeEach:
1. `migrate:rollback --all` — executa o metodo `down` de TODAS as migrations (apaga tabelas)
2. `migrate:latest` — recria todas as tabelas limpas

Isso garante que cada teste comeca com banco zerado, independente do que outros testes fizeram.

## O erro "table does not exist"

Quando o Diego criou o banco separado (`test.db`), os testes falharam com status 500. O body da resposta mostrava: "table transactions does not exist". O banco foi criado (arquivo `test.db` apareceu), mas as tabelas nao — porque migrations nunca rodaram nesse banco novo.

Isso e um erro comum que acontece toda vez que voce aponta para um banco novo sem rodar migrations.

## Estrutura de arquivos de ambiente

```
.env                  # Desenvolvimento (DATABASE_URL=./db/app.db)
.env.test             # Testes (DATABASE_URL=./db/test.db)
.env.test.example     # Exemplo para o repositorio
.gitignore            # Inclui .env e .env.test
```