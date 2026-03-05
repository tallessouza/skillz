# Deep Explanation: Validacao de Erros em Formularios Angular

## Por que invocar signals no template com parenteses?

O Signal Forms do Angular exporta cada campo do formulario como um signal. Quando voce escreve `loginForm.email` no template, voce tem a referencia ao signal. Quando invoca `loginForm.email()`, voce le o valor atual. O template precisa dessa invocacao para se tornar **reativo** — toda vez que o valor do signal mudar, o template atualiza automaticamente.

Isso e diferente do modelo antigo de Reactive Forms onde voce acessava `form.get('email')` e o Angular usava change detection para atualizar. Com signals, a reatividade e granular e explicita.

## Estrutura do objeto de erros

Quando um campo tem validators e esta invalido, a propriedade `errors` retorna um array de objetos:

```typescript
[
  {
    field: 'email',
    kind: 'required',  // ou 'pattern', 'minLength', etc.
    message: 'O e-mail é obrigatório'
  }
]
```

O instrutor explica que so ha **um erro ativo por vez** neste cenario, entao acessar `errors[0].message` e seguro e suficiente. O array existe porque a estrutura suporta multiplos erros, mas na pratica os validators sao avaliados em ordem e o primeiro que falha e reportado.

## @let — variaveis de template

O `@let` e uma feature do Angular que permite criar variaveis locais no template. O instrutor usa isso para resolver um problema pratico: `loginForm.email` era escrito multiplas vezes (no `@if`, na interpolacao de mensagem, etc.).

Com `@let email = loginForm.email;`, voce cria um alias que:
- Reduz repeticao
- Melhora legibilidade
- Se atualiza automaticamente quando o signal muda

### Dica do instrutor sobre formatacao

O Prettier/formatador automatico pode colocar multiplos `@let` na mesma linha, prejudicando a legibilidade. A solucao pratica: adicionar comentarios HTML entre eles para forcar separacao visual:

```html
<!-- Email form field signal -->
@let email = loginForm.email;
<!-- Password form field signal -->
@let password = loginForm.password;
```

## touched vs dirty

O instrutor menciona que existem varios estados disponiveis (`.touched`, `.dirty`, etc.), mas para validacao de login, `.touched` e suficiente:

- **touched**: usuario clicou no campo e saiu (blur)
- **dirty**: usuario alterou o valor do campo

Para mensagens de erro em formularios de login, `touched` e a escolha padrao porque mostra o erro assim que o usuario interage e sai do campo, sem exigir que ele tenha digitado algo.