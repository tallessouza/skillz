# Deep Explanation: Caso de Uso de Perfil

## Por que ID e nao email?

O instrutor explica com clareza: o ID e a unica informacao que voce tera apos a autenticacao. Quando o usuario se autentica (via JWT, por exemplo), o token carrega o ID do usuario. Nas proximas requisicoes, esse ID e extraido do token para identificar quem esta fazendo a requisicao.

Alem disso, o ID nunca muda. O email pode ser alterado pelo usuario (funcionalidade de "trocar email"), mas o ID e imutavel. Usar email como identificador principal criaria fragilidade: se o usuario troca o email entre duas requisicoes, o sistema quebraria.

## Por que um erro generico (ResourceNotFoundError)?

O instrutor faz uma analise pragmatica: verificacoes de existencia por ID sao extremamente comuns em use cases. Quase todo use case que recebe um ID precisa verificar se o recurso existe. Criar um erro especifico para cada entidade (`UserNotFoundError`, `GymNotFoundError`, `CheckInNotFoundError`) geraria dezenas de classes de erro quase identicas.

Mais importante: esse erro raramente e acionado por uso legitimo. O instrutor argumenta que, num app mobile, o usuario so chega na tela de perfil se ja estiver autenticado e tiver um ID valido. A unica forma de acionar esse erro seria alguem tentando adivinhar IDs na rota — um cenario de seguranca, nao de fluxo normal.

Por isso, um erro generico e suficiente. Nao ha necessidade de granularidade fina em mensagens de erro para cenarios que quase nunca acontecem legitimamente.

## Estrategia de desenvolvimento: use cases primeiro, HTTP depois

O instrutor faz uma escolha deliberada: ele nao cria controllers HTTP para o perfil neste momento. Ele foca inteiramente na camada de dominio (use cases + testes unitarios).

A razao e pedagogica e arquitetural: a camada de dominio e independente da camada de infra. Voce pode validar todas as regras de negocio sem HTTP, sem banco de dados real, sem framework web. Isso e o principio SOLID na pratica — a separacao entre camadas permite desenvolvimento e teste isolado.

O instrutor menciona que mais pra frente vao criar testes E2E para controllers, entao faz sentido agrupar toda a parte HTTP em uma fase dedicada.

## Reaproveitamento no repositorio

O instrutor mostra que `findById` e estruturalmente identico a `findByEmail`. A unica diferenca e o campo comparado no `.find()`. Ele literalmente copia o metodo e troca `email` por `id`. Isso demonstra que, no in-memory repository, os metodos de busca sao triviais — o valor real esta na interface que eles implementam.

## Relacao com o fluxo completo

Este use case faz parte do requisito funcional "obter perfil de usuario logado". O fluxo completo sera:
1. Usuario se autentica (use case de authenticate — ja feito)
2. JWT e gerado com o ID do usuario (ainda nao implementado)
3. Usuario acessa /me ou /profile
4. Controller extrai userId do JWT
5. Controller chama GetUserProfileUseCase com o userId
6. Use case retorna os dados do usuario

Nesta aula, apenas o passo 6 e implementado. Os passos 2-5 virao mais pra frente.