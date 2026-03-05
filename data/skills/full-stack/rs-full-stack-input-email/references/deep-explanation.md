# Deep Explanation: Input Email

## Por que usar type="email" em vez de type="text"

O navegador faz validacao automatica do formato de email quando o tipo e `email`. Isso significa que sem nenhum atributo extra, o browser ja verifica se o valor contem `@` e um dominio. Nao e uma validacao perfeita (nao verifica se o email existe), mas elimina erros obvios como digitar apenas "abc".

## Como o pattern funciona

O atributo `pattern` aceita uma expressao regular (regex) que e avaliada caracter por caracter:

- `.` — qualquer caracter
- `+` — uma ou mais vezes o caracter anterior
- `\.` — ponto literal (precisa da barra invertida para escapar)
- Texto literal como `skillz` — exatamente essa sequencia

Exemplo: `.+@skillz\.com` significa:
1. `.+` — um ou mais caracteres quaisquer (a parte antes do @)
2. `@` — literal
3. `skillz` — exatamente "skillz"
4. `\.` — ponto literal
5. `com` — exatamente "com"

Isso restringe o campo para aceitar apenas emails do dominio `@skillz.com`.

## A importancia do title com pattern

Quando o pattern falha na validacao, o navegador mostra uma mensagem generica como "Please match the requested format". O atributo `title` substitui essa mensagem por algo util para o usuario, como "Apenas emails @skillz.com". Sem o `title`, o usuario nao sabe o que esta errado.

## Encoding de URL e caracteres especiais

Quando o formulario e submetido via GET, os valores vao na URL. Caracteres especiais como `@` e `,` sao transformados em codigos como `%40` e `%2C`. Isso respeita o protocolo HTTP e garante compatibilidade entre navegadores. Por exemplo:

```
?mail=abc%40a.com%2Cabc%40b.com
```

Isso e `abc@a.com,abc@b.com` codificado.

## minlength vs maxlength — comportamento diferente

- **minlength**: o navegador permite digitar qualquer quantidade, mas mostra erro no submit se for menor que o minimo. A mensagem indica quantos caracteres faltam.
- **maxlength**: o navegador **bloqueia a digitacao** alem do limite. O usuario simplesmente nao consegue digitar mais caracteres. Nao mostra mensagem de erro — apenas para de aceitar input.

Essa diferenca de comportamento e importante: minlength e validacao no submit, maxlength e restricao em tempo real.

## Validacao HTML vs JavaScript

A validacao HTML nativa e a primeira linha de defesa. Vantagens:
- Zero JavaScript necessario
- Funciona mesmo com JS desabilitado
- Mensagens nativas do navegador (acessiveis, traduzidas)
- Menos codigo para manter

Limitacoes que requerem JS:
- Validacao assincrona (verificar se email ja existe no banco)
- Mensagens de erro customizadas com estilo proprio
- Validacao condicional (campo X obrigatorio se campo Y preenchido)
- Validacao em tempo real (enquanto digita)

A recomendacao e: use HTML nativo para o basico, JS para o avancado.