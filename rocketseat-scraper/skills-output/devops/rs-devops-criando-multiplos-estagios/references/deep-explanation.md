# Deep Explanation: Multi-Stage Build

## Por que multi-stage existe

O instrutor explica que nao e incomum precisar de pacotes especificos apenas para o build. No exemplo do NestJS, o `yarn build` executa o CLI do Nest (`@nestjs/cli`), que e uma devDependency. Essa dependencia e necessaria para GERAR o build, mas nao para EXECUTAR a aplicacao.

O problema: se voce usa um unico estagio, a imagem de producao carrega tudo que foi necessario para o build — devDependencies, source code, ferramentas de compilacao. Isso infla o container desnecessariamente.

## A analogia do ciclo de vida

O instrutor faz uma distincao clara entre tres fases:
- **Preparacao/Build**: instalar pacotes, compilar, gerar artefatos
- **Execucao**: rodar a aplicacao com apenas o necessario
- "Uma coisa e o build, uma coisa e a preparacao, outra coisa e a execucao"

Itens de build nao pertencem ao ciclo de vida execucional da aplicacao.

## Como funciona na pratica

### Estagios sao seriais
O Docker executa cada estagio linha por linha, em ordem. O primeiro estagio roda completamente antes do segundo comecar.

### Estagios seguintes reaproveitam anteriores
O principio fundamental: "o estagio seguinte sempre vai conseguir reaproveitar o que ja foi feito". Como o build ja aconteceu no estagio 1, o estagio 2 pode copiar os artefatos gerados sem precisar rebuildar.

### AS = Alias (como SQL)
O instrutor compara com SQL: `SELECT campo AS apelido`. O `AS build` no `FROM` da um nome ao estagio que pode ser referenciado depois. Sem alias, o Docker usa o nome do container base, o que e confuso para gerenciamento.

### COPY --from muda a semantica
- `COPY` normal: copia da maquina host para o container
- `COPY --from=build`: copia de um estagio anterior para o estagio atual
- O path no --from e relativo ao WORKDIR do estagio de origem

## Atencao com paths entre estagios

Se o estagio de build usa `/app` como WORKDIR, voce referencia `/app/dist` no COPY --from. Se mudar o WORKDIR no estagio de runtime, isso nao afeta o path de origem — ele e sempre absoluto relativo ao estagio de onde voce copia.

## Resultados concretos da aula

| Versao | Tecnica | Tamanho |
|--------|---------|---------|
| Slim | Single-stage com Slim | ~197MB |
| Alpine | Single-stage com Alpine | ~473MB (neste exemplo especifico) |
| Multi-stage (node:18 full) | Multi-stage sem Alpine | ~383MB |
| Multi-stage + Alpine | Combinacao otima | ~90MB |

O ganho do multi-stage sozinho (sem Alpine) ja reduziu de ~1GB para 383MB. Combinado com Alpine, chega a ~90MB.

## Estagios possiveis alem de build/runtime

O instrutor menciona que voce pode ter multiplos estagios para diferentes propositos:
- **build**: compilacao e geracao de artefatos
- **test**: execucao de testes (nao vai para producao)
- **development**: ambiente de desenvolvimento
- **production**: versao final otimizada

## Multiplos FROMs

Cada `FROM` inicia um novo estagio. O Docker permite quantos FROMs forem necessarios. Cada estagio e independente mas pode copiar de qualquer estagio anterior nomeado.