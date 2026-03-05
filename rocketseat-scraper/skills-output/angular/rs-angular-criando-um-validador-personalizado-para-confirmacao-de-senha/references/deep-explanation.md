# Deep Explanation: Validador Personalizado para Confirmacao de Senha

## Por que cross-field validation?

O cenario classico: um formulario de registro tem "senha" e "confirmar senha". Esses dois campos precisam ser iguais. Validadores simples (required, minLength, email) operam em um unico campo. Quando a validacao depende do valor de OUTRO campo, voce precisa de cross-field validation.

No Angular Signal Forms, isso e feito com a funcao `validate()`.

## Como validate() funciona internamente

A funcao `validate()` recebe dois argumentos:
1. **O campo alvo** (FieldPath) — onde o erro sera alocado
2. **Um callback** — que recebe um objeto com `value` e `valueOf`

### value vs valueOf

- **value**: e um Signal que contem o valor do campo alvo (primeiro parametro). Como e um Signal, voce precisa invocar `value()` para obter o valor atual.
- **valueOf(fieldPath)**: e uma funcao que retorna o valor de QUALQUER outro campo do formulario. Voce passa o FieldPath do campo desejado.

### Retorno do callback

- **Objeto com kind e message**: indica erro. O `kind` e um identificador unico do tipo de erro (voce escolhe o nome). O `message` e o texto que sera exibido ao usuario.
- **null**: indica que nao ha erro.

O instrutor enfatiza: "Caso eles sejam validos, e so eu retornar nulo, que ai nao vai alocar nenhum erro nesse campo."

## Por que extrair em arquivo separado?

O instrutor explica: "Se voce notar, vai ficando muito grande esse formulario. Nao e muito legal. Pode ser que eu queira reutilizar essa validacao em algum outro componente."

A estrategia e:
1. Criar pasta `validators/` dentro da feature
2. Exportar uma funcao que recebe os FieldPaths como parametros
3. No componente, chamar a funcao com uma unica linha

Isso transforma codigo de ~15 linhas inline em uma chamada de 1 linha no componente.

## Parametrizacao inteligente

O instrutor parametriza os FieldPaths (nao hardcoda `fieldPath.password` dentro do validador). Isso permite reutilizar o mesmo validador em qualquer formulario que tenha dois campos para comparar.

## Padrao de exibicao de erros no template

O instrutor usa um padrao consistente:
1. Criar variaveis locais com `@let` para evitar repeticao de `registerForm.campo`
2. Verificar `campo.touched() && campo.invalid()` antes de mostrar erro
3. Acessar `campo.errors()[0].message` para obter o texto

Isso e identico ao padrao usado no formulario de login — consistencia entre formularios.

## Referencia a documentacao

O instrutor aponta para a secao "Crossfield Validation" na documentacao oficial do Angular (pagina Validation). O exemplo da documentacao e quase identico ao implementado na aula.