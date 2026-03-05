# Deep Explanation: Traces — Rastreio Distribuido

## Por que traces existem

O instrutor posiciona traces como o terceiro pilar da observabilidade (junto com logs e metricas). A motivacao central e: em sistemas distribuidos, uma unica requisicao atravessa multiplos servicos, e sem uma forma de rastrear esse caminho, o debug se torna um exercicio manual e fragil.

A analogia implicita e a de um detetive seguindo pistas: sem trace, voce precisa ir em cada "cena do crime" (servico) e tentar reconstruir a sequencia. Com trace, voce tem uma camera que filmou todo o percurso.

## Conceitos fundamentais

### Trace ID — O fio condutor

Quando uma requisicao nasce (ex: sai do frontend via HTTP), um ID unico e associado a ela. Esse ID e propagado em cada chamada subsequente. Servico A chama B passando o trace ID, B chama C passando o mesmo ID. Isso permite que ferramentas de observabilidade agreguem todos os eventos sob uma unica visao.

O instrutor enfatiza que sem o trace ID, voce teria que:
1. Achar algo nos logs do servico A
2. Pegar um elemento identificador
3. Procurar manualmente no servico B
4. Repetir para cada servico na cadeia

Isso e "um fluxo muito mais manual" — e portanto propenso a erro e demorado.

### Span — A unidade de execucao

Um span representa uma operacao individual dentro do trace. Exemplos:
- Requisicao ao banco de dados (find, insert, upsert)
- Chamada a outro servico
- Processamento interno

O instrutor explica que spans podem ser criados manualmente (instrumentacao no codigo) ou via auto-instrumentacao (bibliotecas que fazem isso automaticamente). Na parte pratica do curso, sera usado o segundo approach.

### Hierarquia de spans

Spans formam uma arvore. O instrutor mostra uma imagem onde:
- O trace total durou ~97ms
- Um span especifico (getUserName) durou 36ms
- Cada span tem timestamp e duracao
- A hierarquia mostra quem chamou quem

Isso permite ver que de 97ms totais, 36ms foram gastos em uma unica operacao — informacao valiosa para otimizacao.

## Valor pratico do tracing

### 1. Identificacao de chamadas desnecessarias

O instrutor destaca este ponto como "muito legal": ao visualizar o trace, voce pode encontrar spans que representam chamadas que "nem sao utilizadas mais, estao ali simplesmente de maneira desnecessaria e estao causando latencia". Isso e algo que logs e metricas isolados nao revelam com a mesma clareza.

### 2. Mapa de dependencias

Os traces naturalmente constroem um mapa de quem chama quem. O instrutor conecta isso com:
- **Visao arquitetural**: entender o ecossistema de dependencias
- **Refatoracao**: identificar dependencias que podem ser eliminadas
- **Backstage**: ferramenta de documentacao que tambem pode mapear dependencias (complementar ao tracing)

### 3. Blast radius (raio de explosao)

Conceito central: quando um servico falha, qual e o impacto real?

- **Impacto local**: servico B esta indisponivel
- **Impacto global**: todos que dependem de B (direta ou transitivamente) sao afetados

O instrutor enfatiza que com mapa de dependencias, voce consegue "metrificar melhor o raio de explosao" — saber antecipadamente o que acontece se qualquer servico do ecossistema ficar indisponivel.

### 4. Sincrono vs assincrono

O instrutor faz uma distincao importante:
- **Sincrono**: latencia impacta diretamente o tempo de resposta ao usuario (ex: 100ms e "um tempo bem ok")
- **Assincrono**: latencia maior pode ser aceitavel dependendo do negocio (consistencia eventual), como consumo de eventos

## Conexao com ferramentas

O instrutor menciona que nas proximas aulas cobrira:
- Ferramentas de tracing (Jaeger, Tempo, etc.)
- OpenTelemetry como padrao de instrumentacao
- Parte pratica com auto-instrumentacao

## Upstream e downstream

O instrutor menciona brevemente os conceitos de upstream/downstream na cadeia de dependencias, relacionando com a capacidade de entender o raio de impacto quando um servico "upstream" ou "downstream" fica indisponivel.