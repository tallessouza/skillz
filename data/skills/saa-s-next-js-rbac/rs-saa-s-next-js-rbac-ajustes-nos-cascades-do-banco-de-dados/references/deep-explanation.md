# Deep Explanation: Cascades no Banco de Dados

## Por que cascades sao necessarios

Quando voce tem uma organizacao no banco de dados que possui convites, membros e projetos como registros filhos, tentar deletar essa organizacao sem configurar cascades resulta em erro de foreign key constraint. O banco de dados impede a delecao porque existem registros apontando para aquela organizacao.

## A logica por tras de cada estrategia

### Cascade — "morre junto"

Usado quando o registro filho nao faz sentido sem o pai:
- **Convites de uma organizacao**: se a organizacao foi deletada, os convites nao tem mais proposito
- **Membros de uma organizacao**: membership sem organizacao e invalido
- **Projetos de uma organizacao**: projetos pertencem a organizacao
- **Accounts de um usuario**: OAuth accounts nao existem sem o usuario
- **Membro-usuario**: se o usuario e deletado, a associacao dele com organizacoes tambem e deletada

### SetNull — "orfao permitido"

Usado quando o registro pode continuar existindo sem a referencia:
- **Author de um convite**: o convite ainda e valido mesmo que quem o criou tenha sido deletado. Por isso o campo `authorId` e opcional (`String?`) — para poder receber `null`.
- **Owner de um projeto**: o instrutor menciona que seria o mais ideal colocar como setNull, porque o projeto pode continuar existindo sem o owner original.

### A relacao entre SetNull e campos opcionais

O instrutor destaca: "ate por isso que eu criei ele como opcional". Isso e fundamental — se voce configura `onDelete: SetNull` mas o campo e obrigatorio no schema, o Prisma vai rejeitar a migration. O campo DEVE ser opcional (`?`) para que o banco possa setar null nele.

## Transaction para reset de senha

O instrutor percebeu durante a aula que faltava deletar o token apos o reset de senha. A solucao correta e usar `prisma.$transaction()` para garantir que:
1. O update da senha do usuario
2. A delecao do token

Acontecam de forma atomica. Se um falhar, o outro tambem falha. Isso impede que o token continue valido apos o reset (vulnerabilidade de seguranca) e tambem impede que o token seja deletado mas a senha nao seja atualizada.

## Migrate apos alteracoes

Quando voce adiciona `onDelete: Cascade` ou `onDelete: SetNull` no schema Prisma, essas alteracoes nao se aplicam automaticamente no banco. E necessario rodar:

```bash
npx prisma migrate dev --name add-cascade-rules
```

Isso gera ALTER TABLE statements que modificam as foreign keys existentes para incluir o comportamento ON DELETE correto.

## Decisao ownerId — pragmatismo vs purismo

O instrutor menciona sobre o `ownerId` do projeto: "eu poderia tambem ter colocado como nulo, acho que seria o mais ideal, mas nao e um problema, ate porque o usuario ser deletado e um pouco mais complexo". Isso mostra um pragmatismo saudavel — em um SaaS, deletar usuarios e raro e geralmente envolve soft-delete, entao a decisao exata sobre cascade vs setNull no ownerId e menos critica na pratica.