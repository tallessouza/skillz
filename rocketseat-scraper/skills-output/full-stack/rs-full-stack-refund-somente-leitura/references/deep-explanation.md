# Deep Explanation: Refund Somente Leitura

## Por que reutilizar páginas em vez de duplicar?

O instrutor demonstra um padrão muito comum em aplicações React: a mesma estrutura de formulário serve tanto para criar quanto para visualizar um registro. Em vez de criar `RefundCreate.tsx` e `RefundView.tsx` com 90% do código idêntico, registra-se o mesmo componente `<Refund />` em duas rotas diferentes.

A rota de criação fica limpa (`/refund`), sem parâmetro. A rota de visualização recebe o ID (`/refund/:id`). O componente internamente verifica se recebeu um ID — se sim, está em modo leitura; se não, em modo criação.

## Dupla negação (`!!`) — Por que duas exclamações?

O instrutor explica passo a passo:

1. `params.id` retorna `"123"` (string) ou `undefined`
2. `!params.id` — uma negação — inverte: `"123"` vira `false`, `undefined` vira `true`
3. `!!params.id` — negação da negação — confirma: `"123"` vira `true`, `undefined` vira `false`

Isso é necessário porque `disabled` espera um booleano. Passar uma string como `"123"` funciona por coerção implícita, mas `!!` torna a intenção explícita e evita warnings em TypeScript.

## Interceptação do submit no modo visualização

Quando o formulário está em modo leitura e os campos estão preenchidos, o HTML nativo não bloqueia o submit (campos preenchidos passam na validação `required`). Por isso, o instrutor adiciona um guard clause no `handleSubmit`:

```tsx
if (params.id) {
  return navigate(-1)
}
```

O `navigate(-1)` equivale ao botão "voltar" do navegador — volta para a página anterior no histórico, que no caso é o dashboard do admin.

## Registro da mesma página em rotas de grupos diferentes

O instrutor mostra que a página `<Refund />` é registrada dentro de dois grupos de rotas:

- **Employee routes** — rota `/refund` (sem ID) para o funcionário criar solicitações
- **Manager routes** — rota `/refund/:id` (com ID) para o admin visualizar detalhes

Isso permite que layouts, middlewares e guards diferentes se apliquem a cada contexto, mesmo usando o mesmo componente visual.

## Campos desabilitados vs. somente leitura

O atributo `disabled` no HTML impede interação E exclui o campo do envio do formulário. Para o caso de visualização isso é ideal — o admin não deve poder editar nem enviar dados alterados. O instrutor aplica `disabled` em:

- Inputs de texto
- Selects
- Textareas

Para o upload, o instrutor menciona que em vez de desabilitar, faz mais sentido trocar o componente inteiro — exibir o arquivo já enviado em vez do input de upload vazio.

## Espaçamento com `my-6` em vez de `mt-6`

No início da aula, o instrutor percebe que o espaçamento superior (`mt-6`) deveria ser simétrico. Troca para `my-6` (margin no eixo Y), que aplica `margin-top` e `margin-bottom` simultaneamente. Menciona que sabe que `6` equivale a `24px` porque a extensão do Tailwind CSS mostra o valor calculado ao passar o mouse.