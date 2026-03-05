# Deep Explanation: Criando Schema do Prisma

## De onde vem os models?

O instrutor enfatiza que as entidades do banco devem ser derivadas dos **requisitos funcionais**, nao inventadas. A tecnica: leia os RFs e identifique keywords recorrentes — "academia", "check-in", "usuario". Cada keyword que aparece como substantivo nos requisitos provavelmente sera uma tabela.

> "Uma das coisas aqui que a gente pode ver sao as keywords, as entidades que aparecem comumente dentro dos requisitos funcionais."

Isso evita o erro comum de criar tabelas "por precaucao" que nunca sao usadas.

## O trick do DateTime opcional substituindo Boolean

Esta e a insight mais valiosa da aula. Quando voce tem um campo booleano como `isValidated`, voce armazena **uma** informacao: sim ou nao. Mas se voce trocar por `validatedAt DateTime?`:

- **null** = nao validado (equivale a `false`)
- **presente** = validado (equivale a `true`) + **quando** foi validado

Sao duas informacoes em uma unica coluna. O instrutor ressalta que isso se aplica "na maioria dos casos, nem todos" — ou seja, quando a data da acao tem valor de negocio.

> "Se eu trocar esse booleano por uma data opcional, eu tenho, alem de saber se aquilo esta validado ou nao, eu consigo saber tambem quando que ele foi validado."

## Por que password_hash e nao password

O campo nao armazena a senha — armazena um **hash** da senha. Nomear como `password` e mentir sobre o conteudo. O instrutor explica a diferenca entre:

- **Criptografia**: vai e volta (encrypt/decrypt)
- **Hashing**: so vai, nao volta (one-way)

A aplicacao usara hashing (ex: bcrypt), entao o campo deve se chamar `password_hash` para refletir que e um hash irreversivel.

> "Ao inves de salvar o nome do campo como password, eu vou salvar como password_hash, porque e isso que ele vai ser."

## createdAt/updatedAt nao e obrigatorio em toda tabela

O instrutor faz uma observacao que vai contra a pratica comum de muitos desenvolvedores:

> "Nem sempre esses campos sao necessarios em todas as tabelas. Ate porque isso ocupa espaco do banco de dados."

Ele da o exemplo concreto: "Quando seu banco de dados estiver ocupando 40GB, 50GB, isso ja comeca a virar um negocio que voce pensa." Na tabela de Gym, por exemplo, ele opta por nao ter createdAt porque nao agrega valor ao dominio.

## migrate dev vs migrate deploy

- `npx prisma migrate dev` — compara o schema.prisma com o banco, detecta diferencas, cria migration
- `npx prisma migrate deploy` — executa migrations ja criadas, sem comparar (usado em producao)

O instrutor tambem menciona que existe um comando de diff para comparar migrations com o banco, mas admite que nunca usou na pratica.

## Warning de coluna required sem default

Ao adicionar `password_hash String` (required, sem default) em uma tabela que ja poderia ter registros, o Prisma emite um warning. As solucoes:

1. Tornar o campo opcional (`String?`) — se o dominio permitir
2. Definir um valor default (`@default("")`) — mesmo que string vazia
3. Garantir que a tabela esta vazia (caso de desenvolvimento)

## Latitude e longitude como Decimal required

O instrutor explica que apps de check-in em academia tem "controle bem rigoroso" de proximidade. A latitude e longitude sao essenciais para calculos de distancia, entao nunca podem ser opcionais. Usar `Decimal` (nao `Float`) garante precisao em coordenadas geograficas.

## @@map para convencao de nomes

O Prisma usa PascalCase nos models (`CheckIn`), mas o instrutor prefere snake_case plural no banco (`check_ins`). O `@@map()` faz essa traducao. "Sempre que for separar palavras, eu gosto de trabalhar com o underline."