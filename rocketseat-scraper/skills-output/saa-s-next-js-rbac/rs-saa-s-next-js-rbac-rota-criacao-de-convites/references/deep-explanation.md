# Deep Explanation: Rota de Criacao de Convites

## Por que tres barreiras e nao apenas criar?

O instrutor (Diego) raciocina a partir dos cenarios reais de um SaaS multi-tenant. O convite parece simples — salvar email + role — mas sem validacoes gera estados inconsistentes.

### Barreira 1: Dominio com auto-join

A logica e: se a organizacao Rocketseat tem `shouldAttachUsersByDomain` habilitado com dominio `rocketseat.com.br`, qualquer pessoa que criar conta com esse dominio ja e automaticamente associada. Entao criar um convite para `diego@rocketseat.com.br` e redundante — a pessoa so precisa fazer login.

O instrutor destaca: "nao tem porque tu criar um convite pra essa galera". E uma regra de negocio que evita confusao para o admin.

### Barreira 2: Convite duplicado

Usa o indice composto `[email, organizationId]` que ja existe no schema Prisma. O `findUnique` com esse indice e mais performatico que `findFirst` porque o banco sabe que so pode haver um resultado.

### Barreira 3: Membro existente

Aqui o `findFirst` e necessario porque a busca e por relacao aninhada (`user.email`), nao por um indice direto na tabela `member`. O Prisma nao suporta `findUnique` com filtros em relacoes.

## Por que nao incluir nome no convite?

Diego explica dois cenarios:
1. Usuario ja tem conta → o nome da conta dele e o que vale
2. Usuario nao tem conta → vai criar uma e informar o nome nesse momento

O unico uso do nome seria no e-mail de convite ("Oi Diego, voce foi convidado"), mas Diego considera isso nao essencial para o MVP.

## Renomeacao de userId para authorId

Durante a aula, Diego percebe que o campo `userId` no modelo `Invite` nao e descritivo. Ele para, renomeia para `authorId` no schema Prisma, roda a migration, e reinicia o TypeScript server. Isso demonstra a pratica de nomenclatura por papel — o campo descreve QUEM fez a acao (o autor do convite), nao apenas "um usuario qualquer".

## Complexidade do fluxo de aceitacao (preview)

Diego menciona que o front-end tera varios fluxos:
- Usuario logado com e-mail correto → aceitar direto
- Usuario logado com e-mail diferente → sugerir trocar de conta
- Usuario nao logado → sugerir criar conta ou fazer login

Isso sera tratado em aulas futuras, mas mostra que a entidade de convite precisa ser robusta no back-end para suportar esses cenarios.

## Observacao importante do instrutor

No tempo 4:16, faltou adicionar o `.split('@')` ao recuperar o `domain`. O codigo correto e:
```typescript
const [, domain] = email.split('@')
```
E nao simplesmente pegar o email inteiro como domain.