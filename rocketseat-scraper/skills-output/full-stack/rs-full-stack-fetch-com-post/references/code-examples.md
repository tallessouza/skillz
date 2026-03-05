# Code Examples: Fetch com POST

## Exemplo 1: HTML do formulario

```html
<form>
  <input type="text" id="name" placeholder="Nome do produto" />
  <input type="text" id="price" placeholder="Preço do produto" />
  <button type="submit">Cadastrar</button>
</form>
```

O `type="submit"` no botao dispara o evento `submit` do formulario.

## Exemplo 2: Selecao dos elementos

```javascript
const productName = document.getElementById("name");
const productPrice = document.getElementById("price");
const form = document.getElementsByTagName("form")[0];
```

O instrutor renomeia `name` para `productName` e `price` para `productPrice` para maior clareza — nomes genericos como `name` conflitam com propriedades nativas.

## Exemplo 3: Event listener com preventDefault

```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // codigo de envio aqui
});
```

- `async` na funcao callback permite uso de `await`
- `event.preventDefault()` impede recarregamento da pagina

## Exemplo 4: Fetch POST completo da aula

```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch("http://localhost:3333/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      name: productName.value,
      price: productPrice.value,
    }),
  });

  await fetchProducts();
});
```

### Decomposicao:
1. `method: "POST"` — sem isso, fetch faz GET e ignora o body
2. `headers: { "Content-Type": "application/json" }` — API sabe interpretar como JSON
3. `JSON.stringify({...})` — serializa objeto para string
4. `productName.value` — `.value` extrai o texto digitado no input
5. `await` no fetch — espera cadastro completar
6. `await fetchProducts()` — recarrega lista so depois do cadastro

## Exemplo 5: Variacao sem recarregar lista

```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch("http://localhost:3333/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      name: productName.value,
      price: productPrice.value,
    }),
  });

  // Sem chamar fetchProducts — util quando nao precisa atualizar UI
  console.log("Produto cadastrado com sucesso");
});
```

## Exemplo 6: Variacao com captura de resposta

```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("http://localhost:3333/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(),
      name: productName.value,
      price: productPrice.value,
    }),
  });

  const createdProduct = await response.json();
  console.log("Produto criado:", createdProduct);

  await fetchProducts();
});
```

Neste caso, `response.json()` deserializa a resposta da API (que normalmente retorna o objeto criado).

## Exemplo 7: Variacao com tratamento de erro

```javascript
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const response = await fetch("http://localhost:3333/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: new Date().getTime().toString(),
        name: productName.value,
        price: productPrice.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao cadastrar: ${response.status}`);
    }

    await fetchProducts();
  } catch (error) {
    console.error("Falha no cadastro:", error);
  }
});
```

## Comparacao: GET vs POST com fetch

```javascript
// GET (padrao) — buscar dados
const response = await fetch("http://localhost:3333/products");
const products = await response.json();

// POST — enviar dados
await fetch("http://localhost:3333/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Mouse", price: 150 }),
});
```

GET: um parametro (URL), retorna dados.
POST: dois parametros (URL + config), envia dados.