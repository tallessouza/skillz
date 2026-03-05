# Deep Explanation: Rota Atualizar Membro

## Por que basear na rota GetMembers

O instrutor escolheu copiar a estrutura da rota `GetMembers` ao inves de `UpdateProject` porque a rota de membros ja possui o contexto correto de organizacao e membership. Isso evita retrabalho na configuracao de autenticacao e autorizacao.

## Extensibilidade do nome da rota

O instrutor nomeou a rota como `UpdateMember` e nao `UpdateMemberRole`, mesmo que atualmente so a role seja atualizada. A justificativa e que futuramente outros dados do membro podem ser editaveis (nome exibido, preferencias, etc.), e a mesma rota PUT pode acomodar esses campos sem breaking changes — basta adicionar campos opcionais ao body schema.

## Seguranca: escopo de organizacao no update

O ponto critico de seguranca desta rota e o filtro por `organizationId` na query de update do Prisma. Sem esse filtro, um admin de uma organizacao A poderia atualizar a role de um membro da organizacao B, bastando conhecer o `memberId` (UUID). O Prisma, ao receber `where: { id, organizationId }`, garante que o update so acontece se ambos os criterios forem satisfeitos — caso contrario, lanca erro de registro nao encontrado.

## Response 204 vs 200

A escolha de 204 (No Content) segue a convencao REST: quando uma operacao de update nao precisa retornar dados ao cliente, 204 e o status code apropriado. O cliente ja sabe qual role enviou, entao nao ha necessidade de echo back.

## Mensagem de erro padrao

A mensagem `"You're not allowed to update this member"` segue o padrao das outras rotas do projeto, mantendo consistencia na API. O erro e generico propositalmente — nao revela se o membro nao existe ou se o usuario nao tem permissao, evitando information leakage.

## Validacao com roleSchema

O `roleSchema` vem do pacote `@saas/auth`, o mesmo usado em todo o sistema RBAC. Isso garante que apenas roles validas definidas no sistema de permissoes sejam aceitas. Usar `z.string()` diretamente permitiria valores arbitrarios que quebrariam as verificacoes de permissao downstream.