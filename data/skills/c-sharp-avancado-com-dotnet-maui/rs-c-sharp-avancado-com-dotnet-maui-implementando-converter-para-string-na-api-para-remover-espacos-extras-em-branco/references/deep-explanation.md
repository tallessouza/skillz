# Deep Explanation: String Converter para APIs C#/.NET

## Por que a API e o porto seguro

O instrutor Ellison enfatiza repetidamente: **nunca confie no front-end**. A API e a ultima camada antes do banco de dados. Se o front-end tratar espacos, otimo — e um "plus". Mas a obrigacao e da API.

Exemplo real do Android: quando o usuario aceita uma sugestao do dicionario do teclado, o sistema insere um espaco em branco extra no final da palavra automaticamente. O usuario nem percebe, mas esse espaco vai parar no banco de dados se a API nao tratar.

## Como funciona o JsonConverter<string>

O `JsonConverter<T>` e uma classe abstrata do `System.Text.Json`. Ao herdar dela com `JsonConverter<string>`, voce intercepta **toda** serializacao/deserializacao de strings na API.

### Dois metodos obrigatorios:

- **Read**: executado quando a API **recebe** um JSON (request body → objeto C#). E aqui que fazemos a sanitizacao.
- **Write**: executado quando a API **devolve** um JSON (objeto C# → response body). Normalmente apenas repassa o valor.

### Fluxo de execucao:

```
Request HTTP → JSON body → StringConverter.Read() → Controller endpoint
Controller retorno → StringConverter.Write() → JSON response → Cliente
```

O converter executa **antes** do controller. Quando o breakpoint bate no endpoint, os valores ja estao limpos.

## Trim vs Regex — cada um resolve metade

### Trim()
Remove espacos apenas do **inicio e fim** do texto:
- `"  Ellison  "` → `"Ellison"`
- `"Ellison     Arley"` → `"Ellison     Arley"` (nao mexe no meio!)

### Regex `\s+`
O padrao `\s+` significa: "qualquer sequencia de um ou mais caracteres de espaco em branco (incluindo quebras de linha)". O `Replace` substitui cada ocorrencia por um unico espaco:
- `"Ellison     Arley"` → `"Ellison Arley"`

### Combinando ambos:
```
"  Ellison     Arley  "
    → Regex: " Ellison Arley " (espacos internos colapsados)
    → Trim: "Ellison Arley" (espacos das pontas removidos)
```

A ordem no codigo final (Regex primeiro, Trim depois) garante cobertura completa.

## Sobre Regex e a "brincadeira" do instrutor

O instrutor menciona o meme da comunidade: "regex e muito util e poderoso, mas ninguem entende". A expressao usada aqui (`\s+`) e simples:
- `\s` = qualquer whitespace (espaco, tab, quebra de linha)
- `+` = um ou mais em sequencia

Para padroes mais complexos, existem tradutores de regex online.

## GeneratedRegex — otimizacao do compilador

O Visual Studio sugere converter `Regex.Replace()` inline para `[GeneratedRegex]`, que compila a expressao regular em tempo de build. Isso evita a recompilacao do padrao regex a cada request, melhorando performance.

A classe precisa ser `partial` para que o source generator possa injetar o codigo compilado.

## Extensibilidade do Write

O instrutor demonstra que o metodo Write pode ser customizado. Exemplo: `.ToUpper()` faria todas as respostas string da API serem devolvidas em maiusculo. Mas para o caso de sanitizacao de entrada, Write apenas repassa o valor.

## Estrutura de pastas

O converter fica em uma pasta `Converters` (plural, porque podem existir multiplos) dentro do projeto da API:
```
PlanShare.Api/
├── Converters/
│   └── StringConverter.cs
├── Controllers/
├── Program.cs
```