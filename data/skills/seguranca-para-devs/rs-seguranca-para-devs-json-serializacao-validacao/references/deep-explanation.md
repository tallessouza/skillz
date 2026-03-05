# Deep Explanation: JSON, Serialização e Validação

## Por que JSON e não serializadores nativos?

Serializar é transformar um objeto da linguagem em um formato que pode ser salvo em arquivo ou transmitido pela rede. Cada linguagem tem seus serializadores nativos (Python: pickle, PHP: serialize, Java: ObjectInputStream), mas esses serializadores são perigosos para dados externos porque serializam **tudo**: propriedades, métodos, classes, herança.

O problema fundamental: se um atacante consegue modificar o dado serializado (e se o dado transita pela rede, ele consegue), ele pode alterar o nome de uma classe, forçar a instanciação de outro objeto, ou executar código arbitrário quando o servidor desserializar.

JSON resolve isso por design: ele é um **subset** do JavaScript que só suporta propriedades — objetos, arrays, números, strings, booleanos e null. Não há como serializar um método, uma classe ou herança em JSON. Se você tem a necessidade de serializar algo que não cabe em JSON, o instrutor é enfático: **tem algo errado com sua arquitetura ou modelagem**.

## A armadilha do eval() e new Function()

JSON significa "JavaScript Object Notation" — literalmente a sintaxe de objetos JavaScript. Por isso, JSON pode ser executado como JavaScript válido. Isso cria uma tentação:

```javascript
// "Funciona" mas é catastroficamente inseguro
const data = eval('(' + jsonString + ')')
const data = new Function('return ' + jsonString)()
```

Ambos funcionam para parsing de JSON, mas permitem execução de código arbitrário. Se o input contém código malicioso em vez de JSON puro, eval e new Function vão executá-lo — seja no navegador de outro usuário (XSS) ou no servidor Node.js (RCE).

A regra do instrutor é absoluta: **se você precisou usar eval ou new Function para qualquer coisa, você tem um problema de segurança**. Esses recursos existem para ambientes muito controlados, não para aplicações web.

## Não escreva seu próprio parser

O instrutor enfatiza: a menos que você esteja criando uma nova linguagem de programação, não existe razão para escrever seu próprio parser/serializador JSON. O parser nativo da sua linguagem foi testado por uma comunidade inteira e é muito melhor do que qualquer implementação individual.

## Validação de schema: o exemplo do prototype pollution

O instrutor demonstra com FastAPI: um endpoint que recebe `dict` (dicionário genérico) aceita absolutamente qualquer propriedade. Um atacante pode:

1. Injetar propriedades extras que serão salvas no banco
2. Tentar prototype pollution (especialmente perigoso com MongoDB)
3. Enviar tipos de dados inesperados

A solução é usar modelos tipados (BaseModel no Pydantic, Zod no TypeScript, etc.) que:
- **Ignoram** propriedades desconhecidas automaticamente
- **Rejeitam** tipos de dados inválidos com erro de validação
- **Documentam** a API automaticamente (Swagger/OpenAPI)

## Segurança em camadas

O conceito mais importante da aula: mesmo que suas regras de negócio validem os dados, mesmo que seu banco relacional com schema forte rejeite dados inválidos, **coloque validação na camada de entrada**. Cada camada de validação diminui a superfície de ataque — o espaço que o hacker tem para trabalhar fica cada vez menor.

A analogia implícita: é como segurança física com múltiplas portas trancadas. Mesmo que a última porta seja forte, trancar as anteriores reduz drasticamente o risco.

## Ganho duplo: segurança + usabilidade

O instrutor destaca um benefício colateral importante: ao tipar seus endpoints com modelos, você não só ganha segurança como também ganha documentação automática. O Swagger da API passa a mostrar exatamente quais propriedades são esperadas, com seus tipos. A API fica melhor em todos os aspectos.

## Aplicação universal

O instrutor enfatiza que isso não vale apenas para APIs REST. Vale para **qualquer** recebimento de entrada do usuário: métodos Ajax em aplicações tradicionais (MPA/SPA), WebSockets, qualquer ponto onde dados externos entram no sistema. Sempre valide tanto o que recebe quanto o que retorna.