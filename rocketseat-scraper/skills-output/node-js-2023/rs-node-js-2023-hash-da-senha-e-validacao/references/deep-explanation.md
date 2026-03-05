# Deep Explanation: Hash de Senha e Validação

## Por que hashing e não criptografia?

O instrutor explica a diferença fundamental: hash é **irreversível**. Diferente de criptografia (que pode ser descriptografada com a chave), o hash gera um dado que é impossível de reverter para o valor original. Isso é intencional — se o banco de dados vazar, ninguém consegue descobrir as senhas originais.

## Como funciona o sistema de rounds do bcrypt

O instrutor usa uma analogia iterativa para explicar os rounds:

1. Senha `123456` → primeiro round gera hash A
2. Hash A → segundo round gera hash B
3. Hash B → terceiro round gera hash C

Cada round pega o resultado do anterior e gera um novo hash. Mais rounds = mais difícil de descobrir por força bruta, mas também mais pesado computacionalmente.

### Trade-off de rounds

O instrutor enfatiza que **6 rounds é o valor ótimo para a maioria das aplicações web**, especialmente para operações como cadastro de usuário que acontecem relativamente poucas vezes. Se fosse uma operação de alta frequência (muitas requisições por segundo), 6 rounds seria muito pesado e gastaria muito processamento.

## O conceito de Salt

O segundo parâmetro do `hash()` pode ser:
- **Um salt** — algo aleatório e único da aplicação, usado como base para gerar o hash
- **Um número de rounds** — quantas vezes o hash será gerado iterativamente

Quando se passa um número (como 6), o bcrypt gera o salt automaticamente.

## Como funciona a verificação no login (preview)

O instrutor antecipa a dúvida: "se não dá para reverter, como verificar no login?"

O processo é:
1. Usuário informa email + senha no login
2. Sistema gera o hash da senha informada
3. Compara o hash gerado com o hash salvo no banco
4. Se forem iguais, a senha está correta

Não é reversão — é **comparação de hashes**.

## Por que validar email antes de inserir

Sem a validação prévia, tentar inserir um email duplicado resulta em erro 500 (Internal Server Error) do Prisma/banco de dados. Isso é uma experiência ruim:
- O cliente recebe um erro genérico
- Não sabe o que deu errado
- O erro 500 sugere bug no servidor, não dado inválido

Com `findUnique` + check, retornamos 409 (Conflict), que comunica claramente: "já existe um recurso com esse dado".

## O insight sobre o "core" da funcionalidade

O instrutor faz uma observação arquitetural importante: o código de hash de senha + validação de email é o **core da criação do usuário**. Esse core:
- É sempre igual, independente de como o usuário chega (HTTP, CLI, fila, etc.)
- Não depende de request/response (conceitos do controller)
- É o candidato natural para ser extraído do controller

Essa observação prepara o terreno para a separação em Use Cases/Services no padrão SOLID — o "miolinho" do controller é o que vai virar um caso de uso separado.

## findUnique vs findFirst

O `findUnique` do Prisma só funciona com campos que têm `@unique` ou `@id` no schema. Por isso no `where` só aparecem `id` e `email` — são os únicos campos únicos da tabela. Para buscar por campos não-únicos, seria necessário `findFirst`.