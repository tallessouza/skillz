# Deep Explanation: SaaS Multi-Tenant & RBAC

## Por que multi-tenant nao e multi-subdominio

O instrutor (Diego) destaca que essa e uma concepcao antiga. Antigamente, a unica forma de identificar qual empresa estava acessando era pelo dominio. Hoje, basta ter um usuario cadastrado com uma associacao a empresa no banco (company_id, organization_id, ou membership table).

**Quando subdominio faz sentido:** Apenas quando a empresa precisa de paginas publicas. Exemplo: plataforma de membros onde alunos acessam cursos — cada empresa precisa de uma URL publica distinta. Shopify, Notion fazem isso porque o usuario final (cliente da empresa) precisa de um endereco para acessar.

**Quando NAO faz sentido:** Se o SaaS e um dashboard interno (tipo Stripe), nao ha razao para subdominios. O proprio Stripe e multi-tenant sem subdominio por empresa — o usuario loga e pode alternar entre empresas.

Diego enfatiza: "colocar um dominio por empresa so vai te trazer dor de cabeca. Isso aqui e um trabalhao desnecessario."

## Por que nao um banco por empresa

Outra concepcao erronea comum. A maioria dos SaaS multi-tenant usa o mesmo banco com foreign keys. Diego estima que 98% dos casos nao precisam de banco separado.

**Excecoes legitimas:**
- Aplicacoes para governo (exigencia legal)
- Contratos LGPD com empresas grandes (ex: vender para Itau)
- Self-host ou contratos individuais que exigem isolamento de dados

Fora dessas excecoes, a separacao e feita por foreign key (`organizationId`) em cada tabela que contem dados da empresa.

## A sacada sobre roles no codigo vs banco

Este e o insight central da aula. Diego propoe uma pergunta-chave: **"O usuario deveria poder criar novas roles?"**

Em 90% dos sistemas, a resposta e NAO. Se o usuario nao pode criar roles nem permissoes, por que essas tabelas existem no banco? O banco so deve armazenar dados mutaveis pelo usuario.

**Exemplo real:** O Stripe, mesmo sendo um SaaS enorme com ~15 produtos, tem ~15 roles pre-definidas. Nao permite que a empresa crie roles customizadas. Permite que o usuario tenha mais de uma role, mas as roles sao fixas.

**Beneficios de manter no codigo:**
- Banco de dados mais simples (menos tabelas, menos queries)
- Permissoes auditaveis via git (commit history)
- Mudanca de permissoes = commit + deploy
- Sem necessidade de migrations para ajustar permissoes
- Performance (zero queries para verificar permissoes)

**Quando mover para o banco:** Apenas quando o sistema tem centenas de permissoes diferentes e o usuario precisa de controle extremamente granular (ex: AWS IAM com 300+ servicos). Para "sistemas comuns, mesmo que SaaS", roles fixas sao suficientes.

## RBAC vs ABAC — complementares, nao excludentes

Diego deixa claro que as duas estrategias coexistem:

- **RBAC** responde: "este cargo pode fazer esta acao?" (alto nivel)
  - Ex: membro pode criar projeto, membro pode listar projetos
- **ABAC** responde: "este usuario pode fazer esta acao NESTE recurso especifico?" (granular)
  - Ex: membro pode editar projeto que ele criou, membro pode editar projeto do time dele

O ABAC usa atributos da entidade (ownerId, teamId, status) para determinar a permissao, nao apenas o cargo.

## A biblioteca CASL (mencionada como "Lili")

Diego menciona que usarao uma biblioteca para lidar com permissoes no codigo que tambem suporta recuperar permissoes do banco. Isso significa que a abordagem "permissoes no codigo" nao e um beco sem saida — se no futuro precisar de roles dinamicas, a mesma biblioteca suporta.

## Modelo mental do membership

```
User (1) ──── (N) Member (N) ──── (1) Organization
                    │
                    └── role: Role (ou Role[])
```

O Member e a tabela pivo que conecta usuarios a organizacoes. E nessa tabela que mora a role, NAO na tabela de usuarios. Isso permite:
- Um usuario ter roles diferentes em organizacoes diferentes
- Um usuario ser admin em projeto pessoal e developer em empresa
- Multiplas roles por membership (array)