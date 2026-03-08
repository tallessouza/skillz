# Deep Explanation: Validando Dados do Usuário com Zod

## Por que Zod e não validação manual?

O instrutor (Rodrigo) demonstra um fluxo onde, sem validação, qualquer dado é aceito pela API. Ao adicionar Zod, três coisas acontecem simultaneamente:

1. **Validação tipada** — o schema define o formato esperado
2. **Parsing seguro** — `.parse()` lança ZodError se os dados não batem
3. **Desestruturação confiável** — após o parse, os valores são garantidamente válidos

## O padrão bodySchema.parse(request.body)

O Rodrigo cria o schema fora do handler como `bodySchema`, depois usa `bodySchema.parse(request.body)` dentro do controller. Isso é intencional:

- O schema é criado **uma vez** na inicialização do módulo
- O parse acontece **a cada request**
- Se o parse falha, um ZodError é lançado automaticamente (que deve ser capturado por um error handler global)

## A importância do .trim() para nomes

O Rodrigo demonstra um edge case: se o usuário envia apenas espaços como nome, sem `.trim()`, o `.min(2)` passaria (espaços contam como caracteres). A solução é encadear `.trim().min(2)`:

1. Primeiro, o Zod remove espaços do início e fim
2. Depois, valida o comprimento mínimo sobre o resultado limpo

Isso garante que `"   "` falha na validação, enquanto `"Ana"` passa.

## Escolha do mínimo para nome

O instrutor faz uma reflexão interessante ao vivo sobre qual mínimo usar para nomes:
- 1 caractere? Existe nome com 1 letra?
- 2 caracteres? Mais seguro
- 3 caracteres? "Ana" tem 3, mas pode excluir nomes curtos válidos

Ele decide por **2 caracteres** como compromisso pragmático. A lição aqui é: mínimos devem ser baseados em dados reais do domínio, não em valores arbitrários.

## Comportamento do Zod com corpo vazio

Quando nenhum campo é enviado no body, o Zod retorna uma lista de erros contendo cada campo que falhou na validação. O instrutor demonstra isso no Insomnia:

1. Envia request sem body → erros para name, email e password
2. Adiciona name → erro some para name, restam email e password
3. Corrige email → resta só password
4. Corrige password → validação passa

Esse comportamento progressivo é útil para o frontend exibir todos os erros de uma vez.

## Validação semântica vs. regex

Para email, o Zod oferece `.email()` que faz validação semântica built-in. O instrutor usa isso ao invés de escrever regex manual, porque:
- É mais legível
- É mantido pela comunidade Zod
- Cobre edge cases que regex simples pode perder

## Fluxo de teste no Insomnia

O instrutor demonstra o ciclo completo de teste:
1. Request sem body → vê todos os erros
2. Adiciona JSON body com campos inválidos
3. Corrige campo por campo, validando cada regra
4. Confirma que a mensagem de sucesso só aparece quando tudo está válido

Esse padrão de teste incremental é uma boa prática para validar schemas.