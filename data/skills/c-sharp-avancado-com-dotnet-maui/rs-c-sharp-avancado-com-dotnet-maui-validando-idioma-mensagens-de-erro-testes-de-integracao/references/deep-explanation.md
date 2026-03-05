# Deep Explanation: Validacao de Idioma em Testes de Integracao

## Por que nao usar a propriedade direta do Resource?

Quando voce faz `ResourceMessageException.NameEmpty` dentro de um teste de integracao, o valor retornado depende do idioma da **maquina que executa o teste**, nao do idioma sendo testado. Se sua maquina esta em ingles, essa propriedade sempre retorna ingles, independente da cultura que voce enviou no header da requisicao.

A solucao e usar `ResourceManager.GetString("NameEmpty", new CultureInfo(culture))`, que explicitamente busca o valor para a cultura desejada.

## Como o .NET resolve arquivos de Resource

O .NET usa uma hierarquia de fallback:
- `ResourceMessageException.pt-BR.resx` → portugues brasileiro
- `ResourceMessageException.resx` → valor neutro (fallback para qualquer cultura sem arquivo especifico)

Se voce enviar espanhol, frances, japones — qualquer cultura sem arquivo `.resx` dedicado — o .NET cai no arquivo neutro. O instrutor escolheu ingles como neutro, mas voce pode inverter (neutro = portugues, criar `.en.resx` para ingles).

## O middleware CultureMiddleware

A API captura a cultura do header `Accept-Language` da requisicao HTTP. O middleware extrai esse valor e configura a thread para usar a cultura solicitada, fazendo com que os acessos aos arquivos de resource retornem valores no idioma correto. Isso acontece de forma transparente — basta trocar a cultura que o resource manager pega o arquivo correto.

## yield return — como funciona

O `yield return` nao encerra a funcao. Ele "pausa" a execucao, retorna o valor, e quando o consumidor pede o proximo item, a execucao continua de onde parou ate o proximo `yield return`. O xUnit entende isso e executa o teste uma vez para cada `yield return`.

## IEnumerable<object[]> — por que object[]?

Cada `yield return` retorna um array de objetos. Cada elemento do array corresponde a um parametro da funcao de teste, na ordem. Se seu teste recebe `(string culture, int number)`, o array deve ser `new object[] { "pt-BR", 7 }`. O tipo base `object` permite misturar tipos no mesmo array.

## ClassData vs InlineData vs MemberData

- **InlineData**: valores inline no atributo, bom para poucos casos simples
- **ClassData**: classe dedicada implementando `IEnumerable<object[]>`, bom para reutilizar dados entre testes
- **MemberData**: referencia um metodo/propriedade estatica, meio-termo

O instrutor recomenda ClassData quando os mesmos dados de cultura serao usados em multiplos testes (erro de nome vazio, erro de senha, erro de perfil, etc.), evitando espalhar InlineData em dezenas de metodos.