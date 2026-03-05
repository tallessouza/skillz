# Deep Explanation: Confirmando Acao

## Arquitetura do fluxo de confirmacao

O instrutor desenha um fluxo em duas etapas bem distintas:

1. **Etapa anterior (ja implementada):** Usuario envia mensagem → LLM identifica se precisa de acao extra → salva a acao no banco → frontend mostra botao confirmar/cancelar
2. **Etapa atual:** Usuario confirma → sistema embeda o input → calcula similaridade localmente → agrupa por loja → AI monta carrinhos → salva no banco

### Por que o pre-filtro local?

O instrutor enfatiza: "fazer o calculo localmente de relevancia dos produtos" porque e "bem mais barato". A ideia e que a AI (LLM) so recebe os produtos relevantes, nao o catalogo inteiro. O LLM sabe a receita (quais ingredientes precisa para um bolo de chocolate), mas o sistema faz o trabalho pesado de filtrar o catalogo.

### Cosine distance vs outras metricas

O instrutor menciona explicitamente: "a distancia, o cosine distance, que vai medir a orientacao, a direcao para onde o vetor esta apontando". O operador no pgvector e `<=>` (com igual no meio). Quanto mais perto de zero, mais similar. O threshold de 0.65 foi escolhido empiricamente: "com os testes que eu fiz, foi interessante quando eu botei menor do que 0.65".

### Separacao confirmar vs executar

O instrutor salva `confirmed_at` antes de iniciar o processamento. Isso e importante porque:
- Se o processamento falhar, a intencao do usuario ja esta registrada
- Permite detectar confirmacoes duplicadas (409 Conflict)
- O frontend sabe que o usuario ja confirmou mesmo se o carrinho ainda nao foi gerado

### Tipagem do payload

O instrutor opta por tipar payload como `{ input: string }` diretamente, explicando: "so tem um por enquanto, ate para facilitar nossa tipagem". Reconhece que payloads diferentes poderiam existir para action_types diferentes, mas nao over-engineer.

### Agrupamento por loja

A decisao de agrupar produtos por store_id antes de enviar para a AI e estrategica: cada loja pode ter produtos diferentes, precos diferentes, e o carrinho final precisa ser por loja (voce compra em uma loja, nao em varias ao mesmo tempo).

### Erros encontrados durante a aula

1. **Column description does not exist** — o autocomplete sugeriu campos que nao existiam na tabela
2. **Vector must start with [** — o embedding precisa ser stringificado antes de passar como parametro SQL
3. **Array vazio no resultado** — os produtos ainda nao tinham embeddings gerados, entao a query de similaridade nao encontrou nada

### Validacao em camadas

O instrutor implementa validacao progressiva:
1. Session existe? (404)
2. Action existe? (404)
3. Action ja confirmada? (409 Conflict)
4. Action type suportado? (500 Internal Server Error)

Cada camada retorna um erro especifico, nao um generico.