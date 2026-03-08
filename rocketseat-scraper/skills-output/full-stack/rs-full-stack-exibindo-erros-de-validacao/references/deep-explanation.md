# Deep Explanation: Exibindo Erros de Validação

## Como o formState funciona

O `useForm` do React Hook Form retorna um objeto `formState` que contém o estado completo do formulário. Dentro dele, `errors` é um objeto onde cada chave corresponde a um campo registrado e o valor contém informações sobre o erro (type, message, ref).

### Por que as propriedades são opcionais?

Quando o instrutor acessa `errors.name`, ele destaca que o TypeScript mostra todas as propriedades como opcionais. Isso acontece porque um campo pode estar válido (sem erro) ou inválido (com erro) — é uma condição dinâmica. Por isso o optional chaining (`?.`) é obrigatório.

### Ciclo de vida do erro

1. Usuário clica em "Salvar" sem preencher campos
2. React Hook Form executa a validação (via Zod resolver, por exemplo)
3. Campos que falham populam `formState.errors` com `{ type, message, ref }`
4. O componente re-renderiza, exibindo os spans de erro
5. Conforme o usuário digita e o campo passa a atender os critérios, o erro é removido de `formState.errors`
6. O componente re-renderiza novamente, o span some

### Re-validação em tempo real

O instrutor demonstra que "conforme eu digito, a mensagem some". Isso ocorre porque o React Hook Form, por padrão no modo `onSubmit`, re-valida campos que já falharam enquanto o usuário digita (modo `onChange` para campos com erro). Isso dá feedback instantâneo sem validar campos que ainda não foram tocados.

### Integração com Zod

As mensagens de erro vêm do schema Zod definido previamente. Por exemplo:
- `z.string().min(1, "Nome é obrigatório")` → `errors.name?.message` retorna "Nome é obrigatório"
- `z.string().min(10, "Descrição precisa ter pelo menos 10 dígitos")` → mensagem muda conforme a regra violada

Isso evita duplicação: a mensagem é definida uma vez no schema e exibida via `errors.field?.message`.

### Todos os campos de uma vez

O instrutor mostra que ao clicar em "Salvar" sem preencher nada, TODOS os erros aparecem simultaneamente. Isso acontece porque a validação roda em todos os campos de uma vez no submit, e `formState.errors` é populado com todos os campos inválidos.

### Analogia do instrutor

O formulário funciona como um porteiro: se algum campo não atende os critérios, o formulário nem é enviado. Os erros são como avisos do porteiro dizendo exatamente o que está faltando. Conforme você resolve cada pendência, o aviso correspondente desaparece.

## Padrão de replicação por campo

O instrutor demonstra um padrão prático: escrever o bloco de erro para um campo, depois copiar e ajustar o nome do campo para os demais (name → date → subject → description). Isso reforça que o padrão é idêntico para todos os tipos de input (text, date, select, textarea) — só muda o nome do campo.