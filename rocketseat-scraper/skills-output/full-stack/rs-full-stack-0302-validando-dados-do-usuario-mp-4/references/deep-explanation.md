# Deep Explanation: Validação de Dados do Usuário com Zod

## Por que Zod e não validação manual?

O instrutor Rodrigo demonstra que a validação com Zod centraliza todas as regras em um único schema declarativo. Em vez de escrever múltiplos `if/else` no controller para cada campo, o schema define tudo de uma vez: tipo, formato, tamanho mínimo, transformações e mensagens de erro.

A vantagem principal é que `bodySchema.parse()` faz três coisas ao mesmo tempo:
1. **Valida** — lança erro se dados inválidos
2. **Transforma** — aplica trim, toLowerCase automaticamente
3. **Tipagem** — TypeScript infere o tipo correto do retorno

## O problema do express-async-errors

Um ponto crucial da aula: sem importar `express-async-errors`, o Zod lança o erro mas o Express não consegue capturá-lo em handlers assíncronos. O Rodrigo descobriu isso durante a demonstração — quando tentou enviar dados inválidos, o erro não aparecia na resposta.

O motivo técnico: Express 4 não captura rejeições de Promises automaticamente. O `express-async-errors` faz monkey-patch nos handlers para envolver cada um em try/catch. Sem isso, erros em funções async "engolem" a exceção e a requisição fica pendurada.

O Rodrigo mencionou: "Por que não deu erro antes? Porque a gente tava lançando manual" — ou seja, com `throw new AppError(...)` síncrono, o Express captura. Mas o `bodySchema.parse()` dentro de um handler async precisa do `express-async-errors`.

**Regra prática:** sempre importe `express-async-errors` no topo do arquivo principal da aplicação, antes de qualquer rota.

## Integração Zod + Prisma enum (z.nativeEnum)

O Rodrigo importou `UserRole` diretamente de `@prisma/client` e usou `z.nativeEnum(UserRole)`. Isso garante que:

- Os valores aceitos pelo Zod são exatamente os mesmos do banco de dados
- Se adicionar um novo role no schema do Prisma e rodar migration, o Zod aceita automaticamente
- Não precisa manter uma lista manual de strings sincronizada

A opção `.default(UserRole.EMPLOYEE)` define que se o campo `role` não for enviado, o valor padrão é `EMPLOYEE`. Na demonstração, quando o Rodrigo não enviou role, voltou `EMPLOYEE`. Quando enviou `MANAGER`, funcionou. Quando enviou um valor inexistente, o Zod retornou erro dizendo que é inválido.

## Transforms como normalização no schema

O uso de `.trim()` e `.toLowerCase()` no schema é uma decisão de design importante. A normalização acontece **durante a validação**, não depois. Isso significa:

- O controller recebe dados já limpos
- Não é necessário lembrar de normalizar em cada uso
- Garante consistência: `"  Rodrigo@Email.COM  "` vira `"rodrigo@email.com"`

O Rodrigo aplicou `.trim()` tanto no nome quanto no email, e `.toLowerCase()` apenas no email — porque nomes podem ter maiúsculas intencionais.

## Mensagens de erro personalizadas

Cada validação recebe uma mensagem específica em português:
- `min(2, { message: "Nome é obrigatório" })` — mínimo de 2 caracteres
- `email({ message: "E-mail inválido" })` — formato de email
- `min(6, { message: "A senha deve ter pelo menos 6 dígitos" })` — tamanho mínimo

Na demonstração, o Rodrigo testou cada caso:
- Senha com 3 caracteres → "A senha deve ter pelo menos 6 dígitos"
- Nome com 1 letra → erro no nome
- Email sem @ → "E-mail inválido"
- Email como "100.com" → "E-mail inválido"

O Zod retorna todos os erros de uma vez (não apenas o primeiro), o que melhora a experiência do usuário.

## Padrão bodySchema.parse(request.body)

O padrão `const { ...fields } = bodySchema.parse(request.body)` é idiomático:
- `parse()` lança `ZodError` se inválido (diferente de `safeParse()` que retorna `{ success, data, error }`)
- A desestruturação já extrai apenas os campos definidos no schema — campos extras enviados pelo cliente são ignorados
- O TypeScript infere os tipos corretos automaticamente