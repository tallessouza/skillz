# Deep Explanation: Overview de Sign Up

## Por que preventDefault é a primeira linha?

O comportamento padrão de um formulário HTML é fazer uma requisição GET/POST e recarregar a página. Em SPAs, isso destrói o estado da aplicação — todos os valores dos inputs, estados de loading, e mensagens de erro desaparecem. O `preventDefault()` deve ser chamado **antes** de qualquer lógica porque se uma exceção ocorrer antes dele, o formulário recarrega e o usuário perde tudo.

## O padrão de loading state como guard

O instrutor destaca que `setIsLoading(true)` serve duplo propósito:
1. **Feedback visual** — o usuário vê que algo está acontecendo
2. **Guard contra submissões duplas** — o botão fica desabilitado via `disabled={isLoading}`

Esse padrão é importante porque requisições de rede são assíncronas. Sem o guard, o usuário pode clicar múltiplas vezes e criar múltiplas contas.

## Validação antes da requisição — por que Zod primeiro?

O instrutor enfatiza que a validação com Zod acontece **antes** da chamada à API. A razão é prática:

- **Velocidade:** Validação local é instantânea, requisição de rede pode demorar
- **Economia:** Não gasta recursos do servidor com dados inválidos
- **UX:** O usuário recebe feedback imediato sobre campos incorretos
- **Separação de responsabilidades:** Frontend valida formato, backend valida regras de negócio

Quando o Zod `parse` falha, ele lança uma exceção (`ZodError`). Isso significa que a execução **não continua** para a linha do `api.post`. O instrutor destaca: "ele nem continua executando a próxima linha que seria fazer a requisição".

## O objeto validado como body — insight sutil

O instrutor menciona: "a gente até poderia enviar aqui name, separado, e-mail, mas como já está tudo aqui dentro dele, ele já vai devolver todos os dados validados".

Isso é um padrão importante: o retorno do `schema.parse()` é um objeto tipado e validado. Em vez de reconstruir o payload manualmente (`{ name, email, password }`), use diretamente o objeto retornado. Vantagens:

- Se o schema muda, o payload muda automaticamente
- Não há risco de enviar dados não-validados
- Menos código, menos bugs

## Tratamento de erros em camadas — a cascata com early return

O padrão que o instrutor ensina é uma cascata de `if` com `return`:

```
catch (error) →
  É ZodError? → mostra mensagem de validação → return
  É AxiosError? → mostra mensagem da API → return
  Nenhum dos dois? → mostra mensagem genérica → return
```

Cada `return` dentro do `catch` impede que o código de sucesso (confirmação + navegação) execute. Sem os `return`s, o fluxo continuaria e mostraria a mensagem de sucesso mesmo após um erro.

### Por que essa ordem específica?

1. **Zod primeiro** — erros de validação são locais, mais comuns, e não envolvem rede
2. **Axios segundo** — erros da API são remotos e contêm mensagens do backend
3. **Genérico por último** — captura erros inesperados (rede caiu, erro de runtime, etc.)

## A confirmação como gate para navegação

O instrutor coloca a navegação dentro de um `if (confirm(...))`. Isso serve como:
- **Feedback de sucesso** — o usuário sabe que deu certo
- **Controle de fluxo** — a navegação só acontece se o usuário clicar OK
- O `confirm()` retorna boolean, então funciona naturalmente como condição

## Relação entre Form e onSubmit

O instrutor explica que o evento vem do próprio formulário HTML:

```html
<form onSubmit={handleSubmit}>
```

O `FormEvent` é passado automaticamente pelo React. O instrutor usou `e` como abreviação de `event`, mas destaca que "poderia escrever outro nome" — reforçando que é apenas um parâmetro, não uma palavra reservada.