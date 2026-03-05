# Deep Explanation: Schema Validation

## O que é Schema Validation

Schema Validation (validação baseada em esquema) é uma abordagem onde você define **declarativamente** a forma esperada dos dados antes de processá-los. Em vez de escrever lógica imperativa de validação (`if/else`), você descreve um "molde" — o esquema — que especifica:

- **Quais propriedades** devem existir (ex: `email`, `password`, `name`)
- **Qual o tipo** de cada propriedade (string, number, boolean)
- **Qual o formato** esperado (formato de email, UUID, URL)
- **Quais as restrições** de conteúdo (mínimo de caracteres, máximo, regex)

## Analogia das Formas Geométricas (do instrutor)

Imagine que você tem duas formas geométricas: um **quadrado** e um **losango**. A pergunta é: qual delas é válida?

Para responder, você precisa de um **parâmetro de referência** — algo que diga qual é a forma ideal. Esse parâmetro é o **esquema**.

O esquema funciona como um molde ou gabarito:
- Você encaixa os dados no molde
- Se encaixou perfeitamente → válido
- Se não encaixou → inválido, com informação precisa de **onde** e **por que** falhou

Essa analogia é poderosa porque mostra que sem o esquema (o parâmetro), não há como distinguir válido de inválido. A validação precisa de uma referência explícita.

## Duas dimensões de validação

O instrutor enfatiza que schema validation opera em **duas dimensões**:

### 1. Propriedades (a estrutura)
O objeto tem os campos esperados? Faltou algum campo obrigatório? Tem campos extras não previstos?

### 2. Conteúdo (o valor)
O valor de cada campo atende às regras? O email tem `@` e pelo menos um `.`? A senha tem pelo menos 6 caracteres?

Validar apenas a presença de propriedades é insuficiente. Um campo `email` com valor `"abc"` está presente mas é inválido. O esquema captura ambas as dimensões.

## Por que esquema e não if/else

| Aspecto | if/else manual | Schema |
|---------|---------------|--------|
| Legibilidade | Difícil de entender a "forma" esperada | Declarativo, a forma é visível |
| Manutenção | Fácil esquecer um caso | Todas as regras em um lugar |
| Mensagens de erro | Manuais, inconsistentes | Automáticas, estruturadas |
| Reuso | Copy-paste | Composição e extensão |
| Tipagem | Manual | Inferência automática (Zod, etc.) |

## Quando aplicar

- **Sempre** que dados entram de fora do sistema (request body, query params, headers)
- **Sempre** que dados cruzam fronteiras de serviço (mesmo internos)
- **Opcionalmente** em boundaries de módulos internos para contratos mais rígidos

## Conexão com o ecossistema

No contexto de APIs REST com Node.js/Fastify, as bibliotecas mais comuns para schema validation são:
- **Zod** — TypeScript-first, inferência de tipos automática
- **Yup** — Similar ao Zod, mais antigo
- **JSON Schema** — Padrão da indústria, suportado nativamente pelo Fastify
- **Joi** — Popular no ecossistema Hapi/Express

O conceito é o mesmo independente da biblioteca: definir a forma esperada antes de processar.