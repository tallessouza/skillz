# Deep Explanation: Angular Pipes

## O que sao pipes

Pipes sao funcoes que transformam um valor para exibicao no template. Recebem um parametro, processam, e retornam um novo valor — sem alterar o original.

O instrutor enfatiza: "ao inves de criar uma funcao dentro da classe do meu componente que vai fazer essa formatacao, eu posso utilizar um pipe do Angular que faz essa transformacao de forma automatica e performatica."

## Por que pipes existem — a conexao com Change Detection

Este e o ponto mais importante da aula. O Angular tem um mecanismo chamado **Change Detection** que verifica mudancas no estado da aplicacao. Quando ocorre um ciclo de change detection:

- **Metodos referenciados no template**: sao reexecutados TODA vez, mesmo que nada tenha mudado
- **Pipes puros**: so reexecutam quando o parametro muda

O instrutor destaca: "isso pode ser um baita problema de performance, principalmente quando a gente estiver lidando com listas grandes de objetos fazendo um ngFor."

### Pipes puros vs impuros

- **Puros** (default): so executam quando o valor do parametro muda. Todos os built-in pipes sao puros.
- **Impuros**: executam a cada change detection (comportamento similar a metodos). Serao vistos em aulas futuras.

## Imutabilidade em pipes customizados

O instrutor faz um alerta critico: quando voce cria pipes personalizados, pode receber instancias de objetos ou arrays como parametro. Se voce alterar diretamente essa instancia dentro do pipe, causa problemas de imutabilidade — "muitos e muitos bugs chatos de encontrar."

A solucao: sempre clonar o objeto recebido, manipular o clone, e retornar o clone. Nunca alterar a instancia original.

## Precedencia do operador pipe

O operador `|` (pipe) tem precedencia MAIOR que o operador ternario. Isso significa:

```html
<!-- ERRADO: pipe captura apenas 'denied' -->
{{ isAdmin ? 'access granted' : 'access denied' | uppercase }}
<!-- Angular interpreta como: isAdmin ? 'access granted' : ('access denied' | uppercase) -->

<!-- CORRETO: parenteses forcam ternario primeiro -->
{{ (isAdmin ? 'access granted' : 'access denied') | uppercase }}
```

Porem, com concatenacao de strings, nao ha problema — a concatenacao executa primeiro naturalmente:

```html
{{ firstName + ' ' + lastName | uppercase }}
<!-- Concatena primeiro, depois aplica uppercase no resultado -->
```

## Nomenclatura de pipes

- Classe: `CurrencyPipe`, `UpperCasePipe` (PascalCase com sufixo Pipe)
- No template: `currency`, `uppercase` (apenas primeiro nome, lowercase)
- Pipes customizados seguem o mesmo padrao: classe `MeuPipe`, template `meu`

## Built-in pipes disponiveis

O Angular oferece: `AsyncPipe`, `CurrencyPipe`, `DatePipe`, `DecimalPipe`, `UpperCasePipe`, `LowerCasePipe`, `TitleCasePipe`, entre outros. Documentacao completa em angular.dev > Docs > Templates > Pipes.