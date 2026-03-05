# Deep Explanation: Manipulando Valor do Input com Regex

## Evento `input` vs `submit`

O instrutor faz uma distincao importante entre dois eventos:

### Evento `input`
- Dispara **a cada caractere** digitado ou removido
- Captura o **valor completo** do campo, nao apenas a tecla pressionada
- Util para feedback em tempo real (ex: mostrar contagem de caracteres, validacao instantanea)
- Quando o usuario apaga texto, tambem dispara — qualquer modificacao no campo aciona o evento

### Evento `submit`
- Dispara quando o formulario e enviado (botao ou Enter)
- **Obrigatorio** usar `event.preventDefault()` para evitar recarregamento da pagina
- Momento ideal para validacao final e processamento dos dados

### Insight do instrutor
O instrutor destaca que o evento `input` pega o **valor acumulado** do campo, nao letra por letra. Ao digitar "R-O-D", o evento retorna "R", "RO", "ROD" — sempre o valor completo atual.

## Tres metodos de regex explicados

### `match()` — Encontrar ocorrencias
- Chamado no **string**: `value.match(regex)`
- Retorna **array** com todos os trechos que atendem o padrao
- Retorna **null** quando nao encontra nada (campo vazio ou sem match)
- Com flag `g`, retorna todas as ocorrencias; sem `g`, retorna apenas a primeira com detalhes

### `test()` — Validar existencia
- Chamado na **regex**: `regex.test(value)`
- Retorna `true` ou `false`
- Ideal para fluxos condicionais (`if/else`)
- O instrutor mostra que `!regex.test(value)` inverte a logica — util para "se NAO atende o padrao, mostrar erro"

### `replace()` — Substituir ou remover
- Chamado no **string**: `value.replace(regex, substituicao)`
- Quando substituicao e `""` (string vazia), **remove** os trechos encontrados
- Quando substituicao e um caractere (ex: `"X"`), **substitui** cada ocorrencia
- Diferenca crucial: `""` (remover) nao e o mesmo que `" "` (substituir por espaco)

## Padrao regex usado na aula: `/\D+/g`

- `\D` — qualquer caractere que **nao** e digito (equivale a `[^0-9]`)
- `+` — uma ou mais ocorrencias em sequencia (ex: "abc" e capturado como um bloco, nao "a", "b", "c" separados)
- `g` — flag global, captura **todas** as ocorrencias na string

## Fluxo de validacao condicional

O instrutor constroi um padrao de validacao pratico:

```
usuario digita → submit → testa regex → atende padrao?
  SIM → prosseguir (console.log, salvar, etc)
  NAO → alert com mensagem de erro
```

Esse padrao simula validacao real: se o campo esta correto, envia pro banco/faz cadastro. Se nao atende, devolve mensagem para o usuario.

### Observacao importante do instrutor
Se o usuario digita "Rodrigo3", o `test()` com `/\D+/g` retorna `true` porque **encontrou texto**. O numero 3 esta la, mas o padrao so procura nao-digitos — e encontrou. Isso significa que a validacao depende de **como** voce define o padrao e **o que** voce quer verificar.

## Dica de DevTools

O instrutor mostra que o botao de limpar console no DevTools evita precisar recarregar a pagina inteira para limpar os logs.