# Deep Explanation: Utilizando Schema na Validação com Yup

## Por que usar schema de validação?

O instrutor demonstra que sem validação, o formulário permite enviar dados vazios ou incompletos. Com o schema Yup integrado ao React Hook Form via `yupResolver`, o comportamento muda fundamentalmente: **o `onSubmit` simplesmente não executa** enquanto houver campos inválidos.

Isso é diferente de validar manualmente dentro do `onSubmit` — o schema cria uma barreira antes da execução, garantindo que o código de processamento nunca receba dados inválidos.

## Similaridade com Zod

O instrutor destaca explicitamente: "pode perceber que é praticamente muito igual o Zod". A API de encadeamento de métodos é o padrão comum:

```
yup.string().required().min(10)   ← Yup
z.string().min(1).min(10)         ← Zod
```

A escolha entre Yup e Zod depende do ecossistema do projeto. Se já usa React Hook Form com `@hookform/resolvers`, ambos são suportados.

## Comportamento progressivo de validação

Um detalhe importante demonstrado na aula: quando o usuário clica em "Salvar" com campos vazios, o foco vai para o primeiro campo inválido. Conforme preenche e tenta submeter novamente, o foco avança para o próximo campo inválido. Esse comportamento é nativo do React Hook Form com resolver — o schema define as regras, o form gerencia o UX.

## Mensagens de erro personalizadas

Cada regra aceita uma mensagem como último argumento:
- `.required('Nome é obrigatório')` — mensagem de campo obrigatório
- `.min(10, 'A descrição precisa ter pelo menos 10 caracteres')` — mensagem de regra específica

O instrutor enfatiza que essas mensagens são passadas como segundo argumento dos métodos de validação, tornando o schema autodocumentado.

## Tipagem automática

Quando o schema está definido, `yup.InferType<typeof schema>` gera automaticamente o tipo TypeScript correspondente. Isso garante que:
- Os campos do schema batem com a tipagem do formulário
- O `onSubmit` recebe dados tipados
- Erros de tipo são capturados em tempo de compilação

## Edge cases discutidos

### Campo com menos caracteres que o mínimo
O instrutor demonstrou digitando "qualquer coisa" (menos de 10 caracteres) no campo de descrição — o submit continuou bloqueado. Só quando adicionou mais texto ultrapassando o mínimo de 10, o formulário submeteu.

### Ordem de validação
Os campos são validados na ordem em que aparecem no schema. O React Hook Form foca automaticamente no primeiro campo com erro, criando uma experiência guiada para o usuário.