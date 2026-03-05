# Deep Explanation: Validacao de Formularios com CSS Pseudo-classes

## Por que :not(:focus) e essencial

Quando usamos apenas `input:valid ~ .error { display: none }`, a mensagem de erro fica piscando enquanto o usuario digita. Isso acontece porque a cada caractere digitado, o navegador reavalia se o campo e valido.

Por exemplo, ao digitar um email:
- `t` → invalido → erro aparece
- `t@` → invalido → erro aparece
- `t@e` → o navegador pode considerar valido → erro some
- `t@e.` → invalido de novo → erro aparece

Com `:not(:focus):valid`, a avaliacao de "esconder o erro" so acontece quando o usuario SAI do campo (perde o foco). Enquanto esta digitando, a mensagem permanece visivel como aviso passivo.

## O seletor de irmao (~) — General Sibling Combinator

O `~` seleciona TODOS os irmaos subsequentes que correspondem ao seletor. Diferente do `+` (adjacent sibling), que so pega o irmao imediatamente seguinte.

```css
/* Pega QUALQUER .error que seja irmao posterior do input */
input:valid ~ .error { display: none; }

/* Pega SOMENTE o .error imediatamente apos o input */
input:valid + .error { display: none; }
```

No contexto da aula, o instrutor usa `~` porque pode haver outros elementos entre o input e o .error (como um `<small>`).

## Por que <small> precisa de inline-block

O elemento `<small>` e inline por padrao. Elementos inline ignoram `margin-top` e `margin-bottom`. Para aplicar espacamento vertical sem perder o comportamento inline (nao ocupar linha inteira), usamos `display: inline-block`.

Alternativas:
- `display: block` — funcionaria, mas o `<small>` ocuparia a linha inteira
- `display: inline-block` — melhor dos dois mundos: aceita margin vertical e nao quebra o flow inline

## O tipo tel nao valida nada

O `type="tel"` existe mais para dispositivos moveis (abre teclado numerico) do que para validacao. O navegador aceita qualquer texto nesse campo. Para validacao real de telefone, seria necessario usar o atributo `pattern` com regex, por exemplo:

```html
<input type="tel" pattern="\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}" />
```

O instrutor optou por nao adicionar validacao complexa, focando no conceito de pseudo-classes.

## Fluxo de validacao do campo email

1. Pagina carrega → campo vazio + required → `:invalid` ativo → borda vermelha
2. Usuario clica no campo → `:focus` ativo → `:not(:focus)` falso → erro continua visivel
3. Usuario digita email valido → `:valid` ativo, mas `:not(:focus)` falso → erro permanece (evita piscar)
4. Usuario sai do campo (blur) → `:not(:focus)` verdadeiro + `:valid` verdadeiro → erro some
5. Se email invalido ao sair → `:invalid` ativo → borda vermelha + erro visivel

## Fieldset como agrupador semantico

O `<fieldset>` com classe (`class="guardian"`) serve para:
1. **Semantica HTML** — indica ao navegador/screen reader que esses campos pertencem a uma secao
2. **Estilizacao CSS** — permite selecionar todos os inputs de uma secao com `.guardian input`
3. **Organizacao visual** — `<legend>` aparece como titulo da secao