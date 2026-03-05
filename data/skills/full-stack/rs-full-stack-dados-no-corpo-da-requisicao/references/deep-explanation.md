# Deep Explanation: Dados no Corpo da Requisição

## Por que o Express não faz parse do body automaticamente?

Diferente do que muitos iniciantes esperam, o Express **não assume** que os dados enviados na requisição estão em JSON. Isso porque existem múltiplos formatos de representação de dados:

### JSON vs XML

**JSON** — formato de objeto com chave-valor:
```json
{
  "endereco": {
    "cep": "30130-000",
    "cidade": "Belo Horizonte"
  }
}
```

**XML** — formato com tags de abertura e fechamento (similar ao HTML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<endereco>
  <cep>30130-000</cep>
  <cidade>Belo Horizonte</cidade>
</endereco>
```

Ambos são padrões amplamente usados no mercado para troca de dados entre cliente e servidor. Como o Express não sabe qual você vai usar, ele espera que você **declare explicitamente** o formato via middleware.

## O que `express.json()` faz por baixo

Quando você usou Node puro (sem Express), precisou:
1. Escutar os chunks da requisição manualmente
2. Remontar os pedaços em uma string completa
3. Fazer `JSON.parse()` no resultado
4. Adicionar o objeto parseado em `req.body`

O middleware `express.json()` faz **tudo isso automaticamente**. Ele:
- Intercepta requisições com `Content-Type: application/json`
- Lê os chunks do stream
- Faz parse do JSON
- Disponibiliza o resultado em `req.body`

## Por que `req.body` é `undefined` sem o middleware

Sem `express.json()`, o Express simplesmente não processa o corpo da requisição. O `req.body` nem existe como propriedade populada — ele é `undefined`. Ao tentar desestruturar (`const { name } = req.body`), JavaScript lança um TypeError porque não se pode desestruturar `undefined`.

## Analogia do instrutor

O Express é como um funcionário dos correios: ele recebe o pacote (requisição), mas precisa saber se o conteúdo é uma carta (JSON), uma caixa (XML), ou outro formato para saber como abrir e interpretar. Sem essa instrução, ele simplesmente entrega o pacote fechado.

## Testando com Insomnia

Navegadores só fazem GET por padrão ao acessar URLs. Para testar POST:
1. Abra o Insomnia
2. Crie uma Request Collection (ex: "API REST")
3. Crie uma nova HTTP Request
4. Mude o método para POST
5. Configure a URL (ex: `http://localhost:3333/products`)
6. No Body, selecione JSON
7. Escreva o JSON com os dados
8. Clique Send

O Insomnia mostra o status code da resposta (404 se a rota não existe, 200 se funcionou) e o corpo da resposta.