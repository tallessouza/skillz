# Code Examples: File Search API

## Estrutura do projeto da aula

O projeto e um marketplace inteligente (Node.js + OpenAI) que recebe o nome de uma receita e retorna os produtos disponiveis no supermercado para faze-la.

## Rota de upload de arquivo

```typescript
// Modulo OpenAI - funcao de upload
async function uploadFile(file: fs.ReadStream) {
  const uploaded = await client.files.create({
    file,
    purpose: "assistants",
  });

  console.log("Upload:", uploaded);
  return uploaded;
}

// Rota HTTP
app.post("/upload", async (req, res) => {
  const file = fs.createReadStream(
    path.join(__dirname, "..", "static", "receipts.md")
  );

  await uploadFile(file);

  res.sendStatus(201);
});
```

**Nota do instrutor**: Em producao, o arquivo viria do formulario da requisicao (multipart). Aqui le direto do filesystem para simplificar.

## Rota de criacao da VectorStore

```typescript
async function createVectorStore() {
  const vectorStore = await client.vectorStores.create({
    name: "node-ia-file-search",
    file_ids: [FILE_ID], // ID obtido no upload anterior
  });

  console.log("VectorStore:", vectorStore);
  return vectorStore;
}

app.post("/vector-store", async (req, res) => {
  await createVectorStore();
  res.sendStatus(201);
});
```

**Nota**: `file_ids` aceita array — voce pode passar multiplos arquivos na criacao, ou adicionar depois via outro endpoint.

## Verificacao de status de processamento

```typescript
// Verificacao inline (o instrutor faz direto no escopo do modulo)
const filesStatus = await client.vectorStores.files.list(VECTOR_STORE_ID);
console.dir(filesStatus.data);
// Cada arquivo tem: { id, status: "completed" | "in_progress" | "failed" }
```

**Nota do instrutor**: "Tem endpoint tambem para a gente verificar qual e o status para a gente fazer isso de forma automatizada, daqui a um minuto eu vejo se ja processou."

## Rota principal — geracao de carrinho COM File Search

```typescript
app.post("/cart", async (req, res) => {
  const { input } = req.body; // ex: "arrumadinho"

  const products = await database.getProducts(); // poucos produtos, injecao direta

  const response = await client.responses.create({
    model: "gpt-4o",
    input: `Retorna uma lista de 5 produtos.
            Os produtos disponiveis sao os seguintes: ${JSON.stringify(products)}.
            Receita solicitada: ${input}`,
    tools: [
      {
        type: "file_search",
        vector_store_ids: [VECTOR_STORE_ID],
      },
    ],
  });

  res.json(response);
});
```

## Demonstracao do instrutor — antes e depois

### Sem File Search
```
Input: "sushi"     → Retorna produtos corretamente (modelo ja conhece sushi)
Input: "arrumadinho" → "Nao tenho informacoes sobre essa receita"
```

### Com File Search (apos upload + VectorStore + processing)
```
Input: "sushi"     → Continua funcionando normalmente
Input: "arrumadinho" → Retorna lista completa de ingredientes da receita propria
```

### Prova de que funciona — removendo a tool
O instrutor remove a tool `file_search` do prompt e mostra que o modelo volta a nao saber a receita de arrumadinho. Ao recolocar, volta a funcionar. Isso comprova que a informacao vem da VectorStore, nao do conhecimento nativo do modelo.

## Arquivo de receitas (receipts.md)

O instrutor menciona um arquivo `static/receipts.md` contendo receitas em formato Markdown. A OpenAI automaticamente separa em chunks por receita e vetoriza cada uma independentemente.

## Pipeline completo em producao (sugerido pelo instrutor)

```typescript
// 1. Admin faz upload via formulario
// 2. Sistema sobe para OpenAI
const uploaded = await client.files.create({ file, purpose: "assistants" });

// 3. Salva ID no banco
await db.files.insert({ openaiFileId: uploaded.id, name: file.name });

// 4. Adiciona na VectorStore existente (ou cria nova)
await client.vectorStores.files.create(VECTOR_STORE_ID, {
  file_id: uploaded.id,
});

// 5. Polling de status
let ready = false;
while (!ready) {
  const files = await client.vectorStores.files.list(VECTOR_STORE_ID);
  ready = files.data.every((f) => f.status === "completed");
  if (!ready) await new Promise((r) => setTimeout(r, 5000));
}

// 6. Pronto para consultas
```