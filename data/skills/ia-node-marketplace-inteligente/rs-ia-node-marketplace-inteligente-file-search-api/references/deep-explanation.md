# Deep Explanation: File Search API

## Por que contextualizar o modelo?

Modelos de IA nao sabem informacoes privadas do seu negocio — quais produtos estao no estoque, quais receitas o restaurante serve, quais documentos internos existem. O instrutor apresenta tres estrategias com trade-offs claros:

### 1. Injecao direta no prompt (template string)
A forma mais simples: interpolar dados como texto no prompt. Funciona bem com poucos dados, mas tem dois problemas graves:
- **Custo por prompt**: cada token custa dinheiro, e dados grandes inflam o custo
- **Limite de contexto**: modelos tem limite de tokens, e dados grandes podem estourar

### 2. Embeddings (vetorizacao propria)
Processamento anterior onde voce vetoriza seus dados (receitas, produtos). Quando alguem consulta, voce calcula similaridade vetorial — muito mais barato por consulta. Porem exige infraestrutura propria (banco vetorial, pipeline de indexacao).

### 3. File Search API (OpenAI gerenciada)
Voce faz upload de arquivos para a OpenAI, ela vetoriza automaticamente, separa em chunks (receita A, receita B, etc.), e quando voce consulta, ela retorna apenas os trechos relevantes. Zero infraestrutura propria.

## O processo completo explicado pelo instrutor

O instrutor enfatiza que sao **tres etapas separadas**, e faz questao de implementar cada uma em rotas distintas para fins didaticos:

1. **Upload**: `client.files.create()` com `purpose: "assistants"` — sobe o arquivo bruto
2. **VectorStore**: `client.vectorStores.create()` — cria o container que vai processar os arquivos. Aceita `file_ids` na criacao ou via adicao posterior
3. **Processamento**: a OpenAI chunka e vetoriza automaticamente. Demora dependendo do tamanho. Tem endpoint para verificar status
4. **Consulta**: na Responses API, passa `tools: [{ type: "file_search", vector_store_ids: [...] }]`

### Analogia do instrutor sobre VectorStore
A VectorStore e como um banco de dados de conhecimento. Voce pode ter um arquivo de receitas, outro de politicas, outro de FAQs — tudo na mesma VectorStore. Ela processa e indexa cada um internamente.

### Limitacao atual mencionada
Na epoca da gravacao, a Responses API aceita apenas **uma** VectorStore por chamada (embora a tipagem sugira array). O instrutor comenta: "porque eles provavelmente querem que seja varias, mas hoje em dia so pode ser uma".

## Quando NAO usar File Search

O instrutor da o exemplo de **estoque de produtos**: como muda constantemente, nao faz sentido re-upar o arquivo toda hora. Para dados dinamicos, a injecao direta no prompt (se forem poucos) ou embeddings proprios (se forem muitos) sao melhores.

O caso ideal para File Search sao **dados estaticos ou semi-estaticos**: receitas de restaurante, documentacao interna, catalogo de servicos, FAQs. Coisas que mudam raramente e podem ser re-processadas periodicamente.

## Producao vs. didatico

O instrutor destaca que no sistema real:
- O administrador faria upload via formulario
- Os IDs seriam salvos no banco de dados
- O processamento seria automatizado (rotina semanal, por exemplo)
- Haveria polling automatico de status antes de liberar consultas

No codigo da aula, ele deixa hardcoded para fins de aprendizado passo a passo.