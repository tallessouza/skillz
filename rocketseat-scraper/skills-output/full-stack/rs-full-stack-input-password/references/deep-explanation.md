# Deep Explanation: Input Password

## Por que nunca usar GET com senhas

O método GET passa os dados como query parameters na URL. Isso significa que:

1. **A senha aparece na barra de endereço** — qualquer pessoa olhando a tela vê a senha
2. **A senha fica no histórico do navegador** — acessível depois da sessão
3. **A senha pode ser logada por proxies e servidores** — URLs são frequentemente registradas em logs de acesso
4. **A URL pode ser compartilhada acidentalmente** — copiar/colar inclui a senha

O método POST envia os dados no body da requisição HTTP. A senha não aparece na URL, não fica no histórico, e só é acessível no backend que processa a requisição.

**Analogia do instrutor:** "A maneira GET vai passar os dados direto aqui na URL. A maneira POST vai esconder esses dados e eu consigo resgatar esses dados apenas lá no back-end, não tenho acesso mais no front-end."

## O estilo visual do password

O `type="password"` faz o navegador exibir caracteres mascarados (bolinhas ou asteriscos). O estilo exato depende do user agent (navegador/SO). Isso é puramente visual — não é criptografia.

## Conflitos entre pattern e minlength/maxlength

Este é um ponto sutil e importante que o instrutor demonstra na prática:

### O problema

Se você define:
- `minlength="8"` — o browser exige no mínimo 8 caracteres
- `pattern="[0-9a-fA-F]{4,8}"` — o regex aceita de 4 a 8 caracteres

O que acontece quando o usuário digita 5 caracteres válidos?
- O **pattern** aceita (está entre 4 e 8)
- O **minlength** rejeita (exige 8)
- Resultado: formulário não submete, mensagem confusa

### A solução

Alinhe os valores. Se quer exatamente 8 caracteres hexadecimais:
```html
pattern="[0-9a-fA-F]{8}" minlength="8" maxlength="8"
```

Se quer entre 8 e 12:
```html
pattern="[0-9a-fA-F]{8,12}" minlength="8" maxlength="12"
```

### Insight do instrutor

"Às vezes uma coisa vai conflitar com a outra. O pattern é uma coisa mais avançada, é uma coisa que você vai ter que estudar a expressão regular para poder aplicar." — A validação via pattern pode tornar minlength/maxlength redundantes se o quantificador do regex já define os limites.

## inputmode — Para dispositivos mobile

O atributo `inputmode` não muda o comportamento de validação. Ele apenas controla qual teclado virtual aparece em dispositivos touch:

- `inputmode="numeric"` — teclado numérico (útil para PINs)
- `inputmode="text"` — teclado alfanumérico padrão
- Não tem efeito visível em desktop/web

**Nota do instrutor:** "Aqui para a gente não funciona na web, tá bom? Mas no celular, se você vai abrir isso aqui no celular, vai abrir o tecladinho do seu celular, o teclado numérico."

## O atributo title como UX para pattern

Quando o browser bloqueia um submit por causa do pattern, ele exibe uma mensagem genérica. O atributo `title` complementa essa mensagem com texto descritivo.

**Dica do instrutor:** "A dica é que a gente usa o atributo title para falar 'apenas hexadecimal'. Aí eu já sei que eu posso usar do 0, 1, posso usar até o F."

## Segurança frontend é superficial

O instrutor reforça que validação no frontend (pattern, minlength, maxlength) é apenas uma primeira camada. Um usuário pode desabilitar JavaScript, editar o HTML, ou enviar requisições diretamente ao servidor.

**Citação:** "É recomendado usar mais estratégias de segurança, ele é bom para um nível de segurança aqui no front-end, mas é recomendado se você usar ainda mais estratégia, que lá no back-end, quando você estudar, você vai colocar mais estratégias."

## Expressões regulares (pattern) — Anatomia

O exemplo do instrutor: `pattern="[0-9a-fA-F]{4,8}"`

Decompondo:
- `[0-9]` — dígitos de 0 a 9
- `[a-f]` — letras minúsculas de a até f
- `[A-F]` — letras maiúsculas de A até F
- `{4,8}` — entre 4 e 8 caracteres no total

Isso valida valores hexadecimais (como cores CSS: `FF00AC`). Cada caractere digitado é verificado contra as classes permitidas, e o total deve cair dentro do quantificador.