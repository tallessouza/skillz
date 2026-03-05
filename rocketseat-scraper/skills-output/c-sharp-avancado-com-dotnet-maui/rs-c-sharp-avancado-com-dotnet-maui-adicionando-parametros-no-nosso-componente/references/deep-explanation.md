# Deep Explanation: BindableProperty em Componentes .NET MAUI

## Por que propriedades simples nao funcionam

O instrutor demonstra que mesmo criando propriedades C# normais (`public string Title { get; set; }`) e usando no XAML (`Title="Nome"`), os valores **nao sao propagados**. Isso acontece porque o sistema de binding do .NET MAUI precisa de BindableProperties para conectar valores entre a pagina pai e o componente filho. Propriedades simples sao "ilhas" — existem na classe mas o framework nao sabe que precisa observa-las.

## Os 4 parametros de BindableProperty.Create

1. **propertyName** — O nome exibido da propriedade. Usar `nameof(Title)` converte o identificador C# para string `"Title"`. Vantagem: se renomear a propriedade (F2), o nameof acompanha automaticamente.

2. **returnType** — O tipo do valor que a propriedade armazena. `typeof(string)` para texto, `typeof(Keyboard)` para o layout de teclado. Deve corresponder exatamente ao tipo da propriedade publica.

3. **declaringType** — A classe que contem essa propriedade. O instrutor confessa honestamente que nunca investigou a fundo por que o framework precisa dessa informacao, mas e obrigatorio passar. E sempre `typeof(SuaClasseDeComponente)`.

4. **defaultValue** — O valor padrao quando nenhum valor e passado no XAML. Cada tipo tem seu default adequado: `string.Empty` para strings, `Keyboard.Default` para Keyboard (que usa o teclado padrao do dispositivo).

## Por que static readonly

A BindableProperty e **estatica** porque pertence ao tipo (classe), nao a instancia. E **readonly** porque uma vez definida, nao pode ser reatribuida — ela e configurada apenas na declaracao. Isso garante que a definicao da propriedade e imutavel e compartilhada entre todas as instancias do componente.

## O padrao GetValue/SetValue

O `GetValue` e `SetValue` vem da classe `ContentView` (herdada pelo componente). Eles sao o mecanismo que o MAUI usa para:
- Notificar o sistema de binding quando um valor muda
- Permitir animacoes e estilos baseados em propriedades
- Suportar heranca de valores na arvore visual

O `GetValue` retorna `object`, por isso o cast explicito `(string)` e necessario. O `SetValue` recebe dois parametros: qual BindableProperty atualizar e qual valor (`value` — palavra-chave C# que representa o valor sendo atribuido no setter).

## Tecnica para descobrir tipos

O instrutor ensina um truque pratico: se voce nao sabe o tipo de uma propriedade do MAUI (como Keyboard), va ate um elemento XAML (Entry), digite a propriedade, clique com botao direito → "Go to Definition". Isso abre a classe fonte onde voce ve o namespace e tipo correto (`Microsoft.Maui.Keyboard`).

## Sobre o arrow syntax vs bloco

O instrutor mostra que `get =>` e `set =>` sao abreviacoes para uma unica linha. Se precisar de logica condicional (if/else), use a forma com chaves e `return` explicito. Para BindableProperties simples, o arrow syntax e suficiente e mais limpo.