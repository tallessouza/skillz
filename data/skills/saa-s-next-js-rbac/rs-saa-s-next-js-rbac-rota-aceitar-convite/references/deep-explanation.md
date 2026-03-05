# Deep Explanation: Rota Aceitar Convite

## Por que transacao?

O instrutor usa `prisma.$transaction` para agrupar duas operacoes: criar o member e deletar o invite. Isso garante atomicidade — se uma falhar, a outra tambem falha. Sem transacao, voce pode acabar com um cenario onde o member foi criado mas o invite nao foi deletado (permitindo reuso) ou o invite foi deletado mas o member nao foi criado (usuario perde acesso).

## Fluxo de validacao em 3 camadas

1. **Autenticacao** — O middleware `auth` garante que o usuario esta logado. Sem isso, qualquer pessoa poderia aceitar convites.

2. **Existencia do convite** — `findUnique` retorna null se o convite nao existe ou ja foi deletado (expirado/usado). O erro "not found or expired" cobre ambos os casos com uma unica mensagem, evitando information leakage.

3. **Propriedade por email** — Mesmo autenticado, o usuario so pode aceitar convites enderecados ao seu email. Isso impede que usuario A aceite convite destinado ao usuario B.

## Por que buscar o usuario separadamente?

O `getCurrentUserId` retorna apenas o ID (extraido do token JWT). Para comparar emails, o instrutor precisa buscar os dados completos do usuario no banco. O `findUnique` com ID nunca deveria retornar null (o token so existe se o usuario existe), mas o check `if (!user)` satisfaz o TypeScript e protege contra edge cases (usuario deletado entre login e acao).

## Role vem do invite

A role do novo member vem diretamente do invite (`invite.role`), nao de um parametro da request. Isso significa que quem enviou o convite define o nivel de acesso, nao quem aceita. Padrao correto de seguranca — o convidado nao escolhe seu proprio nivel de permissao.

## Padrao claim-and-consume

Este e um padrao recorrente em sistemas: um recurso (convite, token de reset, codigo de verificacao) e "consumido" ao ser usado. A implementacao correta sempre:
1. Busca o recurso
2. Valida propriedade/elegibilidade
3. Executa a acao + deleta o recurso numa transacao

## Registro da rota no servidor

Apos implementar, a rota precisa ser registrada no arquivo principal do servidor (server.ts), seguindo o mesmo padrao das demais rotas: `app.register(acceptInvite)`.