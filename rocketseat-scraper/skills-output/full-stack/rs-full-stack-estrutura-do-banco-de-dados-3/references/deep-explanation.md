# Deep Explanation: Estrutura do Banco de Dados — API de Entregas

## Por que planejar visualmente antes de codar

O instrutor enfatiza o uso de ferramentas como drawsql.app para desenhar o schema antes de escrever código. O raciocínio é simples: quando você visualiza tabelas e relacionamentos, consegue identificar problemas de modelagem antes que virem bugs ou migrations de correção.

Planejar visualmente força três coisas:
1. **Pensar nas entidades** — Quais tabelas existem? O que cada uma representa?
2. **Pensar nos relacionamentos** — Como as tabelas se conectam? Quais são as cardinalidades?
3. **Pensar nos campos** — Que dados cada entidade precisa armazenar?

## Analogia do "pé de galinha" (crow's foot notation)

O instrutor usa a analogia do "pé de galinha" para explicar cardinalidade. Na notação de ER diagrams:
- O lado com o símbolo que parece um pé de galinha (três linhas divergindo) representa o lado "muitos" do relacionamento
- O lado com uma linha simples representa o lado "um"

**Exemplo concreto do instrutor:** "Uma entrega pertence a um único usuário — não dá para pegar o produto e cortar no meio, um pedaço para cada lado." Essa analogia física torna óbvio por que o relacionamento é 1:N e não N:N.

## UUID como padrão para chave primária

A escolha de UUID em vez de auto-increment tem razões práticas:
- **Segurança:** IDs sequenciais expõem informações (quantos usuários existem, quantos pedidos por dia)
- **Distribuição:** UUIDs podem ser gerados no cliente sem consultar o banco
- **Merging:** Sem conflito ao unir dados de múltiplas fontes

## Tabela de logs como padrão de auditoria

O ponto mais valioso da aula é o padrão de **tabela de logs separada** para rastrear movimentações. Em vez de apenas ter um campo `status` na tabela `deliveries` que é sobrescrito, o instrutor cria uma tabela `delivery_logs` onde cada mudança de status gera um novo registro.

**Por que isso é importante:**
- O usuário quer ver o histórico completo: "processando → saiu do CD → a caminho → entregue"
- Sobrescrever o status perde o histórico
- Com logs separados, cada movimentação tem seu próprio timestamp
- Permite construir uma timeline completa do pedido

**Fluxo de uma entrega:**
```
delivery_logs:
  1. "Pedido recebido, processando"          - 2024-01-10 10:00
  2. "Saiu do centro de distribuição"         - 2024-01-11 08:30
  3. "Em rota de entrega"                     - 2024-01-12 14:00
  4. "Entregue ao destinatário"               - 2024-01-12 16:45
```

Isso é um padrão de **event sourcing simplificado** — não chega a ser event sourcing completo, mas captura a essência de registrar eventos em vez de sobrescrever estado.

## Campo role como texto

O instrutor usa um campo `role` como TEXT na tabela de usuários para determinar permissões (vendedor, cliente, etc.). Essa abordagem é pragmática:
- Simples de implementar
- Fácil de verificar no código (`if user.role === 'seller'`)
- Extensível (basta adicionar novos valores)
- Para aplicações mais complexas, seria necessário uma tabela separada de roles/permissions, mas para este escopo é suficiente

## Cardinalidades do sistema

```
users (1) ──── (N) deliveries
  Um usuário pode comprar várias vezes = várias entregas
  Uma entrega pertence a exatamente um usuário

deliveries (1) ──── (N) delivery_logs
  Uma entrega passa por múltiplas etapas = vários logs
  Um log descreve uma movimentação de exatamente uma entrega
```

Não existe relacionamento direto entre `users` e `delivery_logs` — a conexão é sempre via `deliveries`. Para saber os logs de um usuário, faz-se JOIN passando por deliveries.