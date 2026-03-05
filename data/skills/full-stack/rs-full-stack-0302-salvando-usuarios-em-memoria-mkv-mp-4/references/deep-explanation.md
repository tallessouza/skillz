# Deep Explanation: Banco de Dados em Memória

## Por que uma classe e não um objeto simples?

O instrutor escolhe uma classe para representar o banco de dados porque:
1. **Encapsulamento** — os métodos `insert` e `select` abstraem a lógica de manipulação do objeto interno
2. **Instanciação controlada** — `new Database()` cria um espaço alocado na memória, e compartilhar essa referência garante que todas as rotas acessem os mesmos dados
3. **Extensibilidade** — novos métodos (update, delete) podem ser adicionados sem mudar a interface

## O problema da múltipla instanciação

O ponto central da aula é: se cada rota cria `new Database()`, cada uma terá seu próprio objeto `#database` em um endereço de memória diferente. Inserir dados numa instância não afeta a outra.

A solução é criar UMA instância no arquivo principal (server.js) e passar essa mesma referência para todas as rotas. Isso é um padrão simples de **dependency injection** — o banco é injetado nos controllers.

## Estrutura interna do objeto database

```javascript
// Após inserir 2 produtos, o objeto fica assim:
{
  products: [
    { name: "Computador", price: 5000 },
    { name: "Mouse", price: 20 }
  ]
}
```

Cada chave do objeto representa uma "tabela" ou "coleção". O valor é sempre um array de registros. Isso simula a estrutura de bancos NoSQL como MongoDB (coleções) ou bancos relacionais (tabelas com linhas).

## Por que verificar com Array.isArray?

Na primeira inserção de uma tabela que ainda não existe, `this.#database[table]` é `undefined`. Fazer `.push()` em `undefined` causa erro. A verificação garante:
- Se já é array → faz push do novo registro
- Se não existe → cria o array com o primeiro registro

## Parâmetros como objeto vs posicional

O instrutor destaca uma preferência prática: passar `{ request, response, database }` como objeto desestruturado em vez de `(request, response, database)` posicional. A razão é que com objeto, a ordem não importa — o controller pode desestruturar `{ database, request, response }` e funciona igual. Com parâmetros posicionais, trocar a ordem causa bugs silenciosos.

## Dados em memória são temporários — demonstração prática

O instrutor demonstra ao vivo: cadastra produtos, faz uma alteração qualquer no código (dispara o restart do servidor via watch mode), e ao listar novamente os produtos estão vazios. Isso prova que o objeto JavaScript vive apenas enquanto o processo Node.js está rodando.

Essa limitação é proposital nesta aula — serve como motivação para a próxima aula onde os dados serão persistidos em arquivo.

## Status 201 sem corpo

O instrutor retorna `201 Created` sem corpo na resposta de criação. Isso é uma convenção HTTP: o status code 201 já comunica que o recurso foi criado com sucesso. Não é necessário devolver o objeto criado (embora seja uma prática comum em APIs REST retornar o recurso com ID gerado).