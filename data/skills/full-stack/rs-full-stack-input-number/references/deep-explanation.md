# Deep Explanation: Input Number no HTML

## Por que definir min e max importa visualmente

O instrutor demonstra que sem min/max o campo fica "grande" — o browser renderiza o input com largura padrão genérica. Ao adicionar min e max, o browser ajusta o tamanho do campo automaticamente, pois já sabe o range de valores possíveis. Isso é uma otimização visual nativa que muitos desenvolvedores desconhecem.

## Comportamento de validação: submit vs digitação

Ponto crucial da aula: o usuário **pode digitar manualmente** qualquer valor, mesmo fora do range. Por exemplo, com `max="18"`, o usuário consegue digitar "40" no campo. A validação só acontece no momento do **submit do formulário**. O browser então bloqueia o envio e exibe uma mensagem como "O valor deve ser menor ou igual a 18".

Isso significa que min/max são **validações de formulário**, não **restrições de input**. Para bloquear a digitação em tempo real, seria necessário JavaScript — mas a validação nativa do HTML já cobre o caso mais comum.

## Step: controlando os "passos"

O atributo `step` define o incremento quando o usuário usa as setas (up/down) do campo numérico. Com `step="2"` e `min="0"`, os valores nas setas serão: 0, 2, 4, 6, 8... até o max.

O step também afeta a validação: se step="2" e min="0", o valor "3" será considerado inválido no submit, porque não está no "passo" correto.

## Required vs min/max

O instrutor destaca que required e min/max são **independentes**:
- **min/max sem required**: o campo pode ser enviado vazio (válido), mas se preenchido deve respeitar o range
- **required sem min/max**: o campo deve ser preenchido, mas aceita qualquer número
- **required + min/max**: deve ser preenchido E respeitar o range

## Interface nativa

O `type="number"` gera automaticamente uma interface com setas (spinner) para incrementar/decrementar o valor. Essa interface varia entre browsers mas o comportamento é consistente.