# Deep Explanation: Desabilitando Botao de Registrar

## Por que combinar dois estados?

O instrutor destaca que existem **dois motivos independentes** para desabilitar o botao:

1. **Formulario invalido** (`registerForm.invalid`) — o usuario ainda nao preencheu corretamente todos os campos. Nao faz sentido permitir submit.

2. **Requisicao em andamento** (`registerResource.isLoading()`) — o usuario ja clicou e a requisicao esta pendente. Permitir novo clique causaria requisicoes duplicadas.

Cada um sozinho cobre apenas metade dos casos. A expressao completa e:

```typescript
registerResource.isLoading() || registerForm.invalid
```

## Angular Resource e isLoading

O Angular Resource (introduzido nas versoes mais recentes) expoe signals como `isLoading()`, `value()`, `error()`. O `isLoading()` retorna `true` enquanto a requisicao HTTP esta pendente, eliminando a necessidade de criar flags booleanas manuais como `isSubmitting = false`.

Isso e mais limpo e reativo — o template se atualiza automaticamente quando o signal muda.

## Feedback visual com Tailwind

O instrutor enfatiza que desabilitar funcionalmente nao e suficiente. O usuario precisa **ver** que o botao esta desabilitado. As classes Tailwind usadas:

- `disabled:opacity-50` — reduz opacidade para 50%, dando aparencia "esmaecida"
- `disabled:cursor-not-allowed` — muda o cursor para o icone de "proibido"
- `disabled:hover:bg-purple-800` — substitui o hover normal por uma cor neutra, evitando que o botao "reaja" visualmente ao mouse mesmo desabilitado

O modificador `disabled:` do Tailwind aplica estilos apenas quando o atributo HTML `disabled` esta presente, criando uma conexao direta entre estado logico e visual.

## Conexao com a aula de login

O instrutor menciona que esse padrao ja foi aplicado no formulario de login. Isso confirma que **todo formulario com submit deve seguir esse padrao** — nao e especifico do registro.

## Fluxo completo

1. Usuario abre o formulario → botao desabilitado (form invalido)
2. Usuario preenche todos os campos corretamente → botao habilitado
3. Usuario clica em "Criar" → requisicao dispara, `isLoading()` vira true → botao desabilitado novamente
4. Requisicao completa → `isLoading()` vira false → botao volta ao estado normal (habilitado se form ainda valido)