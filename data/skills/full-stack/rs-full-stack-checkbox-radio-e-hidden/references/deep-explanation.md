# Deep Explanation: Checkbox, Radio e Hidden

## Modelo mental: Cardinalidade da escolha

A decisao entre checkbox e radio se resume a uma pergunta: **quantas opcoes o usuario pode selecionar?**

- **Checkbox = array** — zero ou mais valores. O backend recebe multiplos valores com a mesma chave (`carro=fiat&carro=audi`).
- **Radio = enum** — exatamente um valor de um conjunto. O browser garante mutuamente exclusivo pelo atributo `name`.

### Analogia do instrutor

Pense no checkbox como uma lista de compras onde voce pode marcar tudo que quer. O radio e como um interruptor de luz — so um pode estar ligado por vez dentro do mesmo grupo.

## O papel do atributo `name`

O `name` e o mecanismo de agrupamento. Para radios, **se o name for diferente, o browser trata como grupos separados** e permite selecionar ambos. Isso e um erro comum — o desenvolvedor muda o name achando que esta criando opcoes independentes, mas na verdade quebra a exclusividade mutua.

```html
<!-- ERRADO: names diferentes = dois grupos independentes -->
<input type="radio" name="opcao1" value="fiat"> Fiat
<input type="radio" name="opcao2" value="audi"> Audi
<!-- Ambos podem ser selecionados! -->

<!-- CORRETO: mesmo name = um grupo exclusivo -->
<input type="radio" name="carro" value="fiat"> Fiat
<input type="radio" name="carro" value="audi"> Audi
```

Para checkboxes, o mesmo `name` permite agrupar valores que serao enviados como array.

## O atributo `value`: por que nunca omitir

Sem `value`, o checkbox/radio envia o literal `"on"` como valor. Isso e praticamente inutil:

- `carro=on` — qual carro? Impossivel saber no backend.
- `carro=fiat` — informacao clara e processavel.

O instrutor demonstra isso ao vivo: sem value, o submit mostra `carro=on`. Com `value="fiat"`, mostra `carro=fiat`.

## O atributo `checked`: booleano HTML

`checked` e um atributo booleano — sua mera presenca ativa o comportamento. Nao precisa de valor:

```html
<!-- Todas estas formas funcionam: -->
<input type="checkbox" checked>
<input type="checkbox" checked="checked">
<input type="checkbox" checked="">
```

A forma idiomatica em HTML5 e simplesmente `checked` sem valor.

## Input Hidden: transporte invisivel

O instrutor destaca um caso de uso fundamental: **trafegar informacoes que o usuario nao precisa ver ou editar**, como IDs de registros.

### Quando usar hidden

- Enviar o ID do registro sendo editado
- Tokens CSRF em formularios
- Metadata do formulario (timestamps, versoes)
- Valores calculados pelo servidor que precisam voltar no submit

### Limitacao de seguranca

O instrutor faz questao de alertar: **hidden nao e seguro**. Qualquer pessoa com DevTools ve e pode alterar o valor. Nunca confie em hidden para:

- Senhas ou tokens de autenticacao expostos
- Precos ou valores financeiros que o usuario nao deveria alterar
- Permissoes ou roles

O backend SEMPRE deve validar os valores recebidos de campos hidden.

## Comportamento no submit

| Tipo | Nao marcado | Marcado sem value | Marcado com value |
|------|------------|-------------------|-------------------|
| Checkbox | Nada enviado | `name=on` | `name=valor` |
| Radio | Nada enviado | `name=on` | `name=valor` |
| Hidden | Sempre enviado | — | `name=valor` |

Ponto importante: checkbox e radio **nao enviam nada** quando nao marcados. O backend precisa tratar a ausencia do campo. Hidden **sempre envia**, independente de qualquer interacao.