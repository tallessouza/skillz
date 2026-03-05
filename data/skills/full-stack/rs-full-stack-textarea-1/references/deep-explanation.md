# Deep Explanation: Textarea em Formularios HTML

## Por que o atributo `name` e essencial

O textarea, assim como qualquer campo de formulario, so envia dados ao servidor se tiver o atributo `name`. Sem ele, o campo aparece visualmente mas e invisivel no payload do submit. O instrutor enfatiza isso como primeira coisa a verificar.

## O problema do whitespace dentro da tag

Diferente de elementos como `<div>`, o conteudo entre `<textarea>` e `</textarea>` e tratado como valor inicial do campo. Isso significa que:

```html
<textarea name="msg">
</textarea>
```

Ja tem uma quebra de linha como valor default. O usuario vera o cursor posicionado depois de um espaco/linha em branco. O instrutor demonstra isso ao vivo: "se eu colocar um espaco assim no textarea, quando eu comecar a escrever aqui, ele ja vem com um espaco ali."

**Regra pratica:** sempre escreva `<textarea name="x"></textarea>` na mesma linha ou sem whitespace entre abertura e fechamento.

## Por que evitar `rows` e `cols`

Os atributos `rows` e `cols` definem dimensoes em unidades de caracteres, nao pixels. Isso causa:
- Tamanhos inconsistentes entre fontes e navegadores
- Impossibilidade de responsividade
- Conflito com CSS quando ambos estao presentes

O instrutor recomenda explicitamente: "eu nao recomendo a gente usar, recomendo a gente usar via CSS depois." CSS oferece controle preciso com `width`, `height`, `min-height`, `max-height` e `resize`.

## Como `maxlength` e `minlength` funcionam

- **`maxlength`**: O navegador simplesmente para de aceitar caracteres apos o limite. Nao ha mensagem de erro — o campo trava. O instrutor demonstra: "quando chegar em 10, ele acaba."
- **`minlength`**: O navegador valida no momento do submit. Se o texto for menor que o minimo, aparece a mensagem de validacao nativa do browser. O instrutor chama de "reclamadinha padrao."

Ambos funcionam sem JavaScript, como parte da validacao nativa do HTML5.

## O atributo `wrap` e seus modos

| Valor | Comportamento |
|-------|--------------|
| `soft` (padrao) | Quebra de linha visual, mas nao envia caracteres de quebra no submit |
| `hard` | Insere caracteres de quebra reais (requer `cols` definido) |
| `off` | Desativa quebra de linha — texto continua horizontalmente com scroll |

O instrutor demonstra `wrap="off"`: "olha o que acontece, ele nao faz quebra de linha mais." E recomenda nao usar: "por padrao, recomendo a gente nao colocar."

## Atributos compartilhados com input

O textarea suporta muitos atributos comuns a `<input>`:
- `placeholder` — texto de dica
- `required` — campo obrigatório
- `disabled` — campo desabilitado
- `readonly` — somente leitura
- `autofocus` — foco automatico ao carregar
- `form` — associar a um form por ID

O instrutor menciona: "outros atributos relativos ao input tambem tem aqui, placeholder, required, e assim vai."

## Redimensionamento pelo usuario

Por padrao, a maioria dos navegadores permite que o usuario redimensione o textarea arrastando o canto inferior direito. Controle isso via CSS:

```css
textarea { resize: vertical; }   /* so vertical */
textarea { resize: none; }       /* travado */
textarea { resize: both; }       /* padrao em muitos browsers */
```