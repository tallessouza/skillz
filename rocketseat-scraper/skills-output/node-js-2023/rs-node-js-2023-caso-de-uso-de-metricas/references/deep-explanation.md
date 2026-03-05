# Deep Explanation: Caso de Uso de Metricas

## Por que metricas sao um caso de uso separado

O instrutor explica que aplicacoes de check-in (como apps de academia) precisam mostrar dashboards com metricas para o usuario. O numero total de check-ins "lifetime" e a metrica mais basica — quantos check-ins o usuario fez desde que comecou a usar o app.

Mesmo sendo simples, isso merece um use case proprio porque:
- Separa a responsabilidade de "listar check-ins" de "contar check-ins"
- Permite evolucao independente (adicionar metricas por semana, mes, ano)
- Mantem o padrao SOLID consistente na aplicacao

## Estrategia de reuso inteligente

O instrutor demonstra uma pratica pragmatica: copiar o use case de `FetchUserCheckInsHistory` e adaptar. Isso nao e "copiar e colar preguicoso" — e reconhecer que use cases simples seguem a mesma estrutura e adaptar e mais rapido que escrever do zero.

O que mudou na adaptacao:
1. Removeu paginacao (nao faz sentido para contagem)
2. Trocou o metodo do repositorio (`findManyByUserId` → `countByUserId`)
3. Trocou o tipo de retorno (array → numero)
4. Renomeou para refletir a nova responsabilidade

## Retorno como objeto, nao primitivo

O use case retorna `{ checkInsCount: number }` e nao `number` diretamente. O instrutor menciona que "mais pra frente a gente pode ter outras informacoes sendo retornadas dessas metricas". Isso e design para extensibilidade sem quebrar a interface.

## In-memory vs banco real

O metodo `countByUserId` no in-memory repository usa `items.filter(...).length`. O instrutor destaca que isso e aceitavel para testes, mas no banco de dados real (Prisma), a contagem deve ser feita via query SQL, nao carregando todos os registros.

Ele usa o exemplo da busca de academias proximas para reforcar: "nao faz sentido eu retornar todas as academias e depois passar cada uma delas por esse metodo". O mesmo principio se aplica a contagens — deixe o banco de dados fazer a agregacao.

## Complexidade relativa dos use cases

O instrutor contextualiza este use case como "bem simples" comparado ao que vem depois:
- **Buscar academias proximas**: mais complexo por causa do calculo de distancia que precisa ser movido para a query SQL por performance
- **Validacao de check-in**: complexidade de regras de negocio

Isso ajuda a calibrar expectativas: nem todo use case precisa de complexidade. Metricas simples devem ser simples.

## Teste da metrica

O teste reutiliza a criacao de dois check-ins (que ja existia no teste copiado) e simplesmente verifica que `checkInsCount` e igual a 2. O instrutor destaca que nomeou o teste como "should be able to get check-in count from metrics" porque o use case de metricas pode crescer — o teste valida uma metrica especifica, nao o use case inteiro.