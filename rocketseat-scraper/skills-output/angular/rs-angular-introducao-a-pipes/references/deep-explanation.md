# Deep Explanation: Angular Pipes

## Por que Pipes existem

O instrutor enfatiza tres motivacoes principais para usar Pipes:

1. **Performance no template** — Quando voce usa um metodo no template (`{{ formatDate(data) }}`), Angular re-executa esse metodo a cada ciclo de change detection. Com um pipe puro, Angular cacheia o resultado e so recalcula quando a referencia do input muda. Em componentes com muitos bindings, essa diferenca e significativa.

2. **Menos codigo na classe do componente** — Sem pipes, a classe acumula metodos de formatacao que nao tem nada a ver com logica de negocio. Pipes movem essa responsabilidade para o template, onde ela pertence.

3. **Separacao de responsabilidades organizada** — Cada pipe tem uma unica funcao de transformacao. Isso segue o principio de responsabilidade unica e torna o codigo mais testavel e reutilizavel.

## Locale e regionalizacao

Uma parte importante que o instrutor destaca e a configuracao de locale (regiao). Pipes como `currency`, `percent` e `date` alteram sua formatacao baseado na regiao configurada:

- **Brasil (pt-BR):** R$ 1.000,00 / 50,5% / 28/02/2026
- **EUA (en-US):** $1,000.00 / 50.5% / 02/28/2026

Isso e configurado via o injection token `LOCALE_ID` no Angular. O instrutor menciona que vai detalhar bastante essa parte, incluindo conceitos como:

- **Meridiano de Greenwich** — referencia para fusos horarios
- **UTC (Coordinated Universal Time)** — padrao usado em desenvolvimento de software para armazenar datas sem ambiguidade de fuso
- **Time zones** — o DatePipe pode formatar baseado no timezone do usuario

A recomendacao e: armazene datas em UTC no backend e use o DatePipe com timezone para exibir no formato local do usuario.

## Pipes puros vs impuros

- **Pipe puro (default):** Angular so re-executa a funcao `transform()` quando detecta uma mudanca na referencia do input (ou em valores primitivos, quando o valor muda). Isso significa que se voce faz `.push()` em um array, o pipe puro NAO re-executa, porque a referencia do array nao mudou.

- **Pipe impuro:** Re-executa a cada ciclo de change detection, independente de mudanca na referencia. Util para casos como o `AsyncPipe` (que precisa reagir a emissoes de Observable), mas perigoso para performance se usado sem necessidade.

## Catalogo completo de Pipes built-in

O instrutor lista todos os pipes que serao cobertos no modulo:

| Pipe | Categoria | Uso principal |
|------|-----------|---------------|
| SlicePipe | Manipulacao | Fatiar arrays e strings |
| LowerCasePipe | Texto | Converter para minusculas |
| UpperCasePipe | Texto | Converter para maiusculas |
| TitleCasePipe | Texto | Primeira letra maiuscula de cada palavra |
| JsonPipe | Debug | Exibir objeto como JSON no template |
| PercentPipe | Formatacao numerica | Exibir numeros como porcentagem |
| CurrencyPipe | Formatacao numerica | Exibir valores monetarios |
| DatePipe | Formatacao de data | Formatar datas com locale e timezone |
| DecimalPipe | Formatacao numerica | Formatar numeros decimais |
| KeyValuePipe | Iteracao | Iterar sobre objetos/Maps no template |
| AsyncPipe | Reatividade | Resolver Observables/Promises no template |
| PluralPipe | Texto condicional | Pluralizacao baseada em quantidade |
| SelectPipe | Texto condicional | Selecao de texto por chave |

## Pipes customizados

Alem dos built-in, o instrutor vai ensinar a criar pipes customizados. A motivacao principal e quando nenhum pipe nativo atende a necessidade de transformacao. Um pipe customizado e uma classe com `@Pipe()` decorator que implementa `PipeTransform`.