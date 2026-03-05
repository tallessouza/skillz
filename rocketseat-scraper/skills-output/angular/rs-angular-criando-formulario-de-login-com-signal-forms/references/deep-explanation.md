# Deep Explanation: Angular Signal Forms

## Tres formas de criar formularios no Angular

O instrutor explica que o Angular oferece tres abordagens:

1. **Template Driven Forms** — para formularios simples. Usa diretivas no template (ngModel). Menos controle programatico.

2. **Reactive Forms** — para formularios complexos, dinamicos, onde precisa adicionar/remover campos. Usa FormGroup/FormControl no TS. Completo, "da para fazer de tudo".

3. **Signal Forms** (novo) — integrado com o sistema de Signals do Angular. Ja tem varias funcionalidades e esta em evolucao ativa. O instrutor destaca que "toda essa funcionalidade de Signals no Angular esta em desenvolvimento, esta melhorando, incrementando aos poucos".

## Anatomia do Signal Forms

### 1. Model Signal

O ponto de partida e um `signal()` com um objeto que define a estrutura do formulario. Isso e diferente do Reactive Forms onde voce cria FormControl/FormGroup diretamente. Aqui, o model e a fonte de verdade.

```typescript
loginModel = signal({
  email: '',
  password: '',
});
```

### 2. form() com callback de validacoes

A funcao `form()` recebe o model e um callback. O callback recebe um `fieldPath` que tem autocomplete para todos os campos definidos no model. Isso e type-safe — se o model tem `email` e `password`, o fieldPath so oferece esses campos.

### 3. Validators sao funcoes, nao classes

Diferente do Reactive Forms onde voce usa `Validators.required`, no Signal Forms voce importa funcoes individuais (`required`, `email`, `minLength`) de `@angular/forms/signals`. Cada validator recebe:
- Primeiro parametro: o campo via fieldPath
- Segundo parametro (ou terceiro no caso de minLength): objeto com `message`

### 4. Invocacao de Signals — cuidado com parenteses

O instrutor destaca um ponto sutil:
- `loginForm.email` — acessa o campo (sem parenteses)
- `loginForm.email.errors()` — errors e um signal, precisa invocar
- `loginForm().value()` — tanto o form quanto value sao signals, precisa invocar ambos
- `loginForm.valid()` — valid e um signal

### Formulario invalido cascateia

Se **qualquer** campo estiver invalido, o formulario inteiro fica invalido (`valid() === false`). O instrutor demonstrou isso removendo um caractere do password (ficando com 7 em vez de 8) e mostrando que o formulario todo ficou invalido.

### Estrutura dos erros

Cada erro retornado e um objeto com:
- `kind`: tipo do erro (ex: `'required-validation-error'`, `'min-length-validation-error'`, `'email'`)
- `message`: a string que voce definiu na validacao

Os erros de um campo sao um array — pode ter multiplos erros simultaneos.

## Diretiva field

A diretiva `field` (importada de `@angular/forms/signals`) faz o binding bidirecional entre um `<input>` e um campo do formulario. E o equivalente ao `formControlName` do Reactive Forms, mas para Signal Forms.

## Documentacao recomendada

O instrutor recomenda ler:
- `angular.dev/forms/signals/validation`
- Toda a secao de forms desde overview ate forms modules

## Estado atual (fev 2026)

Signal Forms esta em evolucao. O instrutor menciona que "eles vao adicionar funcionalidades novas, melhorar as integracoes entre o template e a parte do componente". Validacoes customizadas ja sao possiveis alem das built-in.