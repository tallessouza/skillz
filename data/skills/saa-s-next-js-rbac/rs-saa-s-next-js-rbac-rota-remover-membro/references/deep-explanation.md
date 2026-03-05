# Deep Explanation: Rota Remover Membro

## Por que "remove" e nao "delete"?

O instrutor faz uma distincao semantica importante: **remove** comunica desassociacao, enquanto **delete** comunica exclusao permanente.

Quando um admin remove um membro da organizacao, o usuario continua existindo no sistema. Ele pode ser convidado novamente, pode pertencer a outras organizacoes. A acao e sobre o **vinculo** (membership), nao sobre o **usuario**.

Usar `deleteMember` criaria ambiguidade — alguem lendo o codigo poderia pensar que o usuario esta sendo excluido do sistema inteiro.

## Padrao de consistencia com updateMember

O instrutor destaca que `removeMember` segue exatamente o mesmo padrao de `updateMember`:
- Mesma estrutura de parametros (`orgSlug`, `memberId`)
- Mesma verificacao de autorizacao
- Mesma organizacao de rotas

A diferenca e que:
- `updateMember` usa PATCH e recebe um body com `role`
- `removeMember` usa DELETE e nao recebe body (apenas remove o registro)

O instrutor menciona "tiro o data e pronto" — referindo-se a que, diferente do update que retorna dados, o remove simplesmente executa o delete no Prisma sem retornar dados.

## Organizacao da API

O instrutor observa que a API esta "ficando bem organizada, bem documentada" com o Swagger. As rotas de membros estao agrupadas logicamente:
- GET (listar membros)
- PATCH (atualizar role)
- DELETE (remover membro)

Essa organizacao facilita testes no frontend posteriormente.

## Mensagem de erro de autorizacao

A mensagem de erro segue o padrao estabelecido nas outras rotas:
- "You are not allowed to remove this member from the organization"
- Usa "remove" consistentemente (nao "delete")
- Especifica o contexto ("from the organization")