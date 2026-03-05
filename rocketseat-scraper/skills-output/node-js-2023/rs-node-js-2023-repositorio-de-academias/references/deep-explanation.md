# Deep Explanation: Repositorio de Academias com Prisma

## Por que o ORM nao basta para tudo

O instrutor faz uma observacao crucial: o Prisma (e qualquer ORM) resolve ~80% dos casos de uso — CRUD, paginacao, buscas simples. Mas existem momentos em que voce precisa descer para o SQL raw.

O exemplo classico e a busca geoespacial. No repositorio in-memory, usamos uma funcao JavaScript (`getDistanceBetweenCoordinates`) para calcular distancias. Isso funciona porque todos os dados estao na memoria da aplicacao. Mas em producao, com banco de dados real, voce **nao pode** executar funcoes JavaScript dentro do banco.

## O erro fatal: buscar tudo para filtrar em JS

O instrutor enfatiza: "pelo amor de Deus", imaginem um app com 10.000, 20.000, 100.000 academias. Buscar todas e filtrar em JavaScript seria "extremamente nao performatico". Essa e a armadilha classica de quem so conhece ORM e nao entende SQL.

## A Formula de Haversine

A formula calcula distancia entre dois pontos num globo:
- Multiplica por 6371 para obter resultado em quilometros (raio medio da Terra)
- Usa funcoes trigonometricas: `cos`, `sin`, `acos`, `radians`
- O `<= 10` no final filtra academias ate 10km de distancia

O instrutor e honesto: "eu nunca escrevi essa query do zero e eu nao faco a menor ideia do calculo que e utilizado ali por baixo dos panos". O ponto nao e memorizar a formula, mas saber que ela existe e como aplica-la.

## Template Literals no $queryRaw

O Prisma usa tagged template literals (crase colada no metodo, sem parenteses). Isso permite:
1. Colorização de SQL dentro do template
2. Interpolacao segura de parametros (protecao contra SQL injection)
3. Sintaxe limpa para queries longas

## Tipagem do retorno

`$queryRaw` retorna `unknown` por padrao, porque o Prisma nao consegue inferir o formato de um SELECT arbitrario. A solucao e passar o generic: `$queryRaw<Gym[]>`. Como fazemos `SELECT *` da tabela gyms, o retorno corresponde exatamente ao tipo `Gym` do Prisma Client.

## A mensagem de fundo: aprenda SQL

O instrutor reforça: se voce quer se especializar em back-end, nao basta saber usar ORM. Voce precisa entender o SQL que esta sendo gerado. Saber usar Prisma, TypeORM, Knex sem entender as queries por baixo e como dirigir sem saber mecanica — funciona ate o primeiro problema serio.

## Testes: a diferenca entre unitario e E2E

O repositorio in-memory usa funcoes JS puras (adequado para testes unitarios). O repositorio Prisma usa SQL real. Para testar se o SQL funciona, precisamos de testes E2E que batem no banco real — testes unitarios com mock nao validam a query SQL.