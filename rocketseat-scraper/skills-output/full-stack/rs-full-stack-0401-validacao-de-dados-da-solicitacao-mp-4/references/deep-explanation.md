# Deep Explanation: Validação de Dados da Solicitação com Zod

## Contexto da aula

A aula faz parte do módulo "API do APP Refund", onde já foram implementadas autenticação e autorização. Agora o foco muda para as funcionalidades de negócio — começando pela solicitação de reembolso (refund). A controller `RefundController` já existe e o método `create` precisa validar os dados antes de persistir.

## Por que Zod e não validação manual?

O instrutor escolhe Zod porque:

1. **Declarativo** — o schema descreve a forma dos dados, não o processo de validação
2. **Mensagens automáticas para enums** — quando uma categoria inválida é enviada (ex: "x"), o Zod automaticamente retorna: "As categorias disponíveis são food, order, service, transport, accommodation e você mandou x"
3. **Composição** — schemas podem ser extraídos e reutilizados (como o `categoriesEnum` separado)
4. **Type inference** — `bodyScheme.parse()` retorna o tipo correto em TypeScript

## Decisões de design do schema

### Nome (`name`)
- `z.string().trim().min(1, "Informe o nome da solicitação")`
- O `.trim()` vem ANTES do `.min()` — isso é intencional. Se o usuário enviar `"   "` (só espaços), o trim transforma em `""`, que falha no `.min(1)`
- A mensagem é orientada à ação: "Informe o nome" ao invés de "Nome é obrigatório"

### Categoria (`category`)
- Definida como `z.enum(["food", "order", "service", "transport", "accommodation"])`
- O instrutor extrai para `const categoriesEnum = z.enum([...])` separado porque o array é grande e prejudica a legibilidade quando inline
- Vantagem do z.enum: a mensagem de erro lista TODAS as opções válidas automaticamente

### Valor (`amount`)
- `z.number().positive("O valor precisa ser positivo")`
- `.positive()` rejeita tanto zero quanto negativos — o instrutor testou ambos no Insomnia
- Testou: valor -1 → erro. Valor 0 → erro. Valor 150.25 → aceito (decimais são válidos)

### Nome do arquivo (`fileName`)
- `z.string().min(20)`
- O mínimo de 20 caracteres parece arbitrário, mas o instrutor explica: depois será criado um padrão onde o nome do arquivo incluirá data, horário e um hash no próprio nome. Isso gera nomes longos tipo `2024-01-15_143022_a8f3b2c1.png`
- Essa é uma validação de "formato futuro" — garante que o client está enviando o nome no formato esperado

## Fluxo de teste no Insomnia

O instrutor demonstra o teste progressivo:

1. **Send sem body** → todas as validações disparam de uma vez
2. **Body completo válido** → passa sem erros
3. **Categoria inválida ("x")** → Zod lista as categorias válidas
4. **Valor negativo (-1)** → "O valor precisa ser positivo"
5. **Valor zero (0)** → ainda pede valor positivo (positive = > 0, não >= 0)
6. **fileName vazio** → pede mínimo de caracteres
7. **fileName curto** → ainda falha no min(20)
8. **fileName longo com hash** → passa

Esse padrão de teste incremental é importante: valide um campo por vez para confirmar que cada regra funciona isoladamente.

## Padrão: schema dentro da controller

O instrutor define o schema DENTRO do método `create` da controller, não em arquivo separado. Isso é intencional para este estágio do projeto — mantém a validação junto da rota. Em projetos maiores, schemas podem ser extraídos para `/schemas/` ou `/validators/`.

## Mensagens customizadas vs. mensagens padrão do Zod

O Zod tem mensagens padrão em inglês. O instrutor customiza apenas onde a mensagem padrão não é clara o suficiente:
- `name` → mensagem customizada ("Informe o nome") porque "String must have at least 1 character" não é user-friendly
- `category` → sem mensagem customizada, porque o Zod gera uma lista das opções válidas automaticamente
- `amount` → mensagem customizada ("O valor precisa ser positivo")
- `fileName` → sem mensagem customizada, o padrão do min() é suficiente