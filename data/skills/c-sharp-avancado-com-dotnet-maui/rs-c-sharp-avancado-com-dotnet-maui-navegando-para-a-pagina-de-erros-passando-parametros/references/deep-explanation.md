# Deep Explanation: Navegacao com Parametros no .NET MAUI

## Por que IQueryAttributable?

No .NET MAUI com Shell navigation, a interface `IQueryAttributable` e o mecanismo oficial para ViewModels receberem dados de navegacao. O metodo `ApplyQueryAttributes` e chamado **automaticamente** pelo framework — voce nao precisa invoca-lo manualmente. Basta implementar a interface na ViewModel destino.

## O dicionario de parametros

A navegacao Shell usa `Dictionary<string, object>` porque:
- **Chave string**: identifica cada parametro pelo nome
- **Valor object**: aceita qualquer tipo (int, string, List, bool, etc.)
- Voce pode passar **quantos parametros quiser** em uma unica navegacao

O instrutor enfatiza: "voce pode estar enviando na navegacao quantos parametros voce desejar, so que todos esses parametros vao estar no formato de chave que e uma string, valor que e um object."

## Cast seguro vs cast direto

Duas formas de converter `object` para o tipo desejado:

```csharp
// Cast direto — PERIGOSO
var errors = (List<string>)query["errors"];
// Se o valor NAO for List<string>, lanca InvalidCastException

// Cast seguro com 'as' — RECOMENDADO
var errors = query["errors"] as List<string>;
// Se o valor NAO for List<string>, retorna null (sem excecao)
```

O instrutor explica: "os dois funcionam, e so uma protecao extra. Voce nao vai ter uma excecao, voce vai ter nulo se ele nao conseguir fazer o cast."

## Overload (sobrecarga) de metodos

O conceito de overload e ter **multiplas funcoes com o mesmo nome** mas **parametros diferentes**. O compilador C# sabe qual chamar baseado nos argumentos passados.

Regras de overload:
- Mesmo nome de metodo
- Mesmo tipo de retorno
- **Parametros diferentes** (quantidade ou tipo)
- NAO funciona se voce so mudar o retorno mantendo parametros iguais

O instrutor demonstra: "ele e espertinho — se voce chama GoToAsync passando apenas o state, chama uma versao. Se passa state e um dicionario, chama a outra."

**Armadilha comum**: ao adicionar overload em uma classe que implementa interface, voce DEVE adicionar a assinatura na interface tambem. Caso contrario, o codigo que usa a interface nao enxerga o novo metodo.

## ObservableCollection a partir de lista

```csharp
// Forma verbosa (desnecessaria)
ErrorsList = new ObservableCollection<string>();
foreach (var error in errors)
{
    ErrorsList.Add(error);
}

// Forma direta (recomendada)
ErrorsList = new ObservableCollection<string>(errors);
```

O construtor de `ObservableCollection<T>` aceita uma `IEnumerable<T>` e preenche automaticamente.

## Sintaxe de collection expression do C# moderno

O Visual Studio pode sugerir sintaxe como `[..errors]` para inicializar colecoes. O instrutor optou por nao usar: "eu acho mais confuso, e estranha a sintaxe, eu nao me acostumei ainda com ela. Eu bato o olho e ja entendo o que esta acontecendo."

Ambas funcionam — use a que o time entende melhor.

## Proximos passos mencionados pelo instrutor

1. **Extrair constantes** para chaves de dicionario (evitar hardcode de `"errors"` espalhado)
2. **Funcao auxiliar** para encapsular a criacao do dicionario de navegacao
3. **Corrigir layout** quando mensagens de erro longas quebram a visualizacao na tela