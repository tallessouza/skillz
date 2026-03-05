# Deep Explanation: Assertions em Testes de Integracao com JsonDocument

## Por que NAO deserializar em testes de integracao

O instrutor explica um ponto sutil e critico: quando voce deserializa a resposta da API para um DTO (`ReadFromJsonAsync<ResponseUserJson>()`), voce esta **assumindo** que a deserializacao esta correta. Mas isso nao e o que voce esta testando.

O problema concreto: imagine que a API devolve uma resposta parcial (faltando o campo `name`). Se voce deserializa para o DTO, o campo `name` recebe `null` (valor default de string). Seu teste verifica "name existe?" — sim, existe, porque o objeto foi criado pela deserializacao. O teste passa, mas esta errado.

Com JsonDocument, se a API nao devolver `name`, `GetProperty("name")` lanca uma excecao. O teste falha — que e o comportamento correto.

**Principio:** "Eu quero ter o meu teste orientado ao que a API me devolveu, nao orientado a deserializacao."

## ReadAsStreamAsync vs ReadAsStringAsync

O instrutor enfatiza que `ReadAsStringAsync` e um erro comum que ele ve em muitos codigos. O problema e que ele converte todo o body da resposta em uma string na memoria. `ReadAsStreamAsync` e muito mais performatico porque trabalha com streams, processando dados sob demanda.

## O papel do `using`

Quando voce declara `using var responseBody = ...`, esta dizendo ao runtime: "quando esse metodo acabar, pode liberar essa variavel da memoria." Em testes, o body da resposta nao precisa ficar na memoria apos o teste terminar. O `using` garante essa limpeza automatica.

## Navegacao de propriedades aninhadas

O JsonDocument usa `RootElement` como ponto de entrada. Para objetos aninhados como `tokens.accessToken`, voce encadeia chamadas `GetProperty`:

```
document.RootElement.GetProperty("tokens").GetProperty("accessToken")
```

Cada `GetProperty` navega um nivel mais fundo no JSON.

## Comportamento de falha

O instrutor destaca dois cenarios de falha automatica:
1. **Propriedade nao existe:** `GetProperty("id")` lanca excecao → teste falha
2. **Tipo incompativel:** API devolve `id: "123"` mas voce chama `GetGuid()` → excecao → teste falha

Isso torna os testes mais robustos sem precisar de assertions explicitos para cada cenario de erro.

## CamelCase nas propriedades JSON

As propriedades no JSON seguem camelCase: `id`, `name`, `tokens`, `accessToken` (A minusculo, T maiusculo). Isso e diferente do C# onde as propriedades usam PascalCase. E um ponto de atencao ao escrever `GetProperty("accessToken")` e nao `GetProperty("AccessToken")`.