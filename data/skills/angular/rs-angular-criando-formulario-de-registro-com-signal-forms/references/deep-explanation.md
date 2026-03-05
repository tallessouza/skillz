# Deep Explanation: Formularios de Registro com Signal Forms

## Por que modelo primeiro?

O instrutor enfatiza que o Signal Forms precisa de um **modelo signal** como ponto de partida. Esse modelo define a estrutura do formulario — os campos, seus tipos e valores iniciais. O `form()` recebe esse modelo e cria um objeto de formulario reativo baseado nele.

A razao tecnica: o `fieldPath` no callback do segundo parametro e **derivado do tipo do modelo**. Se o modelo tem `name`, `email`, `password`, o `fieldPath` tera exatamente essas propriedades com autocomplete. Isso elimina erros de digitacao e torna o formulario type-safe.

## Separacao entre modelo e formulario

Um ponto critico que o instrutor reforça: **nunca confunda o modelo com o formulario**. O modelo (`registerModel`) e apenas o estado bruto. O formulario (`registerForm`) e o wrapper que adiciona validacao, estado de touched/dirty, e a conexao com o template.

No template, voce sempre referencia o **formulario**, nunca o modelo:
- Correto: `[field]="registerForm.name"`
- Errado: `[field]="registerModel().name"`

## Callback de validacao como segundo parametro

O pattern e sempre:
```typescript
form(modelo, (fieldPath) => {
  // validacoes aqui
});
```

O `fieldPath` recebido no callback tem propriedades correspondentes a cada campo do modelo. Voce aplica funcoes de validacao passando o fieldPath do campo especifico.

## Mensagens de erro obrigatorias

O instrutor adiciona `{ message: '...' }` em **todas** as validacoes. Isso nao e opcional na pratica — sem mensagem, o formulario sabe que o campo esta invalido mas nao consegue mostrar feedback util ao usuario.

Cada validacao pode ter sua propria mensagem, permitindo mensagens especificas:
- `required` no email: "O e-mail é obrigatório"
- `email` no email: "O e-mail está inválido"

## Diferenca entre min/max e minLength/maxLength

O instrutor faz questao de alertar sobre essa confusao comum:

| Funcao | Tipo de validacao | Exemplo |
|--------|------------------|---------|
| `min(field, 18)` | Valor numerico >= 18 | Idade minima |
| `max(field, 100)` | Valor numerico <= 100 | Quantidade maxima |
| `minLength(field, 8)` | String com >= 8 caracteres | Senha |
| `maxLength(field, 50)` | String com <= 50 caracteres | Nome |

Usar `min` para validar comprimento de senha nao vai funcionar como esperado — ele compara o valor numerico, nao o tamanho da string.

## Diretiva field

A diretiva `field` (importada de `@angular/forms/signals`) e o que conecta um campo do formulario a um elemento `<input>` no template. Ela faz two-way binding automatico, alem de propagar estado de validacao.

## Funcoes de validacao disponiveis

O instrutor menciona que a documentacao do Signal Forms tem diversas funcoes de validacao alem das usadas na aula. Vale consultar a documentacao oficial de `@angular/forms/signals` para ver todas as opcoes disponiveis, incluindo validacoes customizadas.