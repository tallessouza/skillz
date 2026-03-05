# Deep Explanation: Persistindo Anexos no Banco

## A grande sacada: dominio != banco

O insight mais importante desta aula e que **criar uma entidade no dominio nao tem relacao 1:1 com criar um registro no banco de dados**. O instrutor enfatiza:

> "Nao e porque eu estou criando uma entidade a nivel de dominio que eu estou necessariamente tendo que criar um registro no banco de dados. Criar uma entidade na minha camada de dominio pode significar ate deletar uma linha do banco de dados."

Quando o sistema "cria" um `QuestionAttachment`, no banco de dados o que acontece e um **UPDATE** — o attachment ja existe, so precisa receber o `questionId`. Essa desconexao entre dominio e persistencia e fundamental em Clean Architecture.

> "A gente tem que fugir dessa relacao de um pra um. A gente aprende desde o comeco em desenvolvimento de software que e tudo conectado, mas nao e."

## Ordem de operacoes e foreign keys

No metodo `create`:
- A pergunta DEVE ser criada antes dos attachments
- Motivo: o banco precisa da foreign key (`questionId`) para aceitar os attachments
- Se tentar rodar em paralelo: erro de FK constraint

No metodo `save` (update):
- A pergunta ja existe no banco
- `createMany` (novos attachments), `deleteMany` (removidos) e `update` (dados da pergunta) sao independentes
- Podem rodar em `Promise.all` sem problemas

## Limitacoes de transactions no Prisma

O instrutor discute que o ideal seria usar transactions para garantir atomicidade, mas o Prisma tem uma limitacao:

> "A parte de transactions do Prisma nao suporta que a gente tenha uma transaction que possa englobar operacoes que acontecem em arquivos diferentes."

Existe uma extensao (`Callback Free Interactive Transactions`) que resolveria isso, mas ela propria diz "not for production". Entao a alternativa pragmatica e usar `Promise.all` sem transaction formal.

A unica alternativa seria descer a camada e fazer SQL raw, o que quebraria o proposito de usar o Prisma.

## Mapper como ponte entre dominio e persistencia

O mapper (`PrismaQuestionAttachmentMapper`) e o lugar certo para traduzir operacoes de dominio em operacoes de banco. O metodo `toPrismaUpdateMany`:

1. Extrai os IDs dos attachments
2. Retorna um objeto `Prisma.AttachmentUpdateManyArgs`
3. Define o `where` (quais attachments atualizar) e o `data` (qual questionId setar)

O instrutor justifica criar um metodo separado (`toPrismaUpdateMany` em vez de so `toPrisma`):
> "Quero deixar ele um pouquinho mais semantico, porque depois eu posso ter outros metodos toPrisma aqui dentro."

## Controller recebendo attachments

No controller, os attachments chegam como uma lista de UUIDs (strings). A validacao com Zod garante que cada ID e um UUID valido antes de passar para o caso de uso.

## Testes E2E

O teste precisa criar attachments no banco ANTES de criar a pergunta com eles, para simular o fluxo real onde attachments ja existem (foram uploaded previamente).