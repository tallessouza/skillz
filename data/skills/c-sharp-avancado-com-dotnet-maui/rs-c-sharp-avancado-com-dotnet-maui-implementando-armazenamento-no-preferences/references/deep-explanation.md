# Deep Explanation: Armazenamento com Preferences no .NET MAUI

## Por que Preferences usa chave-valor sem excecoes

O instrutor (Edson) enfatiza que tanto Preferences quanto SecureStorage compartilham o mesmo principio: chave-valor. O framework gerencia tudo por baixo dos panos:

- Se a chave nao existe, ele cria automaticamente
- Se a chave ja existe, ele substitui o valor
- Nenhuma excecao e lancada em nenhum cenario

Isso elimina a necessidade de try-catch ao redor de operacoes de storage. O segundo parametro do `Get` (valor default) e a forma do framework te proteger: ao inves de lancar excecao quando a chave nao existe, ele retorna o default que voce especificou.

## Por que usar records ao inves de variaveis soltas

O instrutor faz uma analogia clara: "Imagina ter um Get aqui so para pegar o ID, ter um Get so para pegar o nome. Nao, vamos concentrar aqui, agrupar dentro de um record."

Records em C# sao:
- **Imutaveis por design** — uma vez criados, nao mudam
- **Value-based equality** — dois records com mesmos valores sao iguais
- **Sintaxe concisa** — `record User(Guid Id, string Name);` substitui uma classe inteira

A escolha de records ao inves de classes e deliberada: dados de storage sao snapshots imutaveis. Voce le, cria um novo record, usa. Nao faz sentido ter um objeto mutavel aqui.

## O problema do namespace conflitante

O instrutor encontrou um problema pratico: ele criou uma pasta chamada `Preference` no projeto, e o C# interpretava `Preferences` como referencia ao namespace da pasta, nao a classe do .NET MAUI. A solucao: usar o caminho completo `Microsoft.Maui.Storage.Preferences.Default`.

O mesmo aconteceu com o record `User` e a pasta `User` — foi necessario referenciar como `Models.ValueObjects.User`.

**Licao:** ao nomear pastas no projeto, evite nomes que conflitem com classes do framework. Se conflitar, use o fully qualified name.

## Por que Guid precisa ser armazenado como string

O instrutor explica que Preferences suporta apenas tipos especificos: `string, int, bool, long, double, float, DateTime`. Guid nao esta na lista. Tentar armazenar um Guid diretamente nao lanca excecao imediatamente, mas causa problemas na recuperacao.

Solucao: `guid.ToString()` para salvar, `Guid.Parse(string)` para recuperar.

## Clear vs Remove: quando usar cada um

- **Clear()** — apaga TODAS as chaves e valores. Ideal para logout, onde nenhum dado deve permanecer.
- **Remove(key)** — apaga uma chave especifica. Ideal para cenarios onde voce precisa limpar um dado mas manter outros.

O instrutor escolheu Clear para o cenario de logout porque "logout e logout, e a pessoa que deslogar do aplicativo" — nao faz sentido manter dados residuais.

## Por que interface ao inves de usar Preferences direto

O instrutor menciona explicitamente: "quando a gente precisar fazer teste de unidade, e mais facil a gente ter um mock aqui de uma interface." O `IPreferences` do .NET MAUI ja e uma interface, mas criar sua propria `IUserStorage` adiciona uma camada de abstracao de dominio — voce trabalha com `User` e `Token`, nao com strings e chaves.

## Nao precisa configuracao por plataforma

O instrutor confirma: "Precisa fazer alguma coisa em especifico para Android, iOS ou Windows? Nao. Aqui no caso do Preferences nao precisa." Isso e diferente do SecureStorage, que tem configuracoes especificas por plataforma.