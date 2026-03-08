# Deep Explanation: Validando Dados da Session com Zod

## Por que validar no controller e não no banco?

O instrutor destaca uma abordagem pragmática: a validação no controller serve como **primeira linha de defesa**. Quando o cliente envia dados malformados (sem email, sem senha, email inválido), o Zod intercepta imediatamente e retorna um erro estruturado — sem precisar bater no banco de dados.

Isso tem dois benefícios:
1. **Performance** — evita queries desnecessárias ao banco
2. **Clareza de erro** — ZodError retorna exatamente qual campo falhou e por quê

## A decisão de não validar tamanho da senha no login

O instrutor faz uma escolha deliberada: no endpoint de **session** (login), a senha é apenas `z.string()` sem `.min()`. O raciocínio:

> "A ideia é deixar a senha mesmo ser validada pelo próprio banco, se é igual ou não a senha."

Isso faz sentido porque:
- No **cadastro**, você define regras de força (mínimo 6 caracteres, etc.)
- No **login**, o banco vai comparar o hash — se a senha tem 1 caractere ou 100, o que importa é se confere com o hash armazenado
- Adicionar `.min(6)` no login cria um acoplamento desnecessário: se você mudar a regra de força da senha no cadastro, teria que mudar no login também

## Padrão bodySchema

O nome `bodySchema` é uma convenção usada consistentemente no curso. Indica:
- **body** — vem do `request.body`
- **Schema** — é um schema Zod

Para query params, seria `querySchema`. Para route params, `paramsSchema`. Essa convenção torna claro de onde vêm os dados.

## Fluxo de erro do Zod

Quando `bodySchema.parse(request.body)` falha, o Zod lança um `ZodError` que contém:
- Array de `issues` com cada campo que falhou
- `path` indicando o campo
- `message` com a mensagem customizada (ex: "E-mail inválido")

Se o projeto tem um error handler global que captura ZodError, o cliente recebe uma resposta estruturada automaticamente. Caso contrário, o erro 500 padrão é retornado — por isso é importante ter middleware de tratamento de exceções configurado.

## Testando a validação

O instrutor demonstra o teste manual via Insomnia:
1. Envia request **sem body** → Zod retorna erro para ambos os campos
2. Envia email inválido ("aleatório") com senha correta → Zod retorna erro de email
3. Envia email válido cadastrado + senha correta → passa na validação

Esse padrão de teste incremental é útil para verificar que cada regra do schema funciona independentemente.