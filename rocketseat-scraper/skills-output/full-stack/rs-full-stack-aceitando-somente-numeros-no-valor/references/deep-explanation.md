# Deep Explanation: Filtragem de Input com Regex

## Por que regex e não validação manual?

O instrutor vai direto ao ponto: para remover letras de um input, a abordagem é usar **expressão regular** (regex). A razão é simples — regex é declarativo. Você define o padrão (`\D` = não numérico) e o método `.replace()` faz o trabalho. Não precisa de loops, não precisa verificar caractere por caractere.

## O padrão `\D` explicado

- `\d` (minúsculo) = qualquer dígito (0-9)
- `\D` (maiúsculo) = qualquer coisa que NÃO é dígito
- É o inverso. Maiúsculo nega o padrão.

Quando usamos `/\D/g`:
- `/` abre a expressão
- `\D` é o padrão (caracteres não numéricos)
- `/` fecha a expressão
- `g` é a flag global — sem ela, só a primeira ocorrência seria substituída

## O ciclo ler-transformar-devolver

O instrutor demonstra um padrão fundamental:

1. **Ler:** `const value = input.value` — captura o que o usuário digitou
2. **Transformar:** `value.replace(/\D/g, "")` — remove o indesejado
3. **Devolver:** `input.value = valorTransformado` — atualiza o campo

Ele inclusive usa `console.log` para demonstrar que o valor original contém as letras, mas após o replace, elas somem. Isso mostra que o `.replace()` não muta a string original (strings são imutáveis em JS) — ele retorna uma nova string.

## Por que devolver ao input?

O instrutor enfatiza: não basta fazer o replace. Você precisa **atribuir o resultado de volta** ao `input.value`. Sem isso, o valor transformado existe apenas na variável local e o input continua mostrando as letras.

O fluxo completo que ele demonstra:
```javascript
// Forma simplificada do que o instrutor faz:
input.value = input.value.replace(/\D/g, "")
```

Isso é equivalente ao passo-a-passo dele, mas condensado em uma linha.

## Edge cases não cobertos na aula

### Paste (colar texto)
O evento `input` captura paste, então o regex será aplicado ao conteúdo colado também. Isso funciona corretamente.

### Cursor position
Ao substituir `input.value`, o cursor pode pular para o final do campo. Em inputs simples isso raramente é problema, mas em campos com máscara complexa pode incomodar. Para esse caso, seria necessário salvar e restaurar `selectionStart`/`selectionEnd`.

### Valores decimais
A aula cobre apenas inteiros. Para aceitar decimais (como valores monetários com centavos), o regex precisaria ser ajustado para `/[^0-9.]/g` ou `/[^0-9,]/g` dependendo do locale.

### type="number" vs type="text"
O instrutor não menciona `type="number"`, mas na prática muitos devs confiam apenas nesse atributo. O problema é que `type="number"` tem comportamento inconsistente entre browsers (especialmente mobile) e não impede a entrada de caracteres como `e`, `+`, `-`. A abordagem com regex é mais confiável.