# Deep Explanation: Rota de Dados de Faturamento

## Por que excluir a role BILLING da contagem?

O instrutor explica que membros com role `BILLING` existem exclusivamente para gerenciar aspectos financeiros da organizacao. Eles nao sao "usuarios ativos" no sentido de consumir recursos do SaaS — nao criam projetos, nao colaboram em tarefas. Cobrar por eles seria injusto e criaria um desincentivo para organizacoes terem gestao financeira adequada.

No modelo RBAC do curso, as roles sao: `ADMIN`, `MEMBER`, `BILLING`. A role BILLING e especial porque tem permissoes limitadas apenas a visualizacao de dados financeiros.

## Promise.all para queries paralelas

O instrutor usa `Promise.all` para executar as duas contagens (membros e projetos) simultaneamente. A justificativa e simples: as queries sao independentes — o resultado de uma nao influencia a outra. Executar sequencialmente dobraria o tempo de resposta sem necessidade.

Padrao: sempre que voce tem N queries independentes em uma rota, agrupe-as em `Promise.all`.

## Estrutura da resposta de billing

A resposta nao e apenas um numero total. O instrutor estrutura em categorias (`seats` e `projects`), cada uma com:
- `amount`: quantidade de recursos
- `unit`: preco unitario
- `price`: subtotal (amount * unit)

Mais um `total` geral. Isso permite que o frontend mostre um breakdown detalhado ao usuario, nao apenas "voce deve R$X".

## Precedencia de operadores

O instrutor menciona explicitamente que nao precisa de parenteses em `amountOfMembers * 10 + amountOfProjects * 20` porque multiplicacao tem precedencia sobre soma em JavaScript (e em matematica). Isso e um detalhe sutil mas importante — parenteses desnecessarios adicionam ruido visual.

## Tipagem com Zod

O instrutor extrai o tipo do objeto de retorno e o replica no schema de resposta usando `z.object()` com `z.number()` para cada campo. Esse padrao garante que o Fastify com ZodTypeProvider valide a resposta automaticamente e gere documentacao Swagger correta.

## Padrao geral de rotas neste projeto

Todas as rotas seguem o mesmo fluxo:
1. Extrair `slug` dos params
2. `getCurrentUserId()` — autenticacao
3. `getUserMembership(slug)` — buscar membership na org
4. `getUserPermissions(userId, role)` — calcular permissoes CASL
5. Checar `cannot('action', 'Subject')` — autorizar
6. Executar logica de negocio
7. Retornar resposta tipada

A rota de billing segue exatamente esse padrao, o que demonstra consistencia arquitetural.