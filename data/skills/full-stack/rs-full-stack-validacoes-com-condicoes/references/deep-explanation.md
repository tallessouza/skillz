# Deep Explanation: Validações com Condições

## Por que separar validações por campo?

O instrutor demonstra um problema real: quando você agrupa campos numa única condição (`if (!name || !price)`), a mensagem de erro é genérica — "nome e preço são obrigatórios" — mesmo quando apenas um está faltando. O usuário da API não sabe qual campo corrigir.

A solução é simples mas importante: um `if` por campo, cada um com sua mensagem. Isso parece verboso, mas é exatamente o ponto — o instrutor mostra que essa verbosidade é o sinal natural de que você precisa de uma ferramenta melhor (schema validation).

## A armadilha dos espaços em branco

O instrutor descobre ao vivo um bug: ao enviar `"     "` (só espaços) como nome, a validação de presença (`!name`) passa, porque a string não é falsy. Pior: com muitos espaços, o `.length` é grande o suficiente para passar a validação de tamanho mínimo também.

A solução é aplicar `.trim()` antes de qualquer checagem de tamanho. Isso é um padrão que deve ser automático em qualquer validação de string.

## Valores negativos e zero

O instrutor testa enviar `-700` como preço e percebe que a API aceita. Preços negativos não fazem sentido no domínio de produtos. A validação `price < 0` é adicionada, mas o instrutor também nota que zero deveria ser inválido — um produto com preço zero é um cenário de negócio que normalmente não faz sentido.

## O acúmulo de ifs como code smell

O ponto central da aula é pedagógico: o instrutor deliberadamente constrói validação manual campo a campo para que o aluno VEJA o problema. Quando você tem 5, 6, 7 blocos de `if` seguidos, o código fica difícil de manter. Isso motiva a próxima aula sobre schema validation.

A progressão didática é:
1. Validação genérica (ruim) → Validação por campo (melhor) → Schema validation (ideal)

## Padronização de nomes de arquivos

No final da aula, o instrutor percebe inconsistência: alguns arquivos usam `camelCase` (ProductController) e outros usam `kebab-case` (product-controller). Ambos funcionam, mas padronizar é importante para manutenção. Ele escolhe `kebab-case` e renomeia todos os arquivos.

Lição: consistência > preferência pessoal. Escolha um padrão e siga em todo o projeto.

## Quando migrar para schema validation

A regra prática extraída da aula:
- **1-3 campos simples (presença apenas):** validação manual é aceitável
- **4+ campos OU regras complexas (regex, ranges, formatos):** use Zod, Joi ou Yup
- **Email, CPF, URL:** sempre use schema validation, porque regex manual é frágil

O instrutor menciona que schema validation retorna mensagens automáticas, reduz código, e centraliza regras — é a evolução natural do padrão manual.