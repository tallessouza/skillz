# Deep Explanation: Rota de Deletar Projeto

## Por que parse antes de verificar permissao?

O CASL (biblioteca de autorizacao) precisa de um subject tipado para avaliar regras como "usuario so pode deletar projeto se for owner". O objeto retornado pelo Prisma e um plain object — nao tem a tipagem que o CASL espera. O `projectSchema.parse()` transforma o objeto do banco em um subject CASL com a classe correta, permitindo que regras como `can('delete', 'Project')` com condicoes de ownership funcionem.

Sem o parse, a verificacao `cannot('delete', project)` compararia contra um objeto sem tipo, e o CASL nao conseguiria avaliar a condicao de ownership (`ownerId === userId`).

## Por que filtrar por organizationId no findUnique?

O instrutor destaca um ponto de seguranca critico: sem o filtro de `organizationId`, um usuario poderia enviar um `projectId` de outra organizacao e deletar um projeto que nao pertence a organizacao atual. Mesmo que a verificacao de permissao CASL pegasse isso (via ownership), a defesa em profundidade exige que o escopo organizacional seja verificado na query.

## Resposta 204 vs 200

O HTTP 204 (No Content) e semanticamente correto para DELETE porque:
- A acao foi completada com sucesso
- Nao ha conteudo para retornar
- O body deve ser nulo/vazio

Retornar 200 com `{ message: 'deleted' }` e um anti-pattern porque adiciona payload desnecessario e nao segue a semantica REST.

## Sobre testes

O instrutor menciona que nao testa cada rota no Swagger porque ja implementou essas rotas antes. Ele reconhece que o correto seria ter testes automatizados end-to-end, mas prioriza velocidade na aula. A validacao real acontece quando o frontend e conectado — bugs de integracao aparecem nesse momento.

Essa abordagem pragmatica e valida para prototipos, mas em producao o instrutor recomenda testes automatizados.

## Padrao de rotas repetitivas

O instrutor observa que rotas de CRUD (especialmente update e delete) seguem um padrao muito similar:
1. Extrair params (slug + resourceId)
2. Buscar membership do usuario na organizacao
3. Buscar recurso com escopo organizacional
4. Verificar existencia
5. Parse para CASL
6. Verificar permissao
7. Executar operacao
8. Retornar resposta

Esse padrao se repete em praticamente toda rota protegida da API, o que justifica a semelhanca entre as implementacoes.